import { ArrowDown, ArrowUp } from 'lucide-react'
import RowActions from '../RowActions.jsx'
import Switch from '../Switch.jsx'
import { getTheme } from '../../../utils/collections.js'

const moveClass =
  'inline-flex h-9 w-9 items-center justify-center border border-line transition-colors duration-300 ease-soft hover:border-ink disabled:opacity-30'

// Una colección en la lista del panel: datos, interruptores, orden y acciones.
// Las flechas NO se deshabilitan mientras se guarda (el foco se perdería); el hook ignora
// los clics repetidos. Solo se deshabilitan en los extremos de la lista.
function CollectionRow({ collection, count, index, total, disabled, onToggle, onMove, onDelete }) {
  const { name } = collection

  return (
    <li className={`flex flex-wrap items-center gap-4 border border-line p-4 ${collection.isVisible ? 'bg-white' : 'bg-line/30'}`}>
      <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full ${getTheme(collection.theme).swatch}`} />
      <div className="min-w-0 flex-1 basis-40">
        <h2 className="font-sans text-sm uppercase tracking-widest">{name}</h2>
        <p className="mt-1 text-xs text-stone">
          <span className="font-mono">/seleccion/{collection.id}</span> · {count} {count === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Switch
          checked={collection.isVisible}
          onChange={(value) => onToggle(collection, 'isVisible', value)}
          label="Visible"
          srContext={name}
          disabled={disabled}
        />
        <Switch
          checked={collection.showOnHome}
          onChange={(value) => onToggle(collection, 'showOnHome', value)}
          label="En el inicio"
          srContext={name}
          disabled={disabled}
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`Subir ${name}`} className={moveClass}>
            <ArrowUp size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label={`Bajar ${name}`} className={moveClass}>
            <ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <RowActions item={collection} editTo={`/admin/colecciones/${collection.id}`} onDelete={onDelete} disabled={disabled} />
      </div>
    </li>
  )
}

export default CollectionRow
