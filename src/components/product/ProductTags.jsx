import { useProducts } from '../../hooks/useProducts.js'
import { getProductCollections, getTheme } from '../../utils/collections.js'

// Etiquetas pequeñas sobre el nombre: "Nuevo" y sus colecciones, si corresponde.
function ProductTags({ product }) {
  const collections = getProductCollections(product, useProducts().collections)
  if (!product.isNew && collections.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {product.isNew && (
        <li className="rounded-full border border-fucsia px-3 py-1 text-[10px] uppercase tracking-widest text-fucsia-deep">
          Nuevo
        </li>
      )}
      {collections.map((collection) => (
        <li
          key={collection.id}
          className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest ${getTheme(collection.theme).tag}`}
        >
          Colección {collection.name}
        </li>
      ))}
    </ul>
  )
}

export default ProductTags
