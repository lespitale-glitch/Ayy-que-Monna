import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home/Home.jsx'
import Shop from './pages/Shop/Shop.jsx'
import Product from './pages/Product/Product.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

// Todas las páginas comparten el Layout (Header + Footer).
// Las rutas "hijas" se dibujan dentro del <Outlet /> del Layout.
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/tienda', element: <Shop /> },
      { path: '/tienda/:categoria', element: <Shop /> },
      { path: '/producto/:id', element: <Product /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
