import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts.js'

// "Colecciones" en el menú del celular: acordeón con la lista de selecciones
function MobileCollections({ linkClass, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const { selections } = useProducts()

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="colecciones-movil"
        onClick={() => setIsOpen((v) => !v)}
        className={`${linkClass({ isActive: false })} flex items-center gap-1`}
      >
        Colecciones
        <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" className={isOpen ? 'rotate-180' : ''} />
      </button>
      {isOpen && (
        <ul id="colecciones-movil" className="mt-4 space-y-4 border-l-2 border-fucsia pl-4">
          {selections.map((s) => (
            <li key={s.slug}>
              <NavLink to={`/seleccion/${s.slug}`} className={linkClass} onClick={onNavigate}>
                {s.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default MobileCollections
