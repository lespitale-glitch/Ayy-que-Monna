import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import CartLine from './CartLine.jsx'
import { useCart } from '../../hooks/useCart.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../../utils/whatsapp.js'

// Panel lateral del carrito. Siempre está en la página; cuando está cerrado
// lo movemos fuera de la pantalla (translate-x-full) y lo marcamos "inert"
// para que no se pueda enfocar ni leer con lector de pantalla.
function CartDrawer() {
  const { lines, subtotal, totalItems, isOpen, closeCart, clearCart } = useCart()
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

  const whatsappUrl = buildWhatsAppUrl(buildOrderMessage(lines, subtotal))

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

            <footer className="border-t border-line px-6 py-6">
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-stone">El envío y el pago se coordinan por WhatsApp.</p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 flex h-12 w-full px-3"
              >
                Finalizar pedido por WhatsApp
              </a>
              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full text-xs uppercase tracking-widest text-stone underline-offset-4 hover:text-ink hover:underline"
              >
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
