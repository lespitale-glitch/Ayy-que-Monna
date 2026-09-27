import { toTitleCase } from '../../utils/text.js'

// Miniatura del producto; si no tiene fotos, un recuadro vacío
function ProductThumb({ product, className = 'w-14' }) {
  const src = product.images[0]
  return (
    <div
      className={`aspect-product shrink-0 overflow-hidden bg-white ${className}`}
    >
      {src ? (
        // Los productos ocultos se ven atenuados (solo la foto, así el texto mantiene su contraste)
        <img
          src={src}
          alt={toTitleCase(product.name)}
          loading="lazy"
          className={`h-full w-full object-cover ${product.isVisible ? '' : 'opacity-50'}`}
        />
      ) : (
        <span className="flex h-full items-center justify-center text-[10px] uppercase text-stone">Sin foto</span>
      )}
    </div>
  )
}

export default ProductThumb
