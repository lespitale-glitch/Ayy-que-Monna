import { NavLink } from 'react-router-dom'
import { CATEGORIES } from '../config.js'

const FILTERS = [{ to: '/tienda', label: 'Todo', end: true }].concat(
  CATEGORIES.map((c) => ({ to: `/tienda/${c.slug}`, label: c.label })),
)

// El filtro son links: la categoría elegida queda en la URL,
// así se puede compartir o volver atrás con el navegador.
function CategoryFilter() {
  return (
    <nav aria-label="Filtrar por categoría" className="-mx-6 overflow-x-auto px-6">
      <ul className="flex gap-6 whitespace-nowrap md:justify-center md:gap-10">
        {FILTERS.map((filter) => (
          <li key={filter.to}>
            <NavLink
              to={filter.to}
              end={filter.end}
              className={({ isActive }) =>
                `inline-block border-b pb-1 text-xs uppercase tracking-widest transition-colors duration-300 ease-soft ${
                  isActive ? 'border-ink text-ink' : 'border-transparent text-stone hover:text-ink'
                }`
              }
            >
              {filter.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default CategoryFilter
