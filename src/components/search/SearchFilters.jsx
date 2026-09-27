import FilterChip from './FilterChip.jsx'
import { CATEGORIES } from '../../config.js'
import { FINISHES, PRICE_RANGES } from '../../utils/search.js'
import { useProducts } from '../../hooks/useProducts.js'

// Cada grupo: su etiqueta, el campo que controla y las opciones ('' = sin filtro)
const FIXED_GROUPS = [
  { field: 'category', label: 'Categoría', options: CATEGORIES.map((c) => ({ id: c.slug, label: c.label })) },
  { field: 'finish', label: 'Terminación', options: FINISHES },
  { field: 'price', label: 'Precio', options: PRICE_RANGES },
]

function SearchFilters({ criteria, onChange }) {
  const { collections } = useProducts()
  // El grupo "Colección" sale de las colecciones cargadas en el panel (si hay alguna)
  const groups =
    collections.length > 0
      ? [...FIXED_GROUPS, { field: 'collection', label: 'Colección', options: collections.map((c) => ({ id: c.id, label: c.name })) }]
      : FIXED_GROUPS

  return (
    <div className="space-y-3">
      {groups.map(({ field, label, options }) => (
        <div key={field} role="group" aria-labelledby={`filtro-${field}`} className="flex items-center gap-3">
          <span
            id={`filtro-${field}`}
            className="w-24 shrink-0 text-[10px] font-medium uppercase tracking-widest text-stone"
          >
            {label}
          </span>
          {/* Fila deslizable en celulares */}
          <div className="scrollbar-none -mr-5 flex gap-2 overflow-x-auto pr-5">
            <FilterChip pressed={criteria[field] === ''} onClick={() => onChange(field, '')}>
              Todos
            </FilterChip>
            {options.map((option) => (
              <FilterChip
                key={option.id}
                pressed={criteria[field] === option.id}
                // Tocar el filtro activo lo desactiva
                onClick={() => onChange(field, criteria[field] === option.id ? '' : option.id)}
              >
                {option.label}
              </FilterChip>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchFilters
