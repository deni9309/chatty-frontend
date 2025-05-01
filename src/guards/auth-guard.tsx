//import { useEffect } from 'react'

//import Loader from '../components/shared/loader'

import { isPublicRoute } from '../lib/utils/routes.util'
import { usePath } from '../hooks/use-path.hook'

interface AuthGuardProps {
  children: React.JSX.Element
}

const AuthGuard = ({ children }: AuthGuardProps) => {

  const { path } = usePath()
  const user = false
  // useEffect(() => {
  //   if (user) authenticatedVar(true)
  // }, [user])

  // useEffect(() => {
  //   if (error?.networkError) {
  //     snackVar(UNKNOWN_ERROR_SNACK_MESSAGE)
  //   }
  // }, [error])

  // if (loading && error) return <Loader />

  return <>{isPublicRoute(path) ? children : user && children}</>
}

export default AuthGuard
