import { RouterProvider } from 'react-router-dom'
import router from './Routes'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/use-theme.store'
import { useEffect } from 'react'

const App = () => {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="bg-base-100">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
