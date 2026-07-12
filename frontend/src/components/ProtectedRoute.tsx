import { Navigate, Outlet, useLocation } from 'react-router'
import { useUser } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { data: user, isLoading } = useUser()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />
  }

  return <Outlet />
}
