import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home/Home.jsx'
import Shop from './pages/Shop/Shop.jsx'
import Product from './pages/Product/Product.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import Selection from './pages/Selection/Selection.jsx'

// "lazy" carga el código del panel solo cuando alguien entra a /admin.
// import() devuelve una Promesa con el módulo; usamos su export por defecto como componente.
const lazyPage = (importer) => async () => ({ Component: (await importer()).default })

export const router = createBrowserRouter([
  // Tienda pública: todas las páginas comparten el Layout (Header + Footer)
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/tienda', element: <Shop /> },
      { path: '/tienda/:categoria', element: <Shop /> },
      { path: '/producto/:id', element: <Product /> },
      { path: '/seleccion/:slug', element: <Selection /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  // Panel de administración (layout propio, sin Header/Footer de la tienda)
  {
    path: '/admin',
    lazy: lazyPage(() => import('./pages/Admin/AdminRoot.jsx')),
    children: [
      { path: 'login', lazy: lazyPage(() => import('./pages/Admin/AdminLogin.jsx')) },
      {
        // Todo lo que está aquí adentro exige sesión de administradora
        lazy: lazyPage(() => import('./components/admin/ProtectedRoute.jsx')),
        children: [
          {
            lazy: lazyPage(() => import('./components/admin/AdminLayout.jsx')),
            children: [
              { index: true, lazy: lazyPage(() => import('./pages/Admin/AdminProducts.jsx')) },
              { path: 'orden', lazy: lazyPage(() => import('./pages/Admin/AdminCatalogOrder.jsx')) },
              // "nuevo" va antes que ":id" para que no se interprete como un id
              { path: 'productos/nuevo', lazy: lazyPage(() => import('./pages/Admin/AdminProductForm.jsx')) },
              { path: 'productos/:id', lazy: lazyPage(() => import('./pages/Admin/AdminProductForm.jsx')) },
            ],
          },
        ],
      },
    ],
  },
])
