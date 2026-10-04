import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart.js'

// Icono del carrito para el Header, con la cantidad de productos.
function CartButton() {
  const { totalItems, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito, ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`}
      className="relative p-2"
    >
      <ShoppingBag size={22} strokeWidth={1.25} />
      {totalItems > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-deep px-1 text-[10px] leading-none text-on-brand"
        >
          {totalItems}
        </span>
      )}
    </button>
  )
}

export default CartButton
