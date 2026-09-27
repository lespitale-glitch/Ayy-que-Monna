import { normalize } from './text.js'

// Terminación deducida del nombre del producto ("COLLAR TORTUGA DORADO" → dorado).
// Si el nombre no la menciona, devuelve null y el producto no aparece al filtrar por terminación.
export const FINISHES = [
  { id: 'dorado', label: 'Dorado', pattern: /dorad/ },
  { id: 'plateado', label: 'Plateado', pattern: /platead/ },
]

export function getFinish(product) {
  const name = normalize(product.name)
  return FINISHES.find((finish) => finish.pattern.test(name))?.id ?? null
}

// Rangos de precio (en ARS) para el filtro del buscador
export const PRICE_RANGES = [
  { id: 'hasta-3000', label: 'Hasta $ 3.000', min: 0, max: 3000 },
  { id: '3000-6000', label: '$ 3.000 a $ 6.000', min: 3001, max: 6000 },
  { id: 'mas-6000', label: 'Más de $ 6.000', min: 6001, max: Infinity },
]

export const EMPTY_SEARCH = { query: '', category: '', finish: '', price: '', marina: false }

// ¿La persona escribió algo o eligió algún filtro?
export function hasSearchCriteria(criteria) {
  return Boolean(criteria.query.trim() || criteria.category || criteria.finish || criteria.price || criteria.marina)
}

// Filtra el catálogo. Cada palabra escrita tiene que aparecer en el nombre:
// "collar dorado" encuentra "COLLAR TORTUGA DORADO" (sin importar orden ni acentos).
export function searchProducts(products, criteria) {
  const words = normalize(criteria.query).split(/\s+/).filter(Boolean)
  const range = PRICE_RANGES.find((r) => r.id === criteria.price)

  return products.filter((product) => {
    const name = normalize(product.name)
    if (!words.every((word) => name.includes(word))) return false
    if (criteria.category && product.category !== criteria.category) return false
    if (criteria.finish && getFinish(product) !== criteria.finish) return false
    if (range && (product.price < range.min || product.price > range.max)) return false
    if (criteria.marina && product.collection !== 'marina') return false
    return true
  })
}
