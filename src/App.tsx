import { RouterProvider } from 'react-router-dom'
import router from './Routes'
import AuthGuard from './guards/auth-guard'

const App = () => {
  return (
    <AuthGuard>
      <RouterProvider router={router} />
    </AuthGuard>
  )
}

export default App
