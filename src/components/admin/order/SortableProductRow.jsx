import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ProductOrderRow from './ProductOrderRow.jsx'

// Fila que se puede arrastrar. Se puede mover de tres formas:
// 1) arrastrando el asa (mouse o dedo), 2) con el teclado desde el asa,
// 3) con los botones ↑ ↓ (alternativa a arrastrar que pide WCAG 2.2, criterio 2.5.7).
function SortableProductRow({ product, index, total, onMove, disabled }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
    disabled,
  })

  return (
    <ProductOrderRow
      product={product}
      index={index}
      total={total}
      onMove={onMove}
      disabled={disabled}
      rowRef={setNodeRef}
      // dnd-kit calcula el desplazamiento; lo aplicamos como transform de CSS
      style={{ transform: CSS.Transform.toString(transform), transition }}
      // El asa es el único lugar desde donde se arrastra (así el resto de la fila se puede tocar normalmente)
      handleProps={{ ref: setActivatorNodeRef, ...attributes, ...listeners }}
      variant={isDragging ? 'placeholder' : 'row'}
    />
  )
}

export default SortableProductRow
