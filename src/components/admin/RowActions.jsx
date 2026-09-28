import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'

// Botones "Editar" y "Eliminar" de cada fila (productos o colecciones).
// "item" necesita un "name"; "editTo" es la dirección del formulario de edición.
function RowActions({ item, editTo, onDelete, disabled }) {
  const base =
    'inline-flex h-9 w-9 items-center justify-center border border-line transition-colors duration-300 ease-soft'

  return (
    <div className="flex gap-2">
      <Link
        to={editTo}
        className={`${base} hover:border-ink`}
        aria-label={`Editar ${item.name}`}
      >
        <Pencil size={15} strokeWidth={1.5} aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(item)}
        disabled={disabled}
        className={`${base} hover:border-ink disabled:opacity-40`}
        aria-label={`Eliminar ${item.name}`}
      >
        <Trash2 size={15} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  )
}

export default RowActions
