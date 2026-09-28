import { Link } from 'react-router-dom'
import QuantitySelector from '../product/QuantitySelector.jsx'
import { getAvailability } from '../../utils/stock.js'
import { useCart } from '../../hooks/useCart.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { toTitleCase } from '../../utils/text.js'

// Una fila del carrito: miniatura, nombre, precio, cantidad y "Eliminar".
function CartLine({ product, quantity, unavailable }) {
  const { updateQuantity, removeItem, closeCart } = useCart()
  const { status, maxQuantity } = getAvailability(product)

  return (
    <li className="flex gap-4 py-6">
      <Link to={`/producto/${product.id}`} onClick={closeCart} className="w-20 shrink-0">
        <img src={product.images[0]} alt={toTitleCase(product.name)} className="aspect-product w-full rounded-xl bg-white object-cover" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <Link
            to={`/producto/${product.id}`}
            onClick={closeCart}
            className="text-xs uppercase tracking-widest hover:underline"
          >
            {product.name}
          </Link>
          <p className="shrink-0 text-sm">{unavailable ? '—' : formatPrice(product.price * quantity)}</p>
        </div>
        <p className="mt-1 text-xs text-stone">{formatPrice(product.price)} c/u</p>
        {/* Se agotó después de agregarlo: no va en el pedido, pero no lo borramos (puede volver) */}
        {unavailable && <p className="mt-1 text-xs font-medium text-ink">Agotado: no se incluye en el pedido.</p>}
        {status === 'on_demand' && <p className="mt-1 text-xs text-stone">A pedido</p>}

        <div className="mt-auto flex items-center justify-between pt-3">
          {unavailable ? (
            <span />
          ) : (
            <QuantitySelector
              size="sm"
              value={quantity}
              max={maxQuantity}
              onChange={(newQuantity) => updateQuantity(product.id, newQuantity)}
            />
          )}
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="text-xs uppercase tracking-widest text-stone underline-offset-4 hover:text-ink hover:underline"
          >
            Eliminar
            <span className="sr-only"> {product.name}</span>
          </button>
        </div>
      </div>
    </li>
  )
}

export default CartLine
