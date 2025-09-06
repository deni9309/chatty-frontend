import { AuthUser } from '../types/authUser'
import { Message } from '../types/message'
import { Pagination } from '../types/pagination'
import { UnreadMessage } from '../types/unreadMessage'

export interface MessageData {
  text?: string
  image?: File
}

export interface ChatState {
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

  // Filters
  onlineOnlyFilter: boolean

  // Actions
  setMessages: (messages: Message[]) => void
  setUnreadMessages: (messages: UnreadMessage[]) => void
  markMessagesAsRead: (senderId: string) => Promise<void>
  findUnreadMessageIds: (messages: Message[]) => string[]

  setUsers: (users: AuthUser[]) => void
  setSelectedUser: (selectedUser: AuthUser | null) => void

  getUsers: (params: { page: number; search: string }) => Promise<void>
  searchUsers: (searchTerm: string) => Promise<void>
  changeUserPage: (page: number) => Promise<void>

  getMessages: (userId: string, page?: number) => Promise<void>
  loadMoreMessages: (userId: string) => Promise<void>
  resetMessages: () => void
  getUnreadMessages: () => Promise<void>
  sendMessage: (messageData: MessageData) => Promise<void>

  setUserTyping: (userId: string, isTyping: boolean) => void
  startTyping: () => void
  stopTyping: () => void

  // Subscription Actions
  subscribeToTyping: () => void
  unsubscribeFromTyping: () => void
  subscribeToMessages: () => void
  unsubscribeFromMessages: () => void

  // Filter Actions
  toggleOnlineOnlyFilter: () => Promise<void>
}