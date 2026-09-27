import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'

function ProductCard({ product }) {
  // Desestructuración: sacamos del array la primera y la segunda foto (si existe)
  const [mainImage, hoverImage] = product.images

  return (
    <Link to={`/producto/${product.id}`} className="group block">
      {/* "group" permite que los hijos reaccionen al hover de todo el link */}
      <div className="relative aspect-product overflow-hidden bg-white">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition duration-500 ease-soft ${
            hoverImage ? '' : 'group-hover:scale-[1.03]'
          }`}
        />
        {hoverImage && (
          // La segunda foto está encima, invisible, y aparece con un fundido al pasar el mouse
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-soft group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        )}
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-bone/90 px-2 py-1 text-[10px] uppercase tracking-widest">
            Nuevo
          </span>
        )}
      </div>

      <h3 className="mt-4 font-sans text-xs font-normal uppercase tracking-widest">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-stone">{formatPrice(product.price)}</p>
    </Link>
  )
}

export default ProductCard
