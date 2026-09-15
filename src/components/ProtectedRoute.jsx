import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-block">
        <span className="spinner" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/giris" replace />
  }

  return children
}
