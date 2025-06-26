import excludedRoutes from '../../constants/excluded-routes.constant'

export const isPublicRoute = (path: string) => excludedRoutes.includes(path)

export const isChatListVisible = (path: string) => path !== '/profile' && path !== '/settings'
