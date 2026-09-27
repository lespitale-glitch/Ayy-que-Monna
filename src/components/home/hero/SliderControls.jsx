import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const iconButton =
  'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white transition-colors duration-300 ease-soft hover:border-fucsia'

// Controles del carrusel: pausa (obligatoria cuando hay avance automático),
// anterior/siguiente y un punto por diapositiva.
function SliderControls({ total, index, onGoTo, onPrev, onNext, isPaused, onTogglePause }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 pt-4 md:px-0">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onGoTo(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className="flex h-6 items-center"
          >
            {/* El área táctil es más grande que el punto visible */}
            <span
              className={`block h-2 rounded-full transition-all duration-300 ease-soft ${
                i === index ? 'w-6 bg-brand' : 'w-2 bg-stone/40'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onTogglePause}
          className={iconButton}
          aria-label={isPaused ? 'Reanudar el carrusel' : 'Pausar el carrusel'}
        >
          {isPaused ? <Play size={16} strokeWidth={1.5} /> : <Pause size={16} strokeWidth={1.5} />}
        </button>
        <button type="button" onClick={onPrev} className={iconButton} aria-label="Diapositiva anterior">
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <button type="button" onClick={onNext} className={iconButton} aria-label="Diapositiva siguiente">
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

export default SliderControls
