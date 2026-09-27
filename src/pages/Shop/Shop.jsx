import CategoryFilter from '../../components/CategoryFilter.jsx'
import ProductGrid from '../../components/ProductGrid.jsx'
import NotFound from '../NotFound/NotFound.jsx'
import { useShopProducts } from '../../hooks/useShopProducts.js'

function Shop() {
  const { category, isValid, products } = useShopProducts()

  if (!isValid) return <NotFound />

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <header className="text-center">
        <h1 className="text-4xl md:text-6xl">{category ? category.label : 'Tienda'}</h1>
        <p className="mt-4 text-xs uppercase tracking-widest text-stone">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </p>
      </header>

      <div className="mb-12 mt-12 md:mb-16">
        <CategoryFilter />
      </div>

      <ProductGrid products={products} />
    </section>
  )
}

export default Shop
