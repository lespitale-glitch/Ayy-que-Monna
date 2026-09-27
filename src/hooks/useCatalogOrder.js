import { useEffect, useState } from 'react'
import { fetchAdminProducts, reorderProducts } from '../services/productsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { getIds, hasOrderChanged, moveItem, sortByIds } from '../utils/reorder.js'

// Estado de la pantalla "Ordenar catálogo": el orden guardado, el orden que se está
// editando y el guardado atómico con reorder_products().
export function useCatalogOrder() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [items, setItems] = useState([]) // productos en el orden que se está editando
  const [savedIds, setSavedIds] = useState([]) // orden que hay en la base
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error' | 'info', text }

  useEffect(() => {
    let ignore = false
    fetchAdminProducts()
      .then((products) => {
        if (ignore) return
        setItems(products)
        setSavedIds(getIds(products))
        setStatus('ready')
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setStatus('error')
      })
    return () => {
      ignore = true
    }
  }, [])

  // Se calcula comparando: no hace falta guardarlo en otro estado
  const isDirty = hasOrderChanged(savedIds, getIds(items))

  // Mueve un producto de una posición a otra y deja un aviso para el lector de pantalla
  const move = (from, to) => {
    if (to < 0 || to >= items.length) return
    const product = items[from]
    setItems((prev) => moveItem(prev, from, to))
    setMessage({ type: 'info', text: `${product.name} ahora está en la posición ${to + 1} de ${items.length}.` })
  }

  const save = async () => {
    const ids = getIds(items)
    setIsSaving(true)
    setMessage(null)
    try {
      await reorderProducts(ids) // una sola llamada con la lista completa
      setSavedIds(ids)
      setMessage({ type: 'success', text: 'Orden guardado. La tienda ya muestra el catálogo en este orden.' })
    } catch (error) {
      console.error(error)
      // El orden editado NO se pierde: se puede volver a intentar
      setMessage({ type: 'error', text: `No se guardó el orden: ${getAdminErrorMessage(error)}` })
    } finally {
      setIsSaving(false)
    }
  }

  const discard = () => {
    setItems((prev) => sortByIds(prev, savedIds))
    setMessage({ type: 'info', text: 'Se descartaron los cambios.' })
  }

  return { status, items, isDirty, isSaving, message, move, save, discard }
}
