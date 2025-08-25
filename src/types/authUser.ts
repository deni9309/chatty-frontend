import { Pagination } from './pagination'

export type AuthUser = {
  _id: string
  fullName: string
  email: string
  profilePic: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}


export type AuthUserPaginated = {
  data: AuthUser[]
  pagination: Pagination
}