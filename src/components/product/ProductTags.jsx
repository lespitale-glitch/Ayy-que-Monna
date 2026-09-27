// Etiquetas pequeñas sobre el nombre: "Nuevo" y la colección, si corresponde.
function ProductTags({ product }) {
  const isMarina = product.collection === 'marina'
  if (!product.isNew && !isMarina) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {product.isNew && (
        <li className="rounded-full border border-fucsia px-3 py-1 text-[10px] uppercase tracking-widest text-fucsia-deep">
          Nuevo
        </li>
      )}
      {isMarina && (
        <li className="rounded-full border border-marina px-3 py-1 text-[10px] uppercase tracking-widest text-marina-deep">
          Colección Marina
        </li>
      )}
    </ul>
  )
}

export default ProductTags
