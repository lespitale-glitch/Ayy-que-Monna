import { useContext } from 'react'
import { ProductsContext } from '../context/productsContext.js'

// const { getProductById, status } = useProducts()
export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts debe usarse dentro de <ProductsProvider>')
  }
  return context
}
