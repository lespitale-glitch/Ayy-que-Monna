import { useCallback, useEffect, useState } from 'react'
import {
  deleteCollection,
  fetchAdminCollections,
  reorderCollections,
  updateCollection,
} from '../services/collectionsService.js'
import { fetchAdminProducts } from '../services/productsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { moveItem } from '../utils/reorder.js'

// Lista de colecciones del panel: carga, interruptores, orden y borrado.
// Igual que en productos, los cambios se ven al instante y se deshacen si Supabase falla.
export function useAdminCollections() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [collections, setCollections] = useState([])
  const [counts, setCounts] = useState({}) // { idColección: cantidad de productos }
  const [isBusy, setIsBusy] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', text }

  useEffect(() => {
    let ignore = false
    Promise.all([fetchAdminCollections(), fetchAdminProducts()])
      .then(([list, products]) => {
        if (ignore) return
        // Cuenta cuántos productos tiene cada colección
        const byId = {}
        for (const product of products) {
          for (const id of product.collections) byId[id] = (byId[id] ?? 0) + 1
        }
        setCollections(list)
        setCounts(byId)
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

  // Ejecuta un cambio optimista: "next" es la lista nueva; "save" la guarda en Supabase
  const run = useCallback(async (previous, next, save, successText) => {
    setCollections(next)
    setIsBusy(true)
    setFeedback(null)
    try {
      await save()
      setFeedback({ type: 'success', text: successText })
    } catch (error) {
      console.error(error)
      setCollections(previous) // deshacer
      setFeedback({ type: 'error', text: getAdminErrorMessage(error) })
    } finally {
      setIsBusy(false)
    }
  }, [])

  const toggle = (collection, field, value, successText) => {
    const next = collections.map((c) => (c.id === collection.id ? { ...c, [field]: value } : c))
    return run(collections, next, () => updateCollection(collection.id, { [field]: value }), successText)
  }

  // Sube (-1) o baja (+1) una colección y guarda el orden completo
  const move = (index, direction) => {
    if (isBusy) return // todavía se está guardando el cambio anterior
    const next = moveItem(collections, index, index + direction)
    const { name } = collections[index]
    return run(collections, next, () => reorderCollections(next.map((c) => c.id)), `${name} se movió a la posición ${index + direction + 1}.`)
  }

  const remove = async (collection) => {
    const next = collections.filter((c) => c.id !== collection.id)
    await run(collections, next, () => deleteCollection(collection.id), `Se eliminó la colección ${collection.name}.`)
  }

  return { status, collections, counts, isBusy, feedback, toggle, move, remove }
}
