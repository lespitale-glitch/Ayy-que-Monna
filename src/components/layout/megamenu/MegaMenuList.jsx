import { Link } from 'react-router-dom'
import { getTheme } from '../../../utils/collections.js'

// Columna izquierda: lista de selecciones. Al pasar el mouse o enfocar una,
// la derecha muestra sus productos; al hacer clic se abre su página.
function MegaMenuList({ selections, activeSlug, onActivate, onNavigate }) {
  return (
    <ul className="space-y-1">
      {selections.map((selection) => {
        const isActive = selection.slug === activeSlug
        return (
          <li key={selection.slug}>
            <Link
              to={`/seleccion/${selection.slug}`}
              onMouseEnter={() => onActivate(selection.slug)}
              onFocus={() => onActivate(selection.slug)}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-full px-4 py-3 font-display text-lg transition-colors duration-300 ease-soft ${
                isActive ? 'bg-brand-soft text-ink' : 'text-stone hover:text-ink'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${isActive ? getTheme(selection.theme).swatch : 'bg-line'}`}
              />
              {selection.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default MegaMenuList
