import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '../types/authUser'
import { AUTH_STORAGE, TOKEN } from '../constants/app-constants'
import api from '../lib/axios'

interface AuthState {
  authUser: AuthUser | null
  isLoggingIn: boolean
  isSigningUp: boolean
  isUpdatingProfile: boolean
  isCheckingAuth: boolean
  setAuthUser: (user: AuthUser | null) => void
  checkAuth: () => Promise<void>
  setCheckingAuth: (value: boolean) => void
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
    {
      name: AUTH_STORAGE,
    },
  ),
)
