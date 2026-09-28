import { Link } from 'react-router-dom'
import { Check, Plus, RotateCcw, Trash2 } from 'lucide-react'

const dateFormat = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const buttonClass =
  'inline-flex h-9 items-center gap-2 border border-line px-3 text-xs uppercase tracking-widest transition-colors duration-300 ease-soft hover:border-ink disabled:opacity-40'

// Una pregunta sin responder: cuántas veces se hizo, cuándo, y qué hacer con ella
function BotQuestionRow({ question, isBusy, onResolve, onDelete }) {
  const { timesAsked } = question

  return (
    <li className={`flex flex-wrap items-center gap-4 border border-line p-4 ${question.isResolved ? 'bg-line/30' : 'bg-white'}`}>
      <div className="min-w-0 flex-1 basis-60">
        <p className="text-sm">“{question.question}”</p>
        <p className="mt-1 text-xs text-stone">
          {timesAsked} {timesAsked === 1 ? 'vez' : 'veces'} · última: {dateFormat.format(new Date(question.lastAsked))}
          {question.isResolved && ' · resuelta'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {!question.isResolved && (
          <Link
            to="/admin/preguntas/nueva"
            state={{ fromQuestion: { id: question.id, question: question.question } }}
            className={buttonClass}
          >
            <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            Crear respuesta
          </Link>
        )}
        <button type="button" onClick={() => onResolve(question, !question.isResolved)} disabled={isBusy} className={buttonClass}>
          {question.isResolved ? <RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" /> : <Check size={14} strokeWidth={1.5} aria-hidden="true" />}
          {question.isResolved ? 'Volver a pendiente' : 'Marcar resuelta'}
        </button>
        <button type="button" onClick={() => onDelete(question)} disabled={isBusy} aria-label={`Eliminar “${question.question}”`} className={buttonClass}>
          <Trash2 size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}

export default BotQuestionRow
