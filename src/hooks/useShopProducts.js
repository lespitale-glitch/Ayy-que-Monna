import { useParams } from 'react-router-dom'
import { useProducts } from './useProducts.js'
import { getCategory } from '../utils/products.js'

// Hook propio: junta la lectura de la URL y el filtrado del catálogo,
// así la página Shop solo se ocupa de dibujar.
export function useShopProducts() {
  const { categoria } = useParams()
  const { getProductsByCategory } = useProducts()
  const category = getCategory(categoria)

  return {
    category, // { slug, label } o undefined en /tienda
    // Si la URL trae una categoría que no existe (/tienda/relojes) la marcamos como inválida
    isValid: !categoria || Boolean(category),
    products: getProductsByCategory(category?.slug),
  }
}
