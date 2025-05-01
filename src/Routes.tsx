import { createBrowserRouter } from 'react-router-dom'

import RegisterPage from './pages/register-page'
import LoginPage from './pages/login-page'
import HomePage from './pages/home-page'
import AuthLayout from './components/layouts/auth-layout'
import MainLayout from './components/layouts/main.layout'
import ProfilePage from './pages/profile-page'
//import ChatDetails from './components/chat/chat-details'
import ErrorPage from './pages/shared/error-page'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
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
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
  { path: '/error', element: <ErrorPage /> },
])

export default router
