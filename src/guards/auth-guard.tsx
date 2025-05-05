import { Navigate, useLocation } from 'react-router-dom'

import Loader from '../components/shared/loader'
import { useAuthStore } from '../store/use-auth.store'
import { usePath } from '../hooks/use-path.hook'
import { isPublicRoute } from '../lib/utils/routes.util'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.JSX.Element
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { authUser: user, isCheckingAuth, checkAuth } = useAuthStore()
  const { path } = usePath()
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

  if (!isPublicRoute(path) && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AuthGuard
