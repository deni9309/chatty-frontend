export type UnreadMessage = {
  _id: string
  senderId: string
  receiverId: string
  messageId: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  isRead: boolean
}