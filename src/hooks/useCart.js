import { useContext } from 'react'
import { CartContext } from '../context/cartContext.js'

// Atajo para leer el carrito desde cualquier componente: const { addItem } = useCart()
export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) {
    throw new Error('useCart debe usarse dentro de <CartProvider>')
  }
  return cart
}
