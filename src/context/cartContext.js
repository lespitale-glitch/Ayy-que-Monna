import { createContext } from 'react'

// El "contexto" es como una caja compartida: cualquier componente que esté dentro
// del <CartProvider> puede leer el carrito sin pasarlo por props de padre a hijo.
export const CartContext = createContext(null)
