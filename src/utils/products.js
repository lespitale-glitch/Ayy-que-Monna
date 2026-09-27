import products from '../data/products.json'
import { CATEGORIES } from '../config.js'

// Busca una categoría por su slug. Devuelve undefined si no existe.
export function getCategory(slug) {
  return CATEGORIES.find((category) => category.slug === slug)
}

// Sin categoría devuelve todo el catálogo; con categoría, solo esos productos.
// .filter() crea un array nuevo con los elementos que cumplen la condición.
export function getProductsByCategory(slug) {
  if (!slug) return products
  return products.filter((product) => product.category === slug)
}

// Busca un producto por su id. .find() devuelve el primero que coincide, o undefined.
export function getProductById(id) {
  return products.find((product) => product.id === id)
}

// --- Selecciones para la Home ---

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured)
}

export function getCollectionProducts(collection) {
  return products.filter((product) => product.collection === collection)
}

// Novedades que no aparecen ya en Destacados ni en la Colección Marina,
// para que la Home no repita los mismos productos en cada sección.
export function getNewArrivals(limit) {
  return products
    .filter((product) => product.isNew && !product.isFeatured && !product.collection)
    .slice(0, limit)
}
