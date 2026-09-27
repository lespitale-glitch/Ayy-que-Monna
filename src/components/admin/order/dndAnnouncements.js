// Textos que dnd-kit lee en voz alta (lector de pantalla) mientras se arrastra.
// Por defecto están en inglés: los traducimos y agregamos la posición.
export function createAnnouncements(items) {
  const nameOf = (id) => items.find((p) => p.id === id)?.name ?? id
  const positionOf = (id) => items.findIndex((p) => p.id === id) + 1
  const total = items.length

  // Último lugar anunciado: dnd-kit avisa "está sobre sí mismo" apenas se toma el producto,
  // y ese aviso taparía el de "Tomaste…". Solo anunciamos cuando cambia de lugar.
  let lastOverId = null

  return {
    onDragStart: ({ active }) => {
      lastOverId = active.id
      return `Tomaste ${nameOf(active.id)}, posición ${positionOf(active.id)} de ${total}.`
    },
    onDragOver: ({ active, over }) => {
      if (!over || over.id === lastOverId) return undefined
      lastOverId = over.id
      return `${nameOf(active.id)} se movió a la posición ${positionOf(over.id)} de ${total}.`
    },
    onDragEnd: ({ active, over }) =>
      over
        ? `Soltaste ${nameOf(active.id)} en la posición ${positionOf(over.id)} de ${total}.`
        : `Soltaste ${nameOf(active.id)}.`,
    onDragCancel: ({ active }) => `Se canceló. ${nameOf(active.id)} volvió a su lugar.`,
  }
}

// Instrucciones que se leen al enfocar el asa de arrastre
export const SCREEN_READER_INSTRUCTIONS = {
  draggable:
    'Para mover el producto, presiona Espacio. Usa las flechas arriba y abajo para cambiar su posición, ' +
    'Espacio de nuevo para soltarlo o Escape para cancelar.',
}
