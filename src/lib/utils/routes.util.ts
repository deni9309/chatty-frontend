import excludedRoutes from '../../constants/excluded-routes.constant'

export const isPublicRoute = (path: string) => excludedRoutes.includes(path)
