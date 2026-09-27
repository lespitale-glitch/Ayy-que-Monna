import { Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CartDrawer from '../cart/CartDrawer.jsx'
import { CartProvider } from '../../context/CartContext.jsx'

function Layout() {
  return (
    // CartProvider envuelve todo: así Header, páginas y CartDrawer comparten el mismo carrito
    <CartProvider>
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
      <CartDrawer />
    </CartProvider>
  )
}

export default Layout
