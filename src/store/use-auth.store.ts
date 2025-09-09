import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AuthUser } from '../types/authUser'
import { AUTH_STORAGE, TOKEN } from '../constants/app-constants'
import api from '../lib/axios'
import { PROFILE_IMAGE_DELETED } from '../constants/profile-image-delete.constant'
import { io } from 'socket.io-client'
import { AxiosError } from 'axios'
import { AuthState } from '../interfaces/use-auth.store.interface'

const baseURL: string = import.meta.env.VITE_SOCKET_URL

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
      socket: null,
      userStatus: 'offline',

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

          if (res.data && !get().socket?.connected) {
            try {
              await get().connectSocket()
            } catch (err) {
              console.warn('Socket connection failed during auth check:', err)
            }
          }
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

          try {
            await get().connectSocket()
          } catch (err) {
            console.warn('Socket connection failed, but registration successful:', err)
          }
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

          try {
            await get().connectSocket()
          } catch (err) {
            console.warn('Socket connection failed, but login successful:', err)
          }
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
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status !== 401) {
            console.log('Error logging out user', err)
            throw err
          }
        } finally {
          get().disconnectSocket()
          set({ authUser: null })
          get().clearToken()
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
      connectSocket: async () => {
        const { authUser, socket: existingSocket } = get()

        if (!authUser) {
          console.log('No authenticated user, skipping socket connection')
          return
        }

        if (existingSocket?.connected) {
          console.log('Socket already connected')
          existingSocket.emit('request_online_users')
          return
        }

        // Clear stale online users before connecting
        set({ onlineUsers: [] })

        try {
          const socket = io(baseURL, {
            query: {
              userId: authUser._id,
            },
          })

          socket.connect()
          set({ socket })

          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Socket connection timeout'))
            }, 10000)

            socket.on('connect', () => {
              clearTimeout(timeout)
              console.log('Connected to server with socket ID:', socket.id)
              set({ userStatus: 'online' })

              // Request current online users immediately after connection
              socket.emit('request_online_users')

              resolve()
            })

            socket.on('connect_error', (error) => {
              clearTimeout(timeout)
              console.log('Socket connection error:', error)
              set({ userStatus: 'offline' })
              reject(error)
            })
          })

          socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason)
            set({ userStatus: 'offline', onlineUsers: [] })
          })

          socket.on('get_online_users', (userIds: string[]) => {
            console.log('Online users updated:', userIds)
            set({ onlineUsers: userIds })
          })

          socket.on(
            'user_status',
            ({ userId, status }: { userId: string; status: 'online' | 'offline' }) => {
              if (userId === authUser._id) {
                set({ userStatus: status })
              }
            },
          )

          console.log('Socket connection established successfully')
        } catch (error) {
          console.error('Failed to connect socket:', error)

          const failedSocket = get().socket
          if (failedSocket) {
            failedSocket.disconnect()
            set({ socket: null })
          }
          set({ userStatus: 'offline', onlineUsers: [] })
          throw error
        }
      },

      disconnectSocket: () => {
        const socket = get().socket
        if (!socket) return

        socket.disconnect()
        set({ socket: null, onlineUsers: [], userStatus: 'offline' })
      },
    }),
    {
      name: AUTH_STORAGE,
      partialize: (state) => ({
        authUser: state.authUser,
        isLoggingIn: state.isLoggingIn,
        isSigningUp: state.isSigningUp,
        isLoggingOut: state.isLoggingOut,
        isUpdatingProfile: state.isUpdatingProfile,
        isCheckingAuth: state.isCheckingAuth,
        userStatus: state.userStatus,
      }),
    },
  ),
)
