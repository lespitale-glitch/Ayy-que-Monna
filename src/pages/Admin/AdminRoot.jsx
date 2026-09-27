import { Outlet, ScrollRestoration } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext.jsx'

// Raíz de todas las rutas /admin. Se carga aparte (lazy), así las clientas
// de la tienda nunca descargan el código del panel.
function AdminRoot() {
  return (
    <AuthProvider>
      {/* React 19 lleva estas etiquetas al <head>: el panel no debe aparecer en buscadores */}
      <title>Panel — Ayy Que Monna</title>
      <meta name="robots" content="noindex, nofollow" />
      <Outlet />
      <ScrollRestoration />
    </AuthProvider>
  )
}

export default AdminRoot
