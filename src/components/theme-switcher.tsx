import { useEffect } from 'react'
import { Send } from 'lucide-react'

import { useThemeStore } from '../store/use-theme.store'
import { themes } from '../constants/daisyui-themes.constant'
import { cn } from '../lib/utils/clsx'

const previewMessages = [
  { _id: '1', content: 'Hello. Are you there?', isSent: false },
  { _id: '2', content: 'Yes. I am already here. How are you today?', isSent: true },
]

const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="container h-screen mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
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
      </div>

      <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
        {previewMessages.map((m) => (
          <div key={m._id} className={cn('flex', m.isSent ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[80%] rounded-xl p-3 shadow-sm',
                m.isSent ? 'bg-primary text-primary-content' : 'bg-base-300',
              )}
            >
              <p className="text-sm">{m.content}</p>
              <p
                className={cn(
                  'text-[10px] mt-1.5',
                  m.isSent ? 'text-primary-content/70' : 'text-base-content/70',
                )}
              >
                12:00 PM
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThemeSwitcher
