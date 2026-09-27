import { useEffect, useState } from 'react'
import {
  createProduct,
  fetchAdminProduct,
  removeStorageImages,
  updateProduct,
  uploadProductImage,
} from '../services/productsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { toProduct } from '../utils/productForm.js'

// Carga (si se edita) y guarda un producto.
// id === undefined → producto nuevo.
export function useProductEditor(id) {
  const isNew = id === undefined
  // status: 'loading' | 'ready' | 'notfound' | 'error'
  const [load, setLoad] = useState({ status: isNew ? 'ready' : 'loading', product: null })
  // phase: 'idle' | 'uploading' | 'saving'
  const [phase, setPhase] = useState('idle')
  const [saveError, setSaveError] = useState(null) // { message, field? }

  useEffect(() => {
    if (isNew) return
    let ignore = false
    fetchAdminProduct(id)
      .then((product) => {
        if (!ignore) setLoad({ status: product ? 'ready' : 'notfound', product })
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setLoad({ status: 'error', product: null })
      })
    return () => {
      ignore = true
    }
  }, [id, isNew])

  // Devuelve el producto guardado, o null si hubo un error (queda en saveError)
  const save = async (values) => {
    setSaveError(null)
    const uploadedNow = [] // para poder limpiarlas si algo falla después

    try {
      // 1. Subir las fotos nuevas (las que ya tienen url se mantienen tal cual)
      setPhase('uploading')
      const imageUrls = []
      for (const image of values.images) {
        if (image.url) {
          imageUrls.push(image.url)
        } else {
          const url = await uploadProductImage(image.blob)
          uploadedNow.push(url)
          imageUrls.push(url)
        }
      }

      // 2. Guardar en la base de datos
      setPhase('saving')
      const product = toProduct(values, imageUrls)
      let saved
      if (isNew) {
        saved = await createProduct(product)
      } else {
        // El id no se cambia al editar: rompería enlaces compartidos y carritos guardados
        const { id: _unchangedId, ...changes } = product
        saved = await updateProduct(load.product.id, changes)
      }

      // 3. Borrar del Storage las fotos que se quitaron del producto
      if (!isNew) {
        await removeStorageImages(load.product.images.filter((url) => !imageUrls.includes(url)))
      }
      return saved
    } catch (error) {
      console.error(error)
      // Si la base rechazó el guardado, las fotos recién subidas quedarían huérfanas
      await removeStorageImages(uploadedNow)
      setSaveError({
        message: getAdminErrorMessage(error),
        field: error?.code === '23505' ? 'id' : undefined,
      })
      setPhase('idle')
      return null
    }
  }

  const clearFieldError = () => setSaveError((prev) => (prev?.field ? null : prev))

  return { isNew, status: load.status, product: load.product, phase, saveError, save, clearFieldError }
}
