import { normalize } from './text.js'
import { getAdminStockStatus } from './stock.js'

// Opciones del filtro de stock del panel
export const STOCK_FILTERS = [
  { id: 'low', label: 'Stock bajo' },
  { id: 'out', label: 'Agotados' },
  { id: 'tracked', label: 'Con stock' },
  { id: 'on_demand', label: 'A pedido' },
  { id: 'none', label: 'Sin control' },
]

function matchesStock(product, stock) {
  if (!stock) return true
  const status = getAdminStockStatus(product)
  if (stock === 'tracked') return product.stockMode === 'tracked'
  return status === stock
}

// Filtra la lista del panel por texto (nombre o id), categoría, visibilidad y stock
export function filterAdminProducts(products, { query, category, visibility, stock = '' }) {
  const search = normalize(query.trim())

  return products.filter((product) => {
    if (search && !normalize(product.name).includes(search) && !product.id.includes(search)) return false
    if (category && product.category !== category) return false
    if (visibility === 'visible' && !product.isVisible) return false
    if (visibility === 'hidden' && product.isVisible) return false
    if (!matchesStock(product, stock)) return false
    return true
  })
}
