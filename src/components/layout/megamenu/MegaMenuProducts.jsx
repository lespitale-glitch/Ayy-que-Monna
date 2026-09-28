import { Link } from 'react-router-dom'
import { findSelection, getSelectionProducts } from '../../../data/selections.js'
import { useProducts } from '../../../hooks/useProducts.js'
import { formatPrice } from '../../../utils/formatPrice.js'
import { toTitleCase } from '../../../utils/text.js'

const PREVIEW_COUNT = 4

// Columna derecha: algunos productos de la selección activa
function MegaMenuProducts({ selections, slug, onNavigate }) {
  const { products } = useProducts()
  const selection = findSelection(selections, slug) ?? selections[0]
  const items = getSelectionProducts(products, selection)

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-display text-2xl">{selection.label}</p>
          <p className="mt-1 text-sm text-stone">{selection.description}</p>
        </div>
        <Link
          to={`/seleccion/${selection.slug}`}
          onClick={onNavigate}
          className="shrink-0 text-xs uppercase tracking-widest underline decoration-fucsia decoration-2 underline-offset-8"
        >
          Ver los {items.length}
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-4 gap-5">
        {items.slice(0, PREVIEW_COUNT).map((product) => (
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
              <p className="mt-2 text-[11px] uppercase tracking-wider">{product.name}</p>
              <p className="text-xs text-stone">{formatPrice(product.price)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MegaMenuProducts
