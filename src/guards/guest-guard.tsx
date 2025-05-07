import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '../store/use-auth.store'
import { Navigate, useLocation } from 'react-router-dom'
import Loader from '../components/shared/loader'

interface GuestGuardProps {
  children: ReactNode
}
export default function GuestGuard({ children }: GuestGuardProps) {
  const { authUser: user, isCheckingAuth, checkAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return (
      <div className="f-center h-screen">
        <Loader />
      </div>
    )
  }

  if (user) return <Navigate to="/" state={{ from: location }} replace />

  return <>{children}</>
}
