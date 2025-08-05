import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import api from '../lib/axios'
import { CHAT_STORAGE } from '../constants/app-constants'
import { AuthUser } from '../types/authUser'
import { Message, SingleMessage } from '../types/message'
import { mapSingleMessageToMessage } from '../lib/utils/type-mappers'
import { useAuthStore } from './use-auth.store'

interface MessageData {
  text?: string
  image?: File
}

interface ChatState {
  messages: Message[]
  users: AuthUser[]
  selectedUser: AuthUser | null
  areUsersLoading: boolean
  areMessagesLoading: boolean
  typingUsers: Set<string> // Users who are currently typing
  typingTimeout: NodeJS.Timeout | null

  setMessages: (messages: Message[]) => void
  setUsers: (users: AuthUser[]) => void
  setSelectedUser: (selectedUser: AuthUser | null) => void
  getUsers: () => Promise<void>
  getMessages: (userId: string) => Promise<void>
  sendMessage: (messageData: MessageData) => Promise<void>
  setUserTyping: (userId: string, isTyping: boolean) => void
  startTyping: () => void
  stopTyping: () => void

  subscribeToTyping: () => void
  unsubscribeFromTyping: () => void
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
      typingUsers: new Set(),
      typingTimeout: null,
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
          const authStore = useAuthStore.getState()
          if (!authStore.authUser) {
            return
          }

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
          const authStore = useAuthStore.getState()
          if (!authStore.authUser) {
            return
          }

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

          const formData = new FormData()
          if (messageData.text) formData.append('text', messageData.text)
          if (messageData.image) formData.append('image', messageData.image)

          const res = await api.post<SingleMessage>(
            `/messages/send/${selectedUser._id}`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          )

          const message: Message = mapSingleMessageToMessage(res.data)

          set({ messages: [...messages, message] })
        } catch (error) {
          console.log('Error sending message', error)
          throw error
        }
      },
      setUserTyping: (userId, isTyping) => {
        set((state) => {
          const newTypingUsers = new Set(state.typingUsers)
          if (isTyping) {
            newTypingUsers.add(userId)
          } else {
            newTypingUsers.delete(userId)
          }
          return { typingUsers: newTypingUsers }
        })
      },
      startTyping: () => {
        const { selectedUser, typingTimeout } = get()
        if (!selectedUser) return
        const socket = useAuthStore.getState().socket
        if (!socket) return

        if (typingTimeout) clearTimeout(typingTimeout)

        socket.emit('typing', { receiverId: selectedUser._id })
        const newTimeout = setTimeout(() => {
          get().stopTyping()
        }, 3000)

        set({ typingTimeout: newTimeout })
      },
      stopTyping: () => {
        const { selectedUser, typingTimeout } = get()
        if (!selectedUser) return
        const socket = useAuthStore.getState().socket
        if (!socket) return

        if (typingTimeout) {
          clearTimeout(typingTimeout)
          set({ typingTimeout: null })
        }

        socket.emit('stop_typing', { receiverId: selectedUser._id })
      },
      subscribeToTyping: () => {
        const socket = useAuthStore.getState().socket
        if (!socket) return

        socket.on('user_typing', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
          get().setUserTyping(userId, isTyping)
        })
      },
      unsubscribeFromTyping: () => {
        const socket = useAuthStore.getState().socket
        if (!socket) return

        socket.off('user_typing')
      },
      subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket
        if (!socket) return

        socket.on('new_message', (newMessage: Message) => {
          const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
          if (!isMessageSentFromSelectedUser) return

          set({ messages: [...get().messages, newMessage] })

          get().subscribeToTyping()
        })
      },
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        if (!socket) return

        socket.off('new_message')

        get().unsubscribeFromTyping()

        const { typingTimeout } = get()
        if (typingTimeout) clearTimeout(typingTimeout)
        set({ typingUsers: new Set(), typingTimeout: null })
      },
    }),
    {
      name: CHAT_STORAGE,
      partialize: (state) => ({
        messages: state.messages,
        users: state.users,
        selectedUser: state.selectedUser,
        areMessagesLoading: state.areMessagesLoading,
        areUsersLoading: state.areUsersLoading,
      }),
    },
  ),
)
