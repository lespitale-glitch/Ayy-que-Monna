import { CATEGORIES } from '../config.js'
import { SLUG_PATTERN } from './slugify.js'

export const NAME_MAX = 80
export const DESCRIPTION_MAX = 500

// Valores del formulario vacío (producto nuevo)
export const EMPTY_VALUES = {
  id: '',
  name: '',
  price: '',
  category: '',
  description: '',
  isVisible: true,
  isFeatured: false,
  isNew: true,
  collections: [], // ids de colecciones
  // Cada foto es { key, url } (ya subida) o { key, blob, previewUrl } (nueva, sin subir)
  images: [],
}

// Producto guardado → valores del formulario
export function valuesFromProduct(product) {
  return {
    id: product.id,
    name: product.name,
    price: String(product.price),
    category: product.category,
    description: product.description ?? '',
    isVisible: product.isVisible,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    collections: [...product.collections],
    images: product.images.map((url) => ({ key: url, url })),
  }
}

// Devuelve un objeto { campo: 'mensaje' } solo con los campos que tienen errores.
// Object.keys(errores).length === 0 significa que el formulario es válido.
export function validateProduct(values) {
  const errors = {}
  const name = values.name.trim()
  const price = Number(values.price)

  if (!name) errors.name = 'Escribe el nombre del producto.'
  else if (name.length > NAME_MAX) errors.name = `Máximo ${NAME_MAX} caracteres.`

  if (!values.id) errors.id = 'El id no puede quedar vacío.'
  else if (!SLUG_PATTERN.test(values.id)) errors.id = 'Solo minúsculas, números y guiones (ej: aros-luna).'

  if (values.price === '') errors.price = 'Escribe el precio.'
  else if (!Number.isInteger(price) || price <= 0) errors.price = 'El precio debe ser un número entero mayor a 0.'

  if (!CATEGORIES.some((c) => c.slug === values.category)) errors.category = 'Elige una categoría.'

  if (values.description.length > DESCRIPTION_MAX) errors.description = `Máximo ${DESCRIPTION_MAX} caracteres.`

  // Misma regla que la base de datos (constraint products_visible_needs_image)
  if (values.isVisible && values.images.length === 0) {
    errors.images = 'Un producto visible necesita al menos una foto (o desactiva "Visible" para guardarlo como borrador).'
  }

  return errors
}

// Valores del formulario + URLs finales de las fotos → producto listo para guardar
export function toProduct(values, imageUrls) {
  return {
    id: values.id,
    name: values.name.trim().toUpperCase(), // los nombres del catálogo van en MAYÚSCULAS
    price: Number(values.price),
    category: values.category,
    description: values.description.trim(),
    images: imageUrls,
    isVisible: values.isVisible,
    isFeatured: values.isFeatured,
    isNew: values.isNew,
    collections: values.collections,
  }
}

// ¿El formulario tiene cambios respecto de cómo se abrió?
// Las fotos se comparan por su "key" (así se detecta agregar, quitar o reordenar).
export function isFormDirty(initial, current) {
  const fields = ['id', 'name', 'price', 'category', 'description', 'isVisible', 'isFeatured', 'isNew']
  if (fields.some((field) => initial[field] !== current[field])) return true
  // Las colecciones se comparan sin importar el orden en que se marcaron
  const ids = (values) => [...values.collections].sort().join('|')
  if (ids(initial) !== ids(current)) return true
  const keys = (values) => values.images.map((image) => image.key).join('|')
  return keys(initial) !== keys(current)
}
