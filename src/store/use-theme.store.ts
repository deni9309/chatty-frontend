import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { THEME_STORAGE } from '../constants/app-constants'
import { ThemeName } from '../types/themeName'

interface ThemeState {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: THEME_STORAGE,
    },
  ),
)
