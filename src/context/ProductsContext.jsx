import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProductsContext } from './productsContext.js'
import { fetchCatalog } from '../services/productsService.js'
import { fetchCollections } from '../services/collectionsService.js'
import * as selectors from '../utils/products.js'
import { buildSelections } from '../data/selections.js'

// Carga el catálogo (productos + colecciones) UNA vez al abrir la tienda y lo comparte con toda la app.
export function ProductsProvider({ children }) {
  // status: 'loading' | 'ready' | 'error'
  const [state, setState] = useState({ status: 'loading', products: [], collections: [], source: null, error: null })
  // Cada vez que este número cambia, el efecto de abajo vuelve a pedir los datos
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // "ignore" evita guardar una respuesta vieja si el efecto se desmontó antes
    // de que llegara (por ejemplo, en el modo estricto de desarrollo de React).
    let ignore = false

    // Promise.all pide las dos cosas en paralelo y espera a que lleguen ambas:
    // .then() corre cuando llegan los datos, .catch() si falla cualquiera de las dos.
    Promise.all([fetchCatalog(), fetchCollections()])
      .then(([{ products, source }, collections]) => {
        if (!ignore) setState({ status: 'ready', products, collections, source, error: null })
      })
      .catch((error) => {
        console.error('No se pudo cargar el catálogo:', error)
        if (!ignore) setState({ status: 'error', products: [], collections: [], source: null, error })
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
    const { products, collections } = state
    const homeCollections = selectors.getHomeCollections(products, collections)
    return {
      ...state,
      reload,
      // Colecciones + selecciones automáticas (novedades, destacados…) para menús y /seleccion/:slug
      selections: buildSelections(collections),
      homeCollections,
      getProductById: (id) => selectors.getProductById(products, id),
      getProductsByCategory: (slug) => selectors.getProductsByCategory(products, slug),
      getFeaturedProducts: () => selectors.getFeaturedProducts(products),
      getCollectionProducts: (id) => selectors.getCollectionProducts(products, id),
      getNewArrivals: (limit) =>
        selectors.getNewArrivals(products, limit, homeCollections.map((c) => c.id)),
    }
  }, [state, reload])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
