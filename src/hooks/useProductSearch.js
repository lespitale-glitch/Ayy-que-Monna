import { useMemo, useState } from 'react'
import { EMPTY_SEARCH, hasSearchCriteria, searchProducts } from '../utils/search.js'

// Estado del buscador: texto + filtros, y los resultados calculados a partir de ellos
export function useProductSearch(products) {
  const [criteria, setCriteria] = useState(EMPTY_SEARCH)

  // Cambia un solo criterio (por ejemplo, la categoría) sin tocar los demás
  const setCriterion = (field, value) => setCriteria((prev) => ({ ...prev, [field]: value }))
  const reset = () => setCriteria((prev) => ({ ...EMPTY_SEARCH, query: prev.query }))

  // useMemo evita volver a filtrar si ni el catálogo ni los criterios cambiaron
  const results = useMemo(() => searchProducts(products, criteria), [products, criteria])

  return { criteria, setCriterion, reset, results, isActive: hasSearchCriteria(criteria) }
}
