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
      <ul className="flex gap-2 whitespace-nowrap md:justify-center md:gap-3">
        {FILTERS.map((filter) => (
          <li key={filter.to}>
            <NavLink
              to={filter.to}
              end={filter.end}
              className={({ isActive }) =>
                `inline-block rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-300 ease-soft ${
                  isActive ? 'bg-brand-deep text-white' : 'text-stone hover:bg-brand-soft hover:text-ink'
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
