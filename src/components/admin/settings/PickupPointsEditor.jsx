import { useEffect, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { inputClass } from '../form/fieldA11y.js'
import { PICKUP_MAX, PICKUP_NAME_MAX, newPickupPoint } from '../../../utils/settings.js'

// Lista editable de puntos de retiro: agregar, escribir y quitar
function PickupPointsEditor({ points, onChange, error, disabled }) {
  const listRef = useRef(null)
  const addRef = useRef(null)
  // Guarda a dónde mover el foco después de agregar o quitar (se aplica tras el render)
  const focusNext = useRef(null)

  useEffect(() => {
    if (focusNext.current === 'last') listRef.current?.querySelector('li:last-child input')?.focus()
    if (focusNext.current === 'add') addRef.current?.focus()
    focusNext.current = null
  }, [points.length])

  const rename = (key, name) => onChange(points.map((p) => (p.key === key ? { ...p, name } : p)))
  const remove = (key) => {
    focusNext.current = 'add'
    onChange(points.filter((p) => p.key !== key))
  }
  const add = () => {
    focusNext.current = 'last'
    onChange([...points, newPickupPoint()])
  }

  return (
    <fieldset id="pickupPoints" aria-describedby={error ? 'pickupPoints-error' : 'pickupPoints-hint'}>
      <legend className="text-xs uppercase tracking-widest">Puntos de retiro gratis</legend>
      <p id="pickupPoints-hint" className="mt-2 text-xs text-stone">
        Barrios o lugares donde se puede retirar sin costo. Si no hay ninguno, no se muestra en la tienda.
      </p>

      {points.length > 0 && (
        <ul ref={listRef} className="mt-4 grid gap-3">
          {points.map((point, i) => (
            <li key={point.key} className="flex gap-2">
              <input
                type="text"
                aria-label={`Punto de retiro ${i + 1}`}
                value={point.name}
                onChange={(event) => rename(point.key, event.target.value)}
                maxLength={PICKUP_NAME_MAX}
                disabled={disabled}
                className={`${inputClass} h-11`}
              />
              <button
                type="button"
                onClick={() => remove(point.key)}
                disabled={disabled}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-line hover:border-ink disabled:opacity-50"
              >
                <X size={16} strokeWidth={1.5} aria-hidden="true" />
                <span className="sr-only">Quitar {point.name || `punto de retiro ${i + 1}`}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {points.length < PICKUP_MAX && (
        <button
          ref={addRef}
          type="button"
          onClick={add}
          disabled={disabled}
          className="btn-outline mt-4 px-4 py-2 disabled:opacity-50"
        >
          <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
          Agregar punto de retiro
        </button>
      )}

      {error && (
        <p id="pickupPoints-error" className="mt-2 text-xs text-ink">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default PickupPointsEditor
