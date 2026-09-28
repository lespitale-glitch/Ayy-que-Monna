import { useAdminSortableList } from './useAdminSortableList.js'
import { deleteHeroSlide, fetchAdminHeroSlides, reorderHeroSlides, updateHeroSlide } from '../services/heroSlidesService.js'

async function load() {
  return { items: await fetchAdminHeroSlides() }
}

// Definido afuera del componente: el objeto es siempre el mismo y "load" no cambia entre renders
const API = {
  load,
  update: updateHeroSlide,
  reorder: reorderHeroSlides,
  remove: deleteHeroSlide, // recibe la diapositiva entera: borra también sus fotos del Storage
  label: (slide) => `"${`${slide.title} ${slide.highlight}`.trim()}"`,
}

// Lista de diapositivas del carrusel en el panel (ver useAdminSortableList)
export function useAdminHeroSlides() {
  const list = useAdminSortableList(API)
  return {
    ...list,
    slides: list.items,
    remove: (slide) => list.remove(slide, 'Se eliminó la diapositiva.'),
  }
}
