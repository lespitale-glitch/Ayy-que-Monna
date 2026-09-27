import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProductsContext } from './productsContext.js'
import { fetchCatalog } from '../services/productsService.js'
import * as selectors from '../utils/products.js'

// Carga el catálogo UNA vez al abrir la tienda y lo comparte con toda la app.
export function ProductsProvider({ children }) {
  // status: 'loading' | 'ready' | 'error'
  const [state, setState] = useState({ status: 'loading', products: [], source: null, error: null })
  // Cada vez que este número cambia, el efecto de abajo vuelve a pedir los datos
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // "ignore" evita guardar una respuesta vieja si el efecto se desmontó antes
    // de que llegara (por ejemplo, en el modo estricto de desarrollo de React).
    let ignore = false

    // fetchCatalog devuelve una Promesa: .then() corre cuando llegan los datos,
    // .catch() si la red o la base de datos fallan.
    fetchCatalog()
      .then(({ products, source }) => {
        if (!ignore) setState({ status: 'ready', products, source, error: null })
      })
      .catch((error) => {
        console.error('No se pudo cargar el catálogo:', error)
        if (!ignore) setState({ status: 'error', products: [], source: null, error })
      })

    return () => {
      ignore = true
    }
  }, [attempt])

  // Botón "Reintentar": volvemos a 'loading' y disparamos otro intento
  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }))
    setAttempt((n) => n + 1)
  }, [])

  // useMemo recalcula este objeto solo cuando cambia el catálogo, no en cada render
  const value = useMemo(() => {
    const { products } = state
    return {
      ...state,
      reload,
      getProductById: (id) => selectors.getProductById(products, id),
      getProductsByCategory: (slug) => selectors.getProductsByCategory(products, slug),
      getFeaturedProducts: () => selectors.getFeaturedProducts(products),
      getCollectionProducts: (collection) => selectors.getCollectionProducts(products, collection),
      getNewArrivals: (limit) => selectors.getNewArrivals(products, limit),
    }
  }, [state, reload])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
