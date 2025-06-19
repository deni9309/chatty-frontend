import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_THEME, THEME_STORAGE } from '../constants/app-constants'
import { Theme } from '../types/theme'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => {
        set({ theme })
      },
      resetTheme() {
        set({ theme: DEFAULT_THEME })
      },
    }),
    {
      name: THEME_STORAGE,
    },
  ),
)
