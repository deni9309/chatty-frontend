import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AuthUser } from '../types/authUser'
import { AUTH_STORAGE, TOKEN } from '../constants/app-constants'
import api from '../lib/axios'
import { RegisterFormType } from '../schemas/register.schema'
import { LoginFormType } from '../schemas/login.schema'

interface AuthState {
  authUser: AuthUser | null
  isLoggingIn: boolean
  isSigningUp: boolean
  isLoggingOut: boolean
  isUpdatingProfile: boolean
  isCheckingAuth: boolean
  setAuthUser: (user: AuthUser | null) => void
  checkAuth: () => Promise<void>
  setCheckingAuth: (value: boolean) => void
  register: (data: RegisterFormType) => Promise<void>
  login: (data: LoginFormType) => Promise<void>
  logout: () => Promise<void>
  setToken: (token: string) => void
  getToken: () => string | null
  clearToken: () => void
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

      setAuthUser: (user) => set({ authUser: user }),
      checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
          const token = get().getToken()
          if (!token) {
            set({ isCheckingAuth: false })
            return
          }

          const res = await api.get<AuthUser>('/auth/me')
          set({ authUser: res.data })
        } catch (error) {
          console.log('Error checking auth', error)
          get().clearToken()
          set({ authUser: null })
        } finally {
          set({ isCheckingAuth: false })
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
    }),
    { name: AUTH_STORAGE },
  ),
)
