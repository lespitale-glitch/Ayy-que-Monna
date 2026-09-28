import { useEffect, useState } from 'react'
import {
  createCollection,
  fetchAdminCollections,
  setCollectionProducts,
  updateCollection,
} from '../services/collectionsService.js'
import { fetchAdminProducts } from '../services/productsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { haveProductsChanged, toCollection } from '../utils/collectionForm.js'

// Carga y guarda una colección. id === undefined → colección nueva.
// También carga todos los productos, para elegir cuáles forman parte de la colección.
export function useCollectionEditor(id) {
  const isNew = id === undefined
  // status: 'loading' | 'ready' | 'notfound' | 'error'
  const [load, setLoad] = useState({ status: 'loading', collection: null, products: [], existingIds: [] })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null) // { message, field? }

  useEffect(() => {
    let ignore = false
    Promise.all([fetchAdminCollections(), fetchAdminProducts()])
      .then(([collections, products]) => {
        if (ignore) return
        const collection = isNew ? null : (collections.find((c) => c.id === id) ?? null)
        setLoad({
          status: isNew || collection ? 'ready' : 'notfound',
          collection,
          products,
          existingIds: collections.map((c) => c.id),
        })
      })
      .catch((error) => {
        if (ignore) return // ya se salió de la página: no es un error real
        console.error(error)
        setLoad((prev) => ({ ...prev, status: 'error' }))
      })
    return () => {
      ignore = true
    }
  }, [id, isNew])

  // Devuelve { saved, productsFailed } o null si no se pudo guardar la colección
  const save = async (initialValues, values) => {
    setSaveError(null)
    setIsSaving(true)
    let saved
    try {
      const collection = toCollection(values)
      if (isNew) {
        saved = await createCollection(collection)
      } else {
        // El id no se cambia al editar: rompería los enlaces a /seleccion/este-id
        const { id: _unchangedId, ...changes } = collection
        saved = await updateCollection(id, changes)
      }
    } catch (error) {
      console.error(error)
      setSaveError({ message: getAdminErrorMessage(error), field: error?.code === '23505' ? 'id' : undefined })
      setIsSaving(false)
      return null
    }

    // Los productos se guardan aparte (función set_collection_products), solo si cambiaron
    try {
      if (haveProductsChanged(initialValues, values)) await setCollectionProducts(saved.id, values.productIds)
      return { saved, productsFailed: false }
    } catch (error) {
      console.error(error)
      return { saved, productsFailed: true }
    }
  }

  const clearFieldError = () => setSaveError((prev) => (prev?.field ? null : prev))

  return { isNew, ...load, isSaving, saveError, save, clearFieldError }
}
