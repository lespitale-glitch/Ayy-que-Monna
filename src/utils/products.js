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
