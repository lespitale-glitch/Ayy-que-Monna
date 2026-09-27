import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import CartLine from './CartLine.jsx'
import CartCheckout from './CartCheckout.jsx'
import { useCart } from '../../hooks/useCart.js'

// Panel lateral del carrito. Siempre está en la página; cuando está cerrado
// lo movemos fuera de la pantalla (translate-x-full) y lo marcamos "inert"
// para que no se pueda enfocar ni leer con lector de pantalla.
function CartDrawer() {
  const { lines, totalItems, isOpen, closeCart } = useCart()
  const closeButtonRef = useRef(null)

  // Efectos al abrir: foco en "cerrar", tecla Escape y bloquear el scroll de fondo
  useEffect(() => {
    if (!isOpen) return

    closeButtonRef.current?.focus()
    const onKeyDown = (event) => event.key === 'Escape' && closeCart()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    // La función que devuelve useEffect "limpia" lo que hicimos al cerrar
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  return (
    <div inert={!isOpen} className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Fondo oscuro: al hacer clic afuera se cierra */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-500 ease-soft ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bone transition-transform duration-500 ease-soft ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="cart-title" className="text-2xl">
            Tu carrito {totalItems > 0 && <span className="font-sans text-sm text-stone">({totalItems})</span>}
          </h2>
          <button ref={closeButtonRef} type="button" onClick={closeCart} aria-label="Cerrar carrito" className="-mr-2 p-2">
            <X size={22} strokeWidth={1.25} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-2xl">Tu carrito está vacío</p>
            <Link
              to="/tienda"
              onClick={closeCart}
              className="btn-outline mt-8"
            >
              Ver la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((line) => (
                <CartLine key={line.product.id} product={line.product} quantity={line.quantity} />
              ))}
            </ul>

            <CartCheckout />
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
