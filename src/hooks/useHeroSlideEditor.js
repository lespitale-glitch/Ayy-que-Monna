import { useEffect, useState } from 'react'
import { createHeroSlide, fetchAdminHeroSlides, removeHeroImages, updateHeroSlide, uploadHeroImages } from '../services/heroSlidesService.js'
import { fetchAdminCollections } from '../services/collectionsService.js'
import { removeStorageImages } from '../services/productsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { toSlide } from '../utils/heroSlideForm.js'

// Carga y guarda una diapositiva del carrusel. id === undefined → diapositiva nueva.
// También carga las colecciones, para ofrecerlas como destino del botón.
export function useHeroSlideEditor(id) {
  const isNew = id === undefined
  // status: 'loading' | 'ready' | 'notfound' | 'error'
  const [load, setLoad] = useState({ status: 'loading', slide: null, collections: [] })
  const [phase, setPhase] = useState('idle') // 'idle' | 'uploading' | 'saving'
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    let ignore = false
    Promise.all([isNew ? [] : fetchAdminHeroSlides(), fetchAdminCollections()])
      .then(([slides, collections]) => {
        const slide = isNew ? null : (slides.find((s) => s.id === id) ?? null)
        if (!ignore) setLoad({ status: isNew || slide ? 'ready' : 'notfound', slide, collections })
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

  // Devuelve la diapositiva guardada, o null si falló (el mensaje queda en saveError)
  const save = async (values) => {
    setSaveError(null)
    let uploaded = null
    try {
      // 1. Si se eligió una foto nueva, se sube recién ahora (grande y chica)
      let urls = { image: values.photo.url, imageSmall: values.photo.urlSmall ?? null }
      if (!values.photo.url) {
        setPhase('uploading')
        uploaded = await uploadHeroImages({ large: values.photo.large, small: values.photo.small })
        urls = uploaded
      }
      // 2. Guardar en la base
      setPhase('saving')
      const slide = toSlide(values, urls)
      const saved = isNew ? await createHeroSlide(slide) : await updateHeroSlide(id, slide)
      // 3. Si se reemplazó la foto, la vieja ya no se usa (las de /hero/ en public no se tocan)
      if (!isNew && uploaded) await removeHeroImages(load.slide)
      return saved
    } catch (error) {
      console.error(error)
      if (uploaded) await removeStorageImages([uploaded.image, uploaded.imageSmall]) // no dejar fotos huérfanas
      setSaveError(getAdminErrorMessage(error))
      setPhase('idle')
      return null
    }
  }

  return { isNew, ...load, phase, saveError, save }
}
