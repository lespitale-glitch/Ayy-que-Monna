import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice.js'
import { toTitleCase } from '../../utils/text.js'

// Grilla de miniaturas de productos dentro del buscador
function SearchResults({ products, onSelect }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <Link to={`/producto/${product.id}`} onClick={onSelect} className="group block">
            <div className="aspect-product overflow-hidden rounded-xl bg-white">
              <img
                src={product.images[0]}
                alt={toTitleCase(product.name)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
              />
            </div>
            <p className="mt-2 text-[11px] uppercase leading-snug tracking-wider">{product.name}</p>
            <p className="text-xs text-stone">{formatPrice(product.price)}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default SearchResults
