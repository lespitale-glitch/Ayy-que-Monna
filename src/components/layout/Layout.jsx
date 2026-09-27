import { Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CatalogGate from './CatalogGate.jsx'
import CartDrawer from '../cart/CartDrawer.jsx'
import { CartProvider } from '../../context/CartContext.jsx'
import { ProductsProvider } from '../../context/ProductsContext.jsx'

function Layout() {
  return (
    // ProductsProvider va afuera porque el carrito necesita el catálogo.
    // CartProvider envuelve el resto: Header, páginas y CartDrawer comparten el mismo carrito.
    <ProductsProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          {/* flex-1 empuja el footer al fondo aunque la página tenga poco contenido */}
          <main className="flex-1">
            <CatalogGate>
              <Outlet />
            </CatalogGate>
          </main>
          <Footer />
          {/* Vuelve arriba al cambiar de página, como en una web tradicional */}
          <ScrollRestoration />
        </div>
        <CartDrawer />
      </CartProvider>
    </ProductsProvider>
  )
}

export default Layout
