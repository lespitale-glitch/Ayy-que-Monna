import { Search } from 'lucide-react'
import { CATEGORIES } from '../../config.js'
import { STOCK_FILTERS } from '../../utils/adminFilters.js'

const fieldClass =
  'h-11 w-full border border-line bg-white px-3 text-sm outline-none transition-colors duration-300 ease-soft focus:border-ink'

// Búsqueda + filtros. Es un componente "controlado": recibe los valores y avisa los cambios.
function ProductFilters({ filters, onChange }) {
  // Copia los filtros actuales cambiando solo uno
  const update = (field) => (event) => onChange({ ...filters, [field]: event.target.value })

  return (
    <div role="search" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="admin-search" className="text-xs uppercase tracking-widest">
          Buscar
        </label>
        <div className="relative mt-2">
          <Search
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone"
          />
          <input
            id="admin-search"
            type="search"
            placeholder="Nombre o id del producto"
            value={filters.query}
            onChange={update('query')}
            className={`${fieldClass} pl-9`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="admin-category" className="text-xs uppercase tracking-widest">
          Categoría
        </label>
        <select
          id="admin-category"
          value={filters.category}
          onChange={update('category')}
          className={`${fieldClass} mt-2`}
        >
          <option value="">Todas</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="admin-visibility" className="text-xs uppercase tracking-widest">
          Estado
        </label>
        <select
          id="admin-visibility"
          value={filters.visibility}
          onChange={update('visibility')}
          className={`${fieldClass} mt-2`}
        >
          <option value="">Todos</option>
          <option value="visible">Visibles</option>
          <option value="hidden">Ocultos</option>
        </select>
      </div>

      <div>
        <label htmlFor="admin-stock" className="text-xs uppercase tracking-widest">
          Stock
        </label>
        <select id="admin-stock" value={filters.stock} onChange={update('stock')} className={`${fieldClass} mt-2`}>
          <option value="">Todos</option>
          {STOCK_FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ProductFilters
