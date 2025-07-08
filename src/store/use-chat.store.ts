import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import api from '../lib/axios'
import { CHAT_STORAGE } from '../constants/app-constants'
import { AuthUser } from '../types/authUser'
import { Message } from '../types/message'

interface MessageData {
  text?: string
  image?: string
}

interface ChatState {
  messages: Message[]
  users: AuthUser[]
  selectedUser: AuthUser | null
  areUsersLoading: boolean
  areMessagesLoading: boolean

  setMessages: (messages: Message[]) => void
  setUsers: (users: AuthUser[]) => void
  setSelectedUser: (selectedUser: AuthUser | null) => void
  getUsers: () => Promise<void>
  getMessages: (userId: string) => Promise<void>
  sendMessage: (messageData: MessageData) => Promise<void>
  subscribeToMessages: () => void
  unsubscribeFromMessages: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      users: [],
      selectedUser: null,
      areUsersLoading: false,
      areMessagesLoading: false,
      setMessages(messages) {
        set({ messages })
      },
      setUsers(users) {
        set({ users })
      },
      setSelectedUser(selectedUser) {
        set({ selectedUser })
      },
      getUsers: async () => {
        set({ areUsersLoading: true })
        try {
          const res = await api.get<AuthUser[]>('/messages/users')
          set({ users: res.data })
        } catch (error) {
          console.log('Error getting users', error)
          throw error
        } finally {
          set({ areUsersLoading: false })
        }
      },
      getMessages: async (userId: string) => {
        set({ areMessagesLoading: true })
        try {
          const res = await api.get<Message[]>(`/messages/mine-and/${userId}`)
          set({ messages: res.data })
        } catch (error) {
          console.log('Error getting messages', error)
          throw error
        } finally {
          set({ areMessagesLoading: false })
        }
      },
      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        try {
          if (!selectedUser) {
            throw new Error('No selected user')
          }

          const res = await api.post<Message>(`/messages/send/${selectedUser._id}`, messageData)
          set({ messages: [...messages, res.data] })
        } catch (error) {
          console.log('Error sending message', error)
          throw error
        }
      },
      subscribeToMessages: () => {
        // const { selectedUser } = get()
        // if (!selectedUser) return
        // const socket = useAuthStore.getState().socket
        // if (!socket) return
        // socket.on('newMessage', (newMessage: Message) => {
        //   const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
        //   if (!isMessageSentFromSelectedUser) return
        //   set({
        //     messages: [...get().messages, newMessage],
        //   })
        // })
      },
      unsubscribeFromMessages: () => {
        // const socket = useAuthStore.getState().socket
        // if (!socket) return
        // socket.off('newMessage')
      },
    }),
    {
      name: CHAT_STORAGE,
    },
  ),
)
