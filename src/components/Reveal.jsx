import { useReveal } from '../hooks/useReveal.js'

// Envuelve cualquier contenido para que aparezca con un fundido suave hacia arriba
// al hacer scroll. "motion-safe:" aplica la animación solo si la persona NO activó
// "reducir movimiento" en su sistema (accesibilidad).
function Reveal({ as: Tag = 'div', className = '', children }) {
  const [ref, isVisible] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`motion-safe:transition motion-safe:duration-700 motion-safe:ease-soft ${
        isVisible ? 'opacity-100 translate-y-0' : 'motion-safe:translate-y-4 motion-safe:opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

export default Reveal
