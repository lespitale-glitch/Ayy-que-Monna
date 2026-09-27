import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import ProductOrderRow from './ProductOrderRow.jsx'
import SortableProductRow from './SortableProductRow.jsx'
import { SCREEN_READER_INSTRUCTIONS, createAnnouncements } from './dndAnnouncements.js'

// Lista del catálogo que se puede reordenar arrastrando (dnd-kit).
function SortableProductList({ items, onMove, disabled }) {
  const [activeId, setActiveId] = useState(null)

  // "Sensores": qué tipos de entrada inician un arrastre
  const sensors = useSensors(
    // Mouse: empieza a arrastrar después de moverlo 4 px (así un clic simple no arrastra)
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    // Dedo: hay que mantener presionado 200 ms (así deslizar la página sigue funcionando)
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    // Teclado: Espacio para tomar, flechas para mover, Espacio para soltar
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const ids = items.map((p) => p.id)
  // useMemo: los anuncios se crean una sola vez por orden de productos (y recuerdan el último lugar anunciado)
  const announcements = useMemo(() => createAnnouncements(items), [items])
  const activeIndex = activeId ? ids.indexOf(activeId) : -1

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (over && active.id !== over.id) onMove(ids.indexOf(active.id), ids.indexOf(over.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      accessibility={{
        announcements,
        screenReaderInstructions: SCREEN_READER_INSTRUCTIONS,
      }}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol aria-label="Productos en el orden del catálogo" className="space-y-2">
          {items.map((product, index) => (
            <SortableProductRow
              key={product.id}
              product={product}
              index={index}
              total={items.length}
              onMove={onMove}
              disabled={disabled}
            />
          ))}
        </ol>
      </SortableContext>

      {/* Copia de la fila que sigue al puntero mientras se arrastra */}
      <DragOverlay>
        {activeIndex >= 0 && (
          <ul aria-hidden="true">
            <ProductOrderRow product={items[activeIndex]} index={activeIndex} total={items.length} variant="overlay" />
          </ul>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default SortableProductList
