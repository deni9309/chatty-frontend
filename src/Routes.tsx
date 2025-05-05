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
import GuestGuard from './guards/guest-guard'

const router = createBrowserRouter([
  {
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/home', element: <HomePage /> },
      { path: '/profile', element: <ProfilePage /> },
      // { path: '/chats/:_id', element: <ChatDetails /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/register',
        element: (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        ),
      },
      {
        path: '/login',
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
    ],
  },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/error', element: <ErrorPage /> },
])

export default router
