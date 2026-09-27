import { ArrowLeft, ArrowRight, Star, X } from 'lucide-react'

const iconButton =
  'flex h-8 w-8 items-center justify-center bg-bone/95 transition-colors hover:bg-ink hover:text-bone disabled:opacity-30'

// Una foto dentro del ImageUploader, con sus botones para moverla, hacerla principal o quitarla.
// Todos son botones reales: se pueden usar con Tab + Enter, sin mouse.
function ImageTile({ image, index, total, disabled, onMove, onMakeMain, onRemove }) {
  const number = index + 1

  return (
    <li className="relative">
      <img
        src={image.url ?? image.previewUrl}
        alt={`Foto ${number}${index === 0 ? ' (principal)' : ''}`}
        className="aspect-product w-full border border-line bg-white object-cover"
      />
      {index === 0 && (
        <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[10px] uppercase tracking-widest text-bone">
          Principal
        </span>
      )}
      {!image.url && (
        <span className="absolute right-2 top-2 bg-bone/95 px-2 py-1 text-[10px] uppercase tracking-widest">Nueva</span>
      )}

      <div className="absolute inset-x-2 bottom-2 flex justify-between gap-1">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={disabled || index === 0}
            className={iconButton}
            aria-label={`Mover foto ${number} a la izquierda`}
          >
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={disabled || index === total - 1}
            className={iconButton}
            aria-label={`Mover foto ${number} a la derecha`}
          >
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
          {index > 0 && (
            <button
              type="button"
              onClick={onMakeMain}
              disabled={disabled}
              className={iconButton}
              aria-label={`Usar foto ${number} como principal`}
            >
              <Star size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className={iconButton}
          aria-label={`Quitar foto ${number}`}
        >
          <X size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}

export default ImageTile
