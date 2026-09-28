import { Link } from 'react-router-dom'
import { getTheme } from '../../../utils/collections.js'

// Casillas para elegir en qué colecciones está el producto (puede estar en varias)
function CollectionsField({ collections, selected, onChange, disabled }) {
  // Marcar agrega el id a la lista; desmarcar lo saca
  const toggle = (id, checked) => onChange(checked ? [...selected, id] : selected.filter((x) => x !== id))

  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-widest">Colecciones</legend>
      {collections.length === 0 ? (
        <p className="mt-4 text-sm text-stone">
          Todavía no hay colecciones.{' '}
          <Link to="/admin/colecciones" className="text-ink underline underline-offset-4">
            Crear una colección
          </Link>
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(collection.id)}
                  onChange={(event) => toggle(collection.id, event.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 accent-ink"
                />
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${getTheme(collection.theme).swatch}`} />
                {collection.name}
                {!collection.isVisible && <span className="text-xs text-stone">(oculta)</span>}
              </label>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}

export default CollectionsField
