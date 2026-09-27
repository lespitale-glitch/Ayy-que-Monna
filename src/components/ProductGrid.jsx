import ProductCard from './ProductCard.jsx'

function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p className="py-24 text-center text-sm text-stone">No hay productos en esta categoría.</p>
  }

  return (
    // Mobile-first: 2 columnas en el teléfono, 3 en tablet y 4 en escritorio
    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
      {/* .map() recorre el array y devuelve una tarjeta por producto.
          "key" ayuda a React a identificar cada elemento de la lista. */}
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid
