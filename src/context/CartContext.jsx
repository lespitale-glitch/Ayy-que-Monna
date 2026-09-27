import { useCallback, useEffect, useState } from 'react'
import { CartContext } from './cartContext.js'
import { useProducts } from '../hooks/useProducts.js'

const STORAGE_KEY = 'ayyquemonna_cart'
export const MAX_QUANTITY = 10

// Lee el carrito guardado. try/catch porque localStorage puede fallar
// (modo privado, datos corruptos) y la tienda tiene que seguir funcionando.
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const clamp = (quantity) => Math.min(MAX_QUANTITY, Math.max(1, quantity))

// En el carrito solo guardamos { id, quantity }. Nombre, precio y foto se leen
// siempre de products.json, así un cambio de precio se refleja también en carritos viejos.
export function CartProvider({ children }) {
  // Pasar una función a useState hace que loadCart() se ejecute solo la primera vez
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)
  // El carrito lee nombre, precio y fotos del catálogo compartido (Supabase o JSON)
  const { getProductById } = useProducts()

  // Cada vez que cambia "items", lo guardamos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Si no se puede guardar, el carrito sigue funcionando en memoria
    }
  }, [items])

  // --- Acciones ---
  // Usamos la forma setItems(prev => ...) porque el nuevo estado depende del anterior.

  const addItem = (id, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: clamp(item.quantity + quantity) } : item,
        )
      }
      return [...prev, { id, quantity: clamp(quantity) }]
    })
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: clamp(quantity) } : item)))
  }

  const clearCart = () => setItems([])

  // useCallback mantiene la MISMA función entre renders. CartDrawer usa closeCart
  // dentro de un useEffect: si cambiara en cada render, el efecto se repetiría sin parar.
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  // --- Datos calculados (se derivan de "items", no se guardan aparte) ---

  // Unimos cada item con su producto; si un producto ya no existe (o se ocultó), se descarta.
  // Mientras el catálogo carga, "lines" queda vacío pero "items" se conserva en localStorage.
  const lines = items
    .map((item) => ({ product: getProductById(item.id), quantity: item.quantity }))
    .filter((line) => line.product)

  // .reduce() recorre el array acumulando un valor: aquí, sumas
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)

  const value = {
    lines,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
