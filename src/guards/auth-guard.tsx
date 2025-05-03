import { Navigate } from 'react-router-dom'

import Loader from '../components/shared/loader'
import { useAuthStore } from '../store/use-auth.store'
import { usePath } from '../hooks/use-path.hook'
import { isPublicRoute } from '../lib/utils/routes.util'

interface AuthGuardProps {
  children: React.JSX.Element
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { authUser: user, isCheckingAuth } = useAuthStore()
  const { path } = usePath()

  console.log(isPublicRoute(path))

 // if (isCheckingAuth) return <Loader />

  if (!isPublicRoute(path) && !user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default AuthGuard
