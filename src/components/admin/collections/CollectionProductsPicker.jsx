import { useState } from 'react'
import { Search } from 'lucide-react'
import ProductThumb from '../ProductThumb.jsx'
import { filterAdminProducts } from '../../../utils/adminFilters.js'

// Elegir qué productos forman parte de la colección: buscador + casillas
function CollectionProductsPicker({ products, selected, onChange, disabled }) {
  const [query, setQuery] = useState('')
  // "Solo los elegidos" guarda la lista del momento en que se activa: así, al desmarcar
  // uno, no desaparece de golpe (el foco se perdería) y se puede volver a marcar.
  const [pinnedIds, setPinnedIds] = useState(null)

  const shown = filterAdminProducts(products, { query, category: '', visibility: '' }).filter(
    (p) => !pinnedIds || pinnedIds.includes(p.id),
  )
  const toggle = (id, checked) => onChange(checked ? [...selected, id] : selected.filter((x) => x !== id))

  return (
    <fieldset id="productIds">
      <legend className="font-display text-2xl">Productos</legend>
      {/* aria-live: al marcar o desmarcar, el lector de pantalla anuncia el nuevo total */}
      <p aria-live="polite" className="mt-2 text-xs uppercase tracking-widest text-stone">
        {selected.length} {selected.length === 1 ? 'elegido' : 'elegidos'}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="relative min-w-0 flex-1 basis-56">
          <label htmlFor="picker-search" className="sr-only">
            Buscar productos
          </label>
          <Search size={16} strokeWidth={1.5} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            id="picker-search"
            type="search"
            placeholder="Buscar por nombre o id"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-widest">
          <input
            type="checkbox"
            checked={pinnedIds !== null}
            onChange={(event) => setPinnedIds(event.target.checked ? selected : null)}
            className="h-4 w-4 accent-ink"
          />
          Solo los elegidos
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 text-sm text-stone">Ningún producto coincide.</p>
      ) : (
        <ul className="mt-4 max-h-[28rem] divide-y divide-line overflow-y-auto border border-line bg-white">
          {shown.map((product) => (
            <li key={product.id}>
              <label className="flex cursor-pointer items-center gap-4 px-4 py-2 hover:bg-bone">
                <input
                  type="checkbox"
                  checked={selected.includes(product.id)}
                  onChange={(event) => toggle(product.id, event.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 shrink-0 accent-ink"
                />
                <ProductThumb product={product} className="w-10" decorative />
                <span className="min-w-0 text-xs uppercase tracking-widest">
                  {product.name}
                  {!product.isVisible && <span className="ml-2 normal-case tracking-normal text-stone">(oculto)</span>}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}

export default CollectionProductsPicker
