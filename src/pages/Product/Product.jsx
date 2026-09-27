import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGallery from '../../components/product/ProductGallery.jsx'
import ProductTags from '../../components/product/ProductTags.jsx'
import QuantitySelector from '../../components/product/QuantitySelector.jsx'
import NotFound from '../NotFound/NotFound.jsx'
import { MAX_QUANTITY } from '../../context/CartContext.jsx'
import { useCart } from '../../hooks/useCart.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { useProducts } from '../../hooks/useProducts.js'
import { getCategory } from '../../utils/products.js'

// El "key" hace que React cree una página nueva al pasar de un producto a otro,
// así la cantidad y la foto elegida vuelven a empezar de cero.
function Product() {
  const { id } = useParams()
  const product = useProducts().getProductById(id)

  if (!product) return <NotFound />
  return <ProductDetail key={product.id} product={product} />
}

function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCart()
  const category = getCategory(product.category)

  // Agrega la cantidad elegida y abre el panel para que se vea el resultado
  const handleAddToCart = () => {
    addItem(product.id, quantity)
    openCart()
    setQuantity(1)
  }

  return (
    <article className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      {/* React 19 permite poner <title> dentro de un componente: cambia el título de la pestaña */}
      <title>{`${product.name} — Ayy Que Monna`}</title>

      <nav aria-label="Ruta de navegación" className="mb-8 text-xs uppercase tracking-widest text-stone">
        <Link to="/tienda" className="hover:text-ink">Tienda</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <Link to={`/tienda/${category.slug}`} className="hover:text-ink">{category.label}</Link>
      </nav>

      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <ProductTags product={product} />

          <h1 className="mt-4 text-3xl uppercase tracking-wide md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-xl">{formatPrice(product.price)}</p>

          {/* Solo mostramos la descripción si el producto tiene una */}
          {product.description && (
            <p className="mt-8 leading-relaxed text-stone">{product.description}</p>
          )}

          <div className="mt-10 flex gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} max={MAX_QUANTITY} />
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-primary h-12 flex-1 px-3"
            >
              Agregar al carrito
            </button>
          </div>

          <p className="mt-8 border-t border-line pt-6 text-xs uppercase tracking-widest text-stone">
            Pedidos y consultas por WhatsApp
          </p>
        </div>
      </div>
    </article>
  )
}

export default Product
