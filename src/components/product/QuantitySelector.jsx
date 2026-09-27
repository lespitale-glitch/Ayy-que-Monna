import { Minus, Plus } from 'lucide-react'

// Componente "controlado": no guarda la cantidad; la recibe del padre (value)
// y le avisa cuando cambia (onChange). Así el padre decide qué hacer con ella.
function QuantitySelector({ value, onChange, min = 1, max = 10 }) {
  // Math.min / Math.max mantienen la cantidad dentro de los límites
  const decrease = () => onChange(Math.max(min, value - 1))
  const increase = () => onChange(Math.min(max, value + 1))

  const buttonClass =
    'flex h-12 w-12 items-center justify-center transition-colors duration-300 ease-soft hover:bg-line disabled:cursor-not-allowed disabled:opacity-30'

  return (
    <div className="inline-flex items-center border border-line" role="group" aria-label="Cantidad">
      <button type="button" onClick={decrease} disabled={value <= min} aria-label="Restar uno" className={buttonClass}>
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <output aria-live="polite" className="w-10 text-center text-sm">
        {value}
      </output>
      <button type="button" onClick={increase} disabled={value >= max} aria-label="Sumar uno" className={buttonClass}>
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}

export default QuantitySelector
