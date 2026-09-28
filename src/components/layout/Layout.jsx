import { Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CatalogGate from './CatalogGate.jsx'
import CartDrawer from '../cart/CartDrawer.jsx'
import BotLauncher from '../bot/BotLauncher.jsx'
import AnalyticsManager from '../analytics/AnalyticsManager.jsx'
import CookieBanner from '../analytics/CookieBanner.jsx'
import { CartProvider } from '../../context/CartContext.jsx'
import { ProductsProvider } from '../../context/ProductsContext.jsx'
import { SettingsProvider } from '../../context/SettingsContext.jsx'
import { ConsentProvider } from '../../context/ConsentContext.jsx'

function Layout() {
  return (
    // SettingsProvider: WhatsApp, Instagram, envíos y analítica (editables desde /admin/ajustes).
    // ConsentProvider: la elección de cookies (la usan el aviso, el footer y la analítica).
    // ProductsProvider va afuera del carrito porque el carrito necesita el catálogo.
    // CartProvider envuelve el resto: Header, páginas y CartDrawer comparten el mismo carrito.
    <SettingsProvider>
      <ConsentProvider>
        <ProductsProvider>
          <CartProvider>
            {/* Analítica: solo con consentimiento (el aviso va primero para llegar rápido con el teclado) */}
            <AnalyticsManager />
            <CookieBanner />
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
            {/* Botón "Ayuda" del asistente (se puede apagar desde Ajustes) */}
            <BotLauncher />
          </CartProvider>
        </ProductsProvider>
      </ConsentProvider>
    </SettingsProvider>
  )
}

export default Layout
