import { AlertTriangle } from 'lucide-react'
import { countStockAlerts } from '../../utils/stock.js'

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// Aviso arriba de la lista: cuántos productos tienen stock bajo o están agotados
function StockAlertBanner({ products, onShow }) {
  const { low, out } = countStockAlerts(products)
  if (low === 0 && out === 0) return null

  const parts = [low > 0 && plural(low, 'producto con stock bajo', 'productos con stock bajo'), out > 0 && plural(out, 'agotado', 'agotados')]
  return (
    <aside aria-label="Avisos de stock" className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-fucsia bg-white px-5 py-4">
      <AlertTriangle size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-fucsia-deep" />
      <p className="flex-1 text-sm">
        <strong className="font-medium">Revisa el stock:</strong> {parts.filter(Boolean).join(' y ')}.
      </p>
      <div className="flex flex-wrap gap-2">
        {low > 0 && (
          <button type="button" onClick={() => onShow('low')} className="btn-outline px-4 py-2">
            Ver stock bajo
          </button>
        )}
        {out > 0 && (
          <button type="button" onClick={() => onShow('out')} className="btn-outline px-4 py-2">
            Ver agotados
          </button>
        )}
      </div>
    </aside>
  )
}

export default StockAlertBanner
