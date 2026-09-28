import { useCallback, useEffect, useRef, useState } from 'react'
import { adjustStock, deleteProduct, fetchAdminProducts, updateProduct } from '../services/productsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'

// Estado de la lista del panel: carga, cambios rápidos (toggles) y borrado.
export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [attempt, setAttempt] = useState(0)
  // ids de productos con un cambio en curso (para deshabilitar sus controles)
  const [savingIds, setSavingIds] = useState(() => new Set())
  // Último resultado para mostrar al usuario: { type: 'success' | 'error', text }
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchAdminProducts()
      .then((data) => {
        if (ignore) return
        setProducts(data)
        setStatus('ready')
      })
      .catch((error) => {
        console.error('No se pudieron cargar los productos del panel:', error)
        if (!ignore) setStatus('error')
      })
    return () => {
      ignore = true
    }
  }, [attempt])

  const reload = useCallback(() => {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }, [])

  const markSaving = (id, isSaving) =>
    setSavingIds((prev) => {
      const next = new Set(prev)
      if (isSaving) next.add(id)
      else next.delete(id)
      return next
    })

  const replaceProduct = (updated) => setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))

  // Actualización "optimista": cambiamos la pantalla al instante y, si Supabase
  // rechaza el cambio, volvemos al valor anterior y mostramos el error.
  const updateFields = useCallback(async (product, changes, successText) => {
    const optimistic = { ...product, ...changes }
    replaceProduct(optimistic)
    markSaving(product.id, true)
    setFeedback(null)
    try {
      const saved = await updateProduct(product.id, changes)
      replaceProduct(saved)
      setFeedback({ type: 'success', text: successText })
    } catch (error) {
      console.error(error)
      replaceProduct(product) // deshacer
      setFeedback({ type: 'error', text: `${product.name}: ${getAdminErrorMessage(error)}` })
    } finally {
      markSaving(product.id, false)
    }
  }, [])

  // Botones −1 / +1 del stock. Mientras se guarda un cambio de ese producto, los clics
  // siguientes se ignoran (con un ref, porque el estado dentro de useCallback quedaría viejo).
  const adjusting = useRef(new Set())
  const changeStock = useCallback(async (product, delta) => {
    if (adjusting.current.has(product.id)) return
    adjusting.current.add(product.id)
    const optimistic = Math.max(0, product.stock + delta)
    replaceProduct({ ...product, stock: optimistic })
    setFeedback(null)
    try {
      const stock = await adjustStock(product.id, delta)
      replaceProduct({ ...product, stock })
      setFeedback({ type: 'success', text: `${product.name}: ${stock === 1 ? 'queda 1 unidad' : `quedan ${stock} unidades`}.` })
    } catch (error) {
      console.error(error)
      replaceProduct(product) // deshacer
      setFeedback({ type: 'error', text: `${product.name}: ${getAdminErrorMessage(error)}` })
    } finally {
      adjusting.current.delete(product.id)
    }
  }, [])

  const removeProduct = useCallback(async (product) => {
    markSaving(product.id, true)
    setFeedback(null)
    try {
      await deleteProduct(product)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      setFeedback({ type: 'success', text: `${product.name} se eliminó.` })
      return true
    } catch (error) {
      console.error(error)
      setFeedback({ type: 'error', text: `${product.name}: ${getAdminErrorMessage(error)}` })
      return false
    } finally {
      markSaving(product.id, false)
    }
  }, [])

  return { products, status, reload, savingIds, feedback, updateFields, changeStock, removeProduct }
}
