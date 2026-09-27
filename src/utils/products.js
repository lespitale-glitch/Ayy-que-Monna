import { CATEGORIES } from '../config.js'

// Funciones "puras": reciben el catálogo como parámetro y devuelven un resultado,
// sin depender de dónde vienen los datos (Supabase o products.json).

// Busca una categoría por su slug. Devuelve undefined si no existe.
export function getCategory(slug) {
  return CATEGORIES.find((category) => category.slug === slug)
}

// Sin categoría devuelve todo el catálogo; con categoría, solo esos productos.
export function getProductsByCategory(products, slug) {
  if (!slug) return products
  return products.filter((product) => product.category === slug)
}

// .find() devuelve el primer producto que coincide, o undefined.
export function getProductById(products, id) {
  return products.find((product) => product.id === id)
}

// --- Selecciones para la Home ---

export function getFeaturedProducts(products) {
  return products.filter((product) => product.isFeatured)
}

export function getCollectionProducts(products, collectionId) {
  return products.filter((product) => product.collections.includes(collectionId))
}

// Colecciones con sección propia en la Home: marcadas "en el inicio" y con al menos un producto
export function getHomeCollections(products, collections) {
  return collections.filter(
    (collection) => collection.showOnHome && products.some((p) => p.collections.includes(collection.id)),
  )
}

// Novedades que no aparecen ya en Destacados ni en las colecciones del inicio,
// para que la Home no repita los mismos productos en cada sección.
// excludedCollectionIds: ids de las colecciones que ya tienen sección en la Home.
export function getNewArrivals(products, limit, excludedCollectionIds = []) {
  return products
    .filter(
      (product) =>
        product.isNew && !product.isFeatured && !product.collections.some((id) => excludedCollectionIds.includes(id)),
    )
    .slice(0, limit)
}
