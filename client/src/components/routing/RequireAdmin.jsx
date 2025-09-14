import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div className="p-10 text-center text-sm text-gray-500">Loading…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
