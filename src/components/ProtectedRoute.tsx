import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ requiredRole }: { requiredRole: 'FARMER' | 'ADMIN' }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={requiredRole === 'ADMIN' ? '/login/volunteer' : '/login/farmer'} replace />
  }

  if (user.role !== requiredRole) {
    return <Navigate to={requiredRole === 'ADMIN' ? '/login/volunteer' : '/login/farmer'} replace />
  }

  return <Outlet />
}
