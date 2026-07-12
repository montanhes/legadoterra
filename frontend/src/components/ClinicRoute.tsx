import { Navigate, Outlet, useLocation } from 'react-router'
import { useUser } from '../hooks/useAuth'

export default function ClinicRoute() {
  const { data: user, isLoading } = useUser()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />
  }

  if (!user.clinic) {
    return <Navigate to="/clinica/cadastro" replace />
  }

  return <Outlet />
}
