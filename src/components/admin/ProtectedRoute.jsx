import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AdminLoader from './AdminLoader.jsx'
import { useAuth } from '../../hooks/useAuth.js'

// "Guardián" de las rutas del panel: sin sesión de administradora, manda al login.
// Guardamos en "state" la página que se quería abrir para volver ahí después del login.
function ProtectedRoute() {
  const { isLoading, isAdmin } = useAuth()
  const location = useLocation()

  if (isLoading) return <AdminLoader />
  if (!isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export default ProtectedRoute
