import { createBrowserRouter } from 'react-router-dom'

import RegisterPage from './pages/register-page'
import LoginPage from './pages/login-page'
import HomePage from './pages/home-page'
import AuthLayout from './components/layouts/auth-layout'
import MainLayout from './components/layouts/main.layout'

//import ChatDetails from './components/chat/chat-details'
import ErrorPage from './pages/shared/error-page'
import SettingsPage from './pages/settings-page'
import AuthGuard from './guards/auth-guard'
import ProfilePage from './pages/profile-page'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        ),
      },
      {
        path: '/home',
        element: (
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        ),
      },
      {
        path: '/profile',
        element: (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        ),
      },
      {
        path: '/settings',
        element: (
          <AuthGuard>
            <SettingsPage />
          </AuthGuard>
        ),
      },
      // { path: '/chats/:_id', element: <ChatDetails /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
  { path: '/error', element: <ErrorPage /> },
])

export default router
