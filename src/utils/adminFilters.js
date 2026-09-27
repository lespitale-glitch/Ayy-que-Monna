import { normalize } from './text.js'

// Filtra la lista del panel por texto (nombre o id), categoría y estado de visibilidad
export function filterAdminProducts(products, { query, category, visibility }) {
  const search = normalize(query.trim())

  return products.filter((product) => {
    if (search && !normalize(product.name).includes(search) && !product.id.includes(search)) return false
    if (category && product.category !== category) return false
    if (visibility === 'visible' && !product.isVisible) return false
    if (visibility === 'hidden' && product.isVisible) return false
    return true
  })
}
