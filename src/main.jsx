import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
// Fuentes servidas desde el propio sitio (sin depender de Google Fonts)
import '@fontsource-variable/comfortaa'
import '@fontsource-variable/geist'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
