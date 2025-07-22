import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AuthUser } from '../types/authUser'
import { AUTH_STORAGE, TOKEN } from '../constants/app-constants'
import api from '../lib/axios'
import { RegisterFormType } from '../schemas/register.schema'
import { LoginFormType } from '../schemas/login.schema'
import { UpdateProfileFormType } from '../schemas/update-profile.schema'
import { PROFILE_IMAGE_DELETED } from '../constants/profile-image-delete.constant'

interface AuthState {
  authUser: AuthUser | null
  isLoggingIn: boolean
  isSigningUp: boolean
  isLoggingOut: boolean
  isUpdatingProfile: boolean
  isCheckingAuth: boolean
  onlineUsers: AuthUser[]
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
  setOnlineUsers: (users: AuthUser[]) => void
  lastUpdated: number
  isRefreshing: boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isLoggingIn: false,
      isSigningUp: false,
      isLoggingOut: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      lastUpdated: 0,
      isRefreshing: false,

      setAuthUser: (user) => set({ authUser: user }),
      checkAuth: async (silent = false) => {
        if (silent) {
          set({ isRefreshing: true })
        } else {
          set({ isCheckingAuth: true })
        }

        try {
          const token = get().getToken()
          if (!token) {
            if (silent) {
              set({ isRefreshing: false })
            } else {
              set({ isCheckingAuth: false })
            }
            return
          }

          const res = await api.get<AuthUser>('/auth/me')
          set({ authUser: res.data, lastUpdated: Date.now() })
        } catch (error) {
          console.log('Error checking auth', error)
          get().clearToken()
          set({ authUser: null })
        } finally {
          if (silent) {
            set({ isRefreshing: false })
          } else {
            set({ isCheckingAuth: false })
          }
        }
      },
      setCheckingAuth: (value) => set({ isCheckingAuth: value }),
      register: async (data) => {
        set({ isSigningUp: true })
        try {
          const res = await api.post<AuthUser & { token: string }>('/auth/register', data)
          const { token, ...authUser } = res.data
          set({ authUser })
          get().setToken(token)
        } catch (error) {
          console.log('Error registering user', error)
          throw error
        } finally {
          set({ isSigningUp: false })
        }
      },
      login: async (data) => {
        set({ isLoggingIn: true })
        try {
          const res = await api.post<AuthUser & { token: string }>('/auth/login', data)
          const { token, ...authUser } = res.data
          set({ authUser })
          get().setToken(token)
        } catch (error) {
          console.log('Error logging in user', error)
          throw error
        } finally {
          set({ isLoggingIn: false })
        }
      },
      logout: async () => {
        set({ isLoggingOut: true })
        try {
          await api.post('/auth/logout')
          get().clearToken()
          set({ authUser: null })
          get().checkAuth()
        } catch (error) {
          console.log('Error logging out user', error)
          throw error
        } finally {
          set({ isLoggingOut: false })
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
          const formData = new FormData()
          if (data.email) formData.append('email', data.email)
          if (data.fullName) formData.append('fullName', data.fullName)

          if (data.profilePic === PROFILE_IMAGE_DELETED) {
            formData.append('profilePic', '')
          } else if (data.profilePic instanceof File) {
            formData.append('profilePic', data.profilePic)
          }

          if (!formData.has('email') && !formData.has('fullName') && !formData.has('profilePic')) {
            throw new Error('No data to update')
          }

          const res = await api.put<AuthUser>('/auth/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })

          set({ authUser: res.data })
        } catch (error) {
          console.log('Error updating profile', error)
          throw error
        } finally {
          set({ isUpdatingProfile: false })
        }
      },
      setToken: (token) => {
        localStorage.setItem(TOKEN, token)
      },
      getToken: () => {
        const token = localStorage.getItem(TOKEN)
        return token ? `Bearer ${token}` : null
      },
      clearToken: () => {
        localStorage.removeItem(TOKEN)
        set({ authUser: null })
      },
      setOnlineUsers: (users) => set({ onlineUsers: users }),
    }),
    { name: AUTH_STORAGE },
  ),
)
