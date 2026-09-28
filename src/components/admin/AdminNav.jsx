import { Link, useLocation } from 'react-router-dom'

// Secciones del panel. "match" decide qué pestaña queda marcada según la dirección actual:
// Productos también abarca el formulario (/admin/productos/…) y el orden (/admin/orden).
const OTHER_SECTIONS = ['/admin/inicio', '/admin/colecciones', '/admin/preguntas', '/admin/ajustes']
const SECTIONS = [
  { to: '/admin', label: 'Productos', match: (path) => !OTHER_SECTIONS.some((s) => path.startsWith(s)) },
  { to: '/admin/inicio', label: 'Inicio', match: (path) => path.startsWith('/admin/inicio') },
  { to: '/admin/colecciones', label: 'Colecciones', match: (path) => path.startsWith('/admin/colecciones') },
  { to: '/admin/preguntas', label: 'Preguntas', match: (path) => path.startsWith('/admin/preguntas') },
  { to: '/admin/ajustes', label: 'Ajustes', match: (path) => path.startsWith('/admin/ajustes') },
]

function AdminNav() {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Secciones del panel" className="border-b border-line bg-bone">
      <ul className="mx-auto flex max-w-7xl gap-x-5 gap-y-0 overflow-x-auto px-6 sm:gap-6">
        {SECTIONS.map(({ to, label, match }) => {
          const isActive = match(pathname)
          return (
            <li key={to}>
              <Link
                to={to}
                // aria-current="page" anuncia "página actual" en los lectores de pantalla
                aria-current={isActive ? 'page' : undefined}
                className={`inline-block border-b-2 py-3 text-xs uppercase tracking-widest transition-colors duration-300 ease-soft ${
                  isActive ? 'border-fucsia text-ink' : 'border-transparent text-stone hover:text-ink'
                }`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default AdminNav
