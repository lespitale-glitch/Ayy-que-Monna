// Disponibilidad de un producto según su modo de stock:
//  - 'none'      sin control: siempre disponible
//  - 'tracked'   con stock: se agota en 0; con pocas unidades, "Últimas unidades"
//  - 'on_demand' a pedido: se puede pedir, pero se consigue o se hace después
export const STOCK_MODES = [
  { id: 'none', label: 'Sin control', help: 'Siempre disponible. Para lo que no cuentas.' },
  { id: 'tracked', label: 'Con stock', help: 'Cuentas unidades. En 0 se muestra "Agotado" y no se puede agregar al carrito.' },
  { id: 'on_demand', label: 'A pedido', help: 'Se puede pedir; la demora se coordina por WhatsApp.' },
]

export const MAX_QUANTITY = 10 // tope por producto en el carrito

// Devuelve { status, label, maxQuantity }:
// status = 'available' | 'low' (últimas unidades) | 'out' (agotado) | 'on_demand'
// showLowStock: ajuste de la tienda que activa el aviso "Últimas unidades"
export function getAvailability(product, { showLowStock = true } = {}) {
  const mode = product.stockMode ?? 'none'
  if (mode === 'on_demand') return { status: 'on_demand', label: 'A pedido', maxQuantity: MAX_QUANTITY }
  if (mode !== 'tracked') return { status: 'available', label: null, maxQuantity: MAX_QUANTITY }

  const maxQuantity = Math.min(MAX_QUANTITY, product.stock)
  if (product.stock <= 0) return { status: 'out', label: 'Agotado', maxQuantity: 0 }
  if (showLowStock && product.stock <= product.lowStockThreshold) {
    return { status: 'low', label: 'Últimas unidades', maxQuantity }
  }
  return { status: 'available', label: null, maxQuantity }
}

export const isOutOfStock = (product) => product.stockMode === 'tracked' && product.stock <= 0

// --- Panel ---

// Estado de stock para el panel (sin depender del ajuste público "Últimas unidades")
export function getAdminStockStatus(product) {
  if (product.stockMode === 'on_demand') return 'on_demand'
  if (product.stockMode !== 'tracked') return 'none'
  if (product.stock <= 0) return 'out'
  if (product.stock <= product.lowStockThreshold) return 'low'
  return 'ok'
}

// Cuántos productos con stock bajo y agotados hay (para el aviso del panel)
export function countStockAlerts(products) {
  const statuses = products.map(getAdminStockStatus)
  return { low: statuses.filter((s) => s === 'low').length, out: statuses.filter((s) => s === 'out').length }
}
