// Etiquetas pequeñas sobre el nombre: "Nuevo" y la colección, si corresponde.
function ProductTags({ product }) {
  const isMarina = product.collection === 'marina'
  if (!product.isNew && !isMarina) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {product.isNew && (
        <li className="border border-line px-2 py-1 text-[10px] uppercase tracking-widest text-stone">
          Nuevo
        </li>
      )}
      {isMarina && (
        <li className="border border-gold px-2 py-1 text-[10px] uppercase tracking-widest text-ink">
          Colección Marina
        </li>
      )}
    </ul>
  )
}

export default ProductTags
