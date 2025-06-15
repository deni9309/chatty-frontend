import { useEffect } from 'react'

import { useThemeStore } from '../store/use-theme.store'
import { themes } from '../constants/daisyui-themes.constant'
import { cn } from '../lib/utils/clsx'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Theme</h2>
        <p className="text-sm text-base-content/70">Choose your theme</p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {themes.map((t) => (
          <button
            key={t}
            className={cn(
              'group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors',
              theme === t ? 'bg-base-200' : 'hover:bg-base-200/50',
            )}
            onClick={() => setTheme(t)}
          >
            <div className="relative w-full h-8 rounded-md overflow-hidden" data-theme={t}>
              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary" />
                <div className="rounded bg-secondary" />
                <div className="rounded bg-accent" />
                <div className="rounded bg-neutral" />
              </div>
            </div>
            <span className="text-[11px] font-medium truncate w-full text-center">
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

export default ThemeSwitcher
