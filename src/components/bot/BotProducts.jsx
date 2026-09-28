import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice.js'
import { toTitleCase } from '../../utils/text.js'

// Productos sugeridos por el asistente, en una grilla de 2 columnas
function BotProducts({ products, onNavigate }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <li key={product.id}>
          <Link to={`/producto/${product.id}`} onClick={onNavigate} className="group block">
            <div className="aspect-product overflow-hidden rounded-xl bg-white">
              <img
                src={product.images[0]}
                alt={toTitleCase(product.name)}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
              />
            </div>
            <p className="mt-1.5 text-[10px] uppercase leading-tight tracking-wider">{product.name}</p>
            <p className="text-xs text-stone">{formatPrice(product.price)}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default BotProducts
