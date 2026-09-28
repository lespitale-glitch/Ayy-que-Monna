import { ArrowDown, ArrowUp } from 'lucide-react'
import RowActions from '../RowActions.jsx'
import Switch from '../Switch.jsx'

const moveClass =
  'inline-flex h-9 w-9 items-center justify-center border border-line transition-colors duration-300 ease-soft hover:border-ink disabled:opacity-30'

// Una diapositiva en la lista del panel
function HeroSlideRow({ slide, index, total, disabled, onToggle, onMove, onDelete }) {
  const name = `${slide.title} ${slide.highlight}`.trim()
  const item = { name: `la diapositiva "${name}"` }

  return (
    <li className={`flex flex-wrap items-center gap-4 border border-line p-4 ${slide.isVisible ? 'bg-white' : 'bg-line/30'}`}>
      {/* La miniatura es decorativa: el título ya está escrito al lado */}
      <img
        src={slide.imageSmall ?? slide.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className={`aspect-[4/3] w-24 shrink-0 rounded-xl object-cover ${slide.isVisible ? '' : 'opacity-50'}`}
      />
      <div className="min-w-0 flex-1 basis-48">
        {slide.eyebrow && <p className="text-[10px] uppercase tracking-widest text-stone">{slide.eyebrow}</p>}
        <h2 className="font-display text-lg">{name}</h2>
        <p className="mt-1 text-xs text-stone">
          Botón: {slide.ctaLabel} → <span className="font-mono">{slide.ctaLink}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Switch checked={slide.isVisible} onChange={(v) => onToggle(slide, 'isVisible', v)} label="Visible" srContext={name} disabled={disabled} />
        <div className="flex gap-2">
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`Subir: ${name}`} className={moveClass}>
            <ArrowUp size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label={`Bajar: ${name}`} className={moveClass}>
            <ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <RowActions item={item} editTo={`/admin/inicio/${slide.id}`} onDelete={() => onDelete(slide)} disabled={disabled} />
      </div>
    </li>
  )
}

export default HeroSlideRow
