import { Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* flex-1 empuja el footer al fondo aunque la página tenga poco contenido */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Vuelve arriba al cambiar de página, como en una web tradicional */}
      <ScrollRestoration />
    </div>
  )
}

export default Layout
