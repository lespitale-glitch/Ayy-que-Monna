import { ArrowDown, ArrowUp } from 'lucide-react'
import RowActions from '../RowActions.jsx'
import Switch from '../Switch.jsx'

const moveClass =
  'inline-flex h-9 w-9 items-center justify-center border border-line transition-colors duration-300 ease-soft hover:border-ink disabled:opacity-30'

// Una pregunta frecuente en la lista del panel
function FaqRow({ faq, index, total, disabled, onToggle, onMove, onDelete }) {
  // RowActions arma "Editar …" y "Eliminar …" con el nombre: usamos la pregunta
  const item = { name: `la pregunta "${faq.question}"` }

  return (
    <li className={`flex flex-wrap items-center gap-4 border border-line p-4 ${faq.isVisible ? 'bg-white' : 'bg-line/30'}`}>
      <div className="min-w-0 flex-1 basis-60">
        <h2 className="font-sans text-sm font-medium">{faq.question}</h2>
        <p className="mt-1 line-clamp-2 text-xs text-stone">{faq.answer}</p>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-stone">
          {faq.keywords.length} {faq.keywords.length === 1 ? 'palabra clave' : 'palabras clave'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Switch
          checked={faq.isVisible}
          onChange={(value) => onToggle(faq, 'isVisible', value)}
          label="Visible"
          srContext={faq.question}
          disabled={disabled}
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`Subir: ${faq.question}`} className={moveClass}>
            <ArrowUp size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label={`Bajar: ${faq.question}`} className={moveClass}>
            <ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <RowActions item={item} editTo={`/admin/preguntas/${faq.id}`} onDelete={() => onDelete(faq)} disabled={disabled} />
      </div>
    </li>
  )
}

export default FaqRow
