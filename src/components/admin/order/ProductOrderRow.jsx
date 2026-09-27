import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import ProductThumb from '../ProductThumb.jsx'
import { getCategory } from '../../../utils/products.js'

const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-fucsia disabled:opacity-30'

// Estilos según el estado: fila normal, lugar que deja la fila mientras se arrastra
// (borde punteado, el texto mantiene su contraste) y copia que sigue al puntero
const ROW_STYLE = {
  row: 'border-line bg-white',
  placeholder: 'border-dashed border-fucsia bg-brand-soft',
  overlay: 'border-fucsia bg-white shadow-lg',
}

// Parte visual de una fila del orden del catálogo (sin lógica de arrastre).
// La usan SortableProductRow (fila real) y la copia que sigue al puntero al arrastrar.
function ProductOrderRow({ product, index, total, onMove, disabled, handleProps, rowRef, style, variant = 'row' }) {
  const isOverlay = variant === 'overlay'

  return (
    <li
      ref={rowRef}
      style={style}
      className={`flex items-center gap-3 rounded-2xl border p-3 sm:gap-4 ${ROW_STYLE[variant]}`}
    >
      {isOverlay ? (
        // La copia que sigue al puntero no se puede enfocar (está oculta para lectores de pantalla)
        <span className="flex h-10 w-8 shrink-0 items-center justify-center text-stone">
          <GripVertical size={18} strokeWidth={1.5} aria-hidden="true" />
        </span>
      ) : (
        <button
          type="button"
          {...handleProps}
          aria-label={`Mover ${product.name}, posición ${index + 1} de ${total}`}
          // touch-none: en celulares el dedo arrastra la fila en vez de desplazar la página
          className="flex h-10 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-stone hover:bg-brand-soft hover:text-ink active:cursor-grabbing"
        >
          <GripVertical size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}

      <span className="w-7 shrink-0 text-right font-display text-sm tabular-nums text-stone">{index + 1}</span>
      <ProductThumb product={product} className="w-12" />

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 break-words text-xs uppercase leading-snug tracking-widest">{product.name}</p>
        <p className="mt-1 text-xs text-stone">
          {getCategory(product.category)?.label ?? product.category}
          {!product.isVisible && <span className="ml-2 rounded-full bg-line px-2 py-0.5 text-ink">Oculto</span>}
        </p>
      </div>

      {!isOverlay && (
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={disabled || index === 0}
            className={iconButton}
            aria-label={`Subir ${product.name}`}
          >
            <ArrowUp size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={disabled || index === total - 1}
            className={iconButton}
            aria-label={`Bajar ${product.name}`}
          >
            <ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      )}
    </li>
  )
}

export default ProductOrderRow
