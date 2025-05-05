import { ReactNode } from 'react'
import { useAuthStore } from '../store/use-auth.store'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from 'lucide-react'

interface GuestGuardProps {
  children: ReactNode
}
export default function GuestGuard({ children }: GuestGuardProps) {
  const { authUser: user, isCheckingAuth } = useAuthStore()
  const location = useLocation()

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
