import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import api from '../lib/axios'
import { CHAT_STORAGE } from '../constants/app-constants'
import { AuthUser, AuthUserPaginated } from '../types/authUser'
import { Message, MessagePaginated, SingleMessage } from '../types/message'
import { mapSingleMessageToMessage } from '../lib/utils/type-mappers'
import { useAuthStore } from './use-auth.store'
import { UnreadMessage } from '../types/unreadMessage'
import { MESSAGE_PAGE_NUMBER, MESSAGE_PAGE_SIZE } from '../constants/message.constants'
import { Pagination } from '../types/pagination'
import { USER_PAGE_SIZE } from '../constants/user.constants'

interface MessageData {
  text?: string
  image?: File
}

interface ChatState {
  messages: Message[]
  unreadMessages: UnreadMessage[]
  users: AuthUser[]
  selectedUser: AuthUser | null
  areUsersLoading: boolean
  areMessagesLoading: boolean

  // Message Pagination
  hasMoreMessages: boolean
  currentPage: number

  // User Pagination
  userPagination: Pagination
  userSearchTerm: string

  // Typing State
  typingUsers: Set<string> // Users who are currently typing
  typingTimeout: NodeJS.Timeout | null

  // Actions
  setMessages: (messages: Message[]) => void
  setUnreadMessages: (messages: UnreadMessage[]) => void
  markMessagesAsRead: (senderId: string) => Promise<void>
  findUnreadMessageIds: (messages: Message[]) => string[]

  setUsers: (users: AuthUser[]) => void
  setSelectedUser: (selectedUser: AuthUser | null) => void

  getUsers: (params: { page: number; search: string }) => Promise<void>
  searchUsers: (searchTerm: string) => Promise<void>
  loadMoreUsers: () => Promise<void>

  getMessages: (userId: string, page?: number) => Promise<void>
  loadMoreMessages: (userId: string) => Promise<void>
  resetMessages: () => void
  getUnreadMessages: () => Promise<void>
  sendMessage: (messageData: MessageData) => Promise<void>

  setUserTyping: (userId: string, isTyping: boolean) => void
  startTyping: () => void
  stopTyping: () => void

  // Subscriptions
  subscribeToTyping: () => void
  unsubscribeFromTyping: () => void
  subscribeToMessages: () => void
  unsubscribeFromMessages: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      unreadMessages: [],
      users: [],
      selectedUser: null,
      areUsersLoading: false,
      areMessagesLoading: false,

      // Message Pagination
      hasMoreMessages: true,
      currentPage: 1,

      // User Pagination
      userPagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasMore: true,
      },
      userSearchTerm: '',

      typingUsers: new Set(),
      typingTimeout: null,
      setMessages(messages) {
        set({ messages })
      },
      setUnreadMessages(unreadMessages) {
        set({ unreadMessages })
      },
      markMessagesAsRead: async (senderId) => {
        try {
          const res = await api.put(`/messages/mark-read/${senderId}`)
          console.log('Messages marked as read', res.data)

          await get().getUnreadMessages()
        } catch (error) {
          console.log('Error marking messages as read', error)
          throw error
        }
      },
      findUnreadMessageIds: (messages: Message[]) => {
        const { unreadMessages } = get()

        return unreadMessages
          .filter((unreadMsg) => messages.some((msg) => msg._id === unreadMsg.messageId))
          .map((unreadMsg) => unreadMsg.messageId)
      },
      setUsers(users) {
        set({ users })
      },
      setSelectedUser(selectedUser) {
        set({ selectedUser })
      },
      getUsers: async ({ page, search }) => {
        set({ areUsersLoading: true })
        try {
          const authUser = useAuthStore.getState().authUser
          if (!authUser) return

          const res = await api.get<AuthUserPaginated>('/messages/users', {
            params: {
              page,
              search,
              limit: USER_PAGE_SIZE,
            },
          })

          const { data, pagination } = res.data

          set((state) => ({
            users: page === 1 ? data : [...state.users, ...data],
            userPagination: pagination,
          }))
        } catch (error) {
          console.log('Error getting users', error)
          throw error
        } finally {
          set({ areUsersLoading: false })
        }
      },
      searchUsers: async (searchTerm) => {
        set({ userSearchTerm: searchTerm, users: [], selectedUser: null })
        await get().getUsers({ page: 1, search: searchTerm })
      },
      loadMoreUsers: async () => {
        const { areUsersLoading, userPagination, userSearchTerm } = get()
        if (areUsersLoading || !userPagination.hasMore) return

        const nextPage = userPagination.currentPage + 1
        await get().getUsers({ page: nextPage, search: userSearchTerm })
      },
      getMessages: async (userId: string, page = MESSAGE_PAGE_NUMBER) => {
        set({ areMessagesLoading: true })
        try {
          const authStore = useAuthStore.getState()
          if (!authStore.authUser) return

          const res = await api.get<MessagePaginated>(
            `/messages/mine-and/${userId}?page=${page}&limit=${MESSAGE_PAGE_SIZE}`,
          )

          set((state) => {
            let newMessages: Message[]

            if (page === 1) {
              newMessages = res.data.messages
            } else {
              const existingIds = new Set(state.messages.map((m) => m._id))
              const uniqueNewMessages = res.data.messages.filter((m) => !existingIds.has(m._id))
              newMessages = [...uniqueNewMessages, ...state.messages]
            }

            return {
              messages: newMessages,
              hasMoreMessages: res.data.pagination.hasMore,
              currentPage: page,
            }
          })
        } catch (error) {
          console.log('Error getting messages', error)
          throw error
        } finally {
          set({ areMessagesLoading: false })
        }
      },
      loadMoreMessages: async (userId: string) => {
        const { currentPage, hasMoreMessages, areMessagesLoading } = get()
        if (!hasMoreMessages || areMessagesLoading) return

        try {
          await get().getMessages(userId, currentPage + 1)
        } catch (error) {
          console.log('Error loading more messages', error)
          throw error
        }
      },
      resetMessages: () => {
        set({ messages: [], currentPage: MESSAGE_PAGE_NUMBER, hasMoreMessages: true })
      },
      getUnreadMessages: async () => {
        set({ areMessagesLoading: true })
        try {
          const authStore = useAuthStore.getState()
          if (!authStore.authUser) {
            return
          }
          const res = await api.get<UnreadMessage[]>('/messages/unread')
          set({ unreadMessages: res.data })
        } catch (error) {
          console.log('Error getting unread messages', error)
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
        const selectedUser = get().selectedUser

        if (!socket || !selectedUser) return

        socket.on('user_typing', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
          if (userId === selectedUser._id) {
            get().setUserTyping(userId, isTyping)
          }
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
        unreadMessages: state.unreadMessages,
        users: state.users,
        selectedUser: state.selectedUser,
      }),
    },
  ),
)
