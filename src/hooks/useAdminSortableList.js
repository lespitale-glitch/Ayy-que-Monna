import { useCallback, useEffect, useState } from 'react'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { moveItem } from '../utils/reorder.js'

// Lista ordenable del panel (colecciones, preguntas frecuentes…): carga, interruptores,
// ↑ ↓ y borrar. Los cambios se ven al instante y se deshacen si Supabase falla.
// api = { load, update(id, cambios), reorder(ids), remove(id), label(item) }
// load() devuelve { items, extra } ("extra": datos adicionales, como la cantidad de productos).
export function useAdminSortableList(api) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [items, setItems] = useState([])
  const [extra, setExtra] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', text }
  const { load } = api

  useEffect(() => {
    let ignore = false
    load()
      .then((result) => {
        if (ignore) return
        setItems(result.items)
        setExtra(result.extra ?? null)
        setStatus('ready')
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setStatus('error')
      })
    return () => {
      ignore = true
    }
  }, [load])

  // Cambio optimista: mostramos "next" y lo guardamos con save(); si falla, volvemos a "previous"
  const run = useCallback(async (previous, next, save, successText) => {
    setItems(next)
    setIsBusy(true)
    setFeedback(null)
    try {
      await save()
      setFeedback({ type: 'success', text: successText })
    } catch (error) {
      console.error(error)
      setItems(previous)
      setFeedback({ type: 'error', text: getAdminErrorMessage(error) })
    } finally {
      setIsBusy(false)
    }
  }, [])

  const toggle = (item, field, value, successText) => {
    const next = items.map((i) => (i.id === item.id ? { ...i, [field]: value } : i))
    return run(items, next, () => api.update(item.id, { [field]: value }), successText)
  }

  // Sube (-1) o baja (+1) un elemento y guarda el orden completo
  const move = (index, direction) => {
    if (isBusy) return // todavía se está guardando el cambio anterior
    const next = moveItem(items, index, index + direction)
    const text = `${api.label(items[index])} se movió a la posición ${index + direction + 1}.`
    return run(items, next, () => api.reorder(next.map((i) => i.id)), text)
  }

  const remove = (item, successText) =>
    run(items, items.filter((i) => i.id !== item.id), () => api.remove(item.id), successText)

  return { status, items, extra, isBusy, feedback, toggle, move, remove }
}
