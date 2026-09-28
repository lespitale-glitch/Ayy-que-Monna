import { useSettings } from '../../hooks/useSettings.js'
import { getAvailability } from '../../utils/stock.js'

// Etiqueta de disponibilidad: "Agotado", "Últimas unidades" o "A pedido".
const STYLES = {
  out: 'bg-ink text-bone',
  low: 'bg-white text-fucsia-deep border border-fucsia',
  on_demand: 'bg-white text-ink border border-line',
}

function StockBadge({ product }) {
  const { showLowStock } = useSettings()
  const { status, label } = getAvailability(product, { showLowStock })
  if (!label) return null

  return (
    <span className={`inline-block max-w-full rounded-full px-2.5 py-1 text-[10px] font-medium uppercase leading-tight tracking-wider ${STYLES[status]}`}>
      {label}
    </span>
  )
}

export default StockBadge
