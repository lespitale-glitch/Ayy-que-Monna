import { Minus, Plus } from 'lucide-react'
import { getAdminStockStatus } from '../../utils/stock.js'

const buttonClass =
  'inline-flex h-8 w-8 items-center justify-center border border-line transition-colors duration-300 ease-soft hover:border-ink aria-disabled:cursor-not-allowed aria-disabled:opacity-30'

const BADGE = {
  low: { text: 'Bajo', className: 'border border-fucsia text-fucsia-deep' },
  out: { text: 'Agotado', className: 'bg-ink text-bone' },
}

// Stock de un producto en la lista del panel. Con stock: −1 / cantidad / +1.
// Se usa aria-disabled (no disabled) en "−" al llegar a 0: así el foco no se pierde.
function StockControl({ product, onChange }) {
  const status = getAdminStockStatus(product)
  if (status === 'none') return <span className="text-xs text-stone">Sin control</span>
  if (status === 'on_demand') return <span className="text-xs text-stone">A pedido</span>

  const isEmpty = product.stock === 0
  const badge = BADGE[status]
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => !isEmpty && onChange(product, -1)}
        aria-disabled={isEmpty || undefined}
        aria-label={`Restar una unidad de ${product.name}`}
        className={buttonClass}
      >
        <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">
        {product.stock}
        <span className="sr-only">{product.stock === 1 ? " unidad" : " unidades"}</span>
      </span>
      <button type="button" onClick={() => onChange(product, 1)} aria-label={`Sumar una unidad de ${product.name}`} className={buttonClass}>
        <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${badge.className}`}>{badge.text}</span>
      )}
    </div>
  )
}

export default StockControl
