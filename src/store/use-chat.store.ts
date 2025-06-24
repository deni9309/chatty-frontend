import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

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
  isUsersLoading: boolean
  isMessagesLoading: boolean

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
      isUsersLoading: false,
      isMessagesLoading: false,
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
        set({ isUsersLoading: true })
        try {
          const res = await api.get<AuthUser[]>('/messages/users')
          set({ users: res.data })
        } catch (error) {
          console.log('Error getting users', error)
          throw error
        } finally {
          set({ isUsersLoading: false })
        }
      },
      getMessages: async (userId: string) => {
        set({ isMessagesLoading: true })
        try {
          const res = await api.get<Message[]>('/messages/mine-and', {
            params: { userId },
          })
          set({ messages: res.data })
        } catch (error) {
          console.log('Error getting messages', error)
          throw error
        } finally {
          set({ isMessagesLoading: false })
        }
      },
      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        if (!selectedUser) {
          toast.error('No user selected')
          return
        }
        try {
          const res = await api.post<Message>('/messages/send', messageData, {
            params: { id: selectedUser._id },
          })
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
