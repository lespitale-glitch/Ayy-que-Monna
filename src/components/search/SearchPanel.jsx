import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import SearchFilters from './SearchFilters.jsx'
import SearchResults from './SearchResults.jsx'
import { useProducts } from '../../hooks/useProducts.js'
import { useProductSearch } from '../../hooks/useProductSearch.js'

const SUGGESTIONS = 8

// Contenido del buscador. Se monta cada vez que se abre, así arranca siempre vacío.
function SearchPanel({ onClose }) {
  const { products, getFeaturedProducts } = useProducts()
  const { criteria, setCriterion, reset, results, isActive } = useProductSearch(products)
  const inputRef = useRef(null)

  // El foco va directo al campo de texto para empezar a escribir
  useEffect(() => inputRef.current?.focus(), [])

  const shown = isActive ? results : getFeaturedProducts().slice(0, SUGGESTIONS)
  const hasFilters = criteria.category || criteria.finish || criteria.price || criteria.marina

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <Search size={20} strokeWidth={1.5} className="shrink-0 text-fucsia-deep" aria-hidden="true" />
        <label htmlFor="buscador" className="sr-only">
          Buscar productos
        </label>
        <input
          ref={inputRef}
          id="buscador"
          type="search"
          placeholder="Buscar"
          autoComplete="off"
          value={criteria.query}
          onChange={(e) => setCriterion('query', e.target.value)}
          className="search-no-cancel h-11 min-w-0 flex-1 bg-transparent font-display text-xl outline-none placeholder:text-stone"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar buscador"
          className="-mr-2 rounded-full p-2 hover:bg-brand-soft"
        >
          <X size={22} strokeWidth={1.5} />
        </button>
      </div>

      <div className="border-b border-line px-5 py-4">
        <SearchFilters criteria={criteria} onChange={setCriterion} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* aria-live: el lector de pantalla anuncia cuántos resultados hay al escribir o filtrar */}
          <p aria-live="polite" className="text-xs font-medium uppercase tracking-widest text-stone">
            {isActive ? `${results.length} ${results.length === 1 ? 'producto' : 'productos'}` : 'Sugerencias'}
          </p>
          {hasFilters && (
            <button type="button" onClick={reset} className="text-xs underline decoration-fucsia underline-offset-4">
              Quitar filtros
            </button>
          )}
        </div>

        {shown.length > 0 ? (
          <SearchResults products={shown} onSelect={onClose} />
        ) : (
          <p className="py-12 text-center text-sm text-stone">No encontramos productos con esa búsqueda.</p>
        )}
      </div>
    </div>
  )
}

export default SearchPanel
