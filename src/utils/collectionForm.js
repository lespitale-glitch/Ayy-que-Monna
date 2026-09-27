import { SLUG_PATTERN } from './slugify.js'
import { RESERVED_SLUGS } from '../data/selections.js'
import { COLLECTION_THEMES } from './collections.js'

// Reglas del formulario de colección: las mismas que la tabla collections de schema.sql
export const COLLECTION_NAME_MAX = 40
export const COLLECTION_DESCRIPTION_MAX = 300

export const EMPTY_COLLECTION = {
  id: '',
  name: '',
  description: '',
  theme: 'brand',
  isVisible: true,
  showOnHome: true,
  productIds: [], // productos que forman parte de la colección
}

// Colección guardada + ids de sus productos → valores del formulario
export function valuesFromCollection(collection, productIds) {
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    theme: collection.theme,
    isVisible: collection.isVisible,
    showOnHome: collection.showOnHome,
    productIds,
  }
}

// existingIds: ids de las otras colecciones (para avisar antes de chocar con la base)
export function validateCollection(values, { isNew, existingIds = [] } = {}) {
  const errors = {}
  const name = values.name.trim()

  if (!name) errors.name = 'Escribe el nombre de la colección.'
  else if (name.length > COLLECTION_NAME_MAX) errors.name = `Máximo ${COLLECTION_NAME_MAX} caracteres.`

  if (!values.id) errors.id = 'El id no puede quedar vacío.'
  else if (!SLUG_PATTERN.test(values.id)) errors.id = 'Solo minúsculas, números y guiones (ej: verano-2026).'
  else if (RESERVED_SLUGS.includes(values.id)) errors.id = 'Ese id ya lo usa una selección automática de la tienda. Elige otro.'
  else if (isNew && existingIds.includes(values.id)) errors.id = 'Ya existe una colección con ese id. Elige otro.'

  if (values.description.length > COLLECTION_DESCRIPTION_MAX)
    errors.description = `Máximo ${COLLECTION_DESCRIPTION_MAX} caracteres.`

  if (!COLLECTION_THEMES[values.theme]) errors.theme = 'Elige un color.'

  return errors
}

// Valores del formulario → colección lista para guardar (sin los productos, que van aparte)
export function toCollection(values) {
  return {
    id: values.id,
    name: values.name.trim(),
    description: values.description.trim(),
    theme: values.theme,
    isVisible: values.isVisible,
    showOnHome: values.showOnHome,
  }
}

const sortedIds = (ids) => [...ids].sort().join('|')

export const haveProductsChanged = (initial, current) => sortedIds(initial.productIds) !== sortedIds(current.productIds)

export function isCollectionDirty(initial, current) {
  const fields = ['id', 'name', 'description', 'theme', 'isVisible', 'showOnHome']
  return fields.some((field) => initial[field] !== current[field]) || haveProductsChanged(initial, current)
}
