import { useCart } from '../../hooks/useCart.js'
import { useSettings } from '../../hooks/useSettings.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../../utils/whatsapp.js'

// Pie del carrito: subtotal, condiciones de envío y botón para pedir por WhatsApp
function CartCheckout() {
  const { orderLines, subtotal, clearCart } = useCart()
  const { status, whatsappNumber, shippingEnabled, shippingNote } = useSettings()

  // Hasta tener el número confirmado no armamos el enlace (evita mandar el pedido a un número viejo)
  // Solo va en el pedido lo que está disponible (los agotados quedan afuera)
  const canOrder = orderLines.length > 0
  const whatsappUrl =
    status === 'ready' && canOrder ? buildWhatsAppUrl(whatsappNumber, buildOrderMessage(orderLines, subtotal)) : null

  return (
    <div className="border-t border-line px-6 py-6">
      <div className="flex justify-between text-sm uppercase tracking-widest">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {shippingEnabled && shippingNote && <p className="mt-2 text-xs text-stone">{shippingNote}</p>}
      <p className="mt-1 text-xs text-stone">El envío y el pago se coordinan por WhatsApp.</p>

      {whatsappUrl ? (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 flex h-12 w-full px-3">
          Finalizar pedido por WhatsApp
        </a>
      ) : (
        <>
          <button type="button" disabled className="btn-primary mt-6 flex h-12 w-full px-3 opacity-60">
            {!canOrder ? 'Sin productos disponibles' : status === 'error' ? 'WhatsApp no disponible' : 'Cargando…'}
          </button>
          {canOrder && status === 'error' && (
            <p role="alert" className="mt-2 text-xs text-ink">
              No pudimos cargar el número de WhatsApp. Recargá la página para intentar de nuevo.
            </p>
          )}
        </>
      )}
      <button
        type="button"
        onClick={clearCart}
        className="mt-4 w-full text-xs uppercase tracking-widest text-stone underline-offset-4 hover:text-ink hover:underline"
      >
        Vaciar carrito
      </button>
    </div>
  )
}

export default CartCheckout
