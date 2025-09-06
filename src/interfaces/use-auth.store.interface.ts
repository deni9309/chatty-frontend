import { Socket } from 'socket.io-client'
import { AuthUser } from '../types/authUser'
import { RegisterFormType } from '../schemas/register.schema'
import { LoginFormType } from '../schemas/login.schema'
import { UpdateProfileFormType } from '../schemas/update-profile.schema'

export interface AuthState {
  authUser: AuthUser | null
  isLoggingIn: boolean
  isSigningUp: boolean
  isLoggingOut: boolean
  isUpdatingProfile: boolean
  isCheckingAuth: boolean
  onlineUsers: string[]
  socket: Socket | null
  userStatus: 'online' | 'offline'
  setAuthUser: (user: AuthUser | null) => void
  checkAuth: (silent?: boolean) => Promise<void>
  setCheckingAuth: (value: boolean) => void
  register: (data: RegisterFormType) => Promise<void>
  login: (data: LoginFormType) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileFormType) => Promise<void>
  setToken: (token: string) => void
  getToken: () => string | null
  clearToken: () => void
  setOnlineUsers: (users: string[]) => void
  connectSocket: () => Promise<void>
  disconnectSocket: () => void
}
