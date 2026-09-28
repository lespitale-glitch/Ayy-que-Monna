import { useState } from 'react'
import { Link } from 'react-router-dom'
import BotQuestionRow from '../../components/admin/faqs/BotQuestionRow.jsx'
import FeedbackMessage from '../../components/admin/FeedbackMessage.jsx'
import { useBotQuestions } from '../../hooks/useBotQuestions.js'

// /admin/preguntas/sin-responder: lo que las clientas preguntaron y el asistente no supo responder
function AdminBotQuestions() {
  const { status, questions, busyId, feedback, setResolved, remove } = useBotQuestions()
  const [showResolved, setShowResolved] = useState(false)
  const shown = questions.filter((q) => showResolved || !q.isResolved)
  const pending = questions.filter((q) => !q.isResolved).length

  return (
    <section>
      <Link to="/admin/preguntas" className="text-xs uppercase tracking-widest text-stone hover:text-ink">
        ← Volver a preguntas
      </Link>
      <h1 className="mt-6 text-4xl">Sin responder</h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">
        Preguntas que el asistente no supo responder, guardadas sin datos de quién las hizo. Crea una respuesta o
        agrega palabras clave a una pregunta existente, y márcala como resuelta.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-widest text-stone">{pending} pendientes</p>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-widest">
          <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} className="h-4 w-4 accent-ink" />
          Mostrar también las resueltas
        </label>
      </div>

      <FeedbackMessage message={feedback} />

      {status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">Cargando…</p>
      )}
      {status === 'error' && (
        <p role="alert" className="py-24 text-center text-sm">No se pudieron cargar las preguntas. Recarga la página.</p>
      )}
      {status === 'ready' && shown.length === 0 && (
        <p className="mt-6 border border-line py-16 text-center text-sm text-stone">
          No hay preguntas pendientes. ¡El asistente viene respondiendo todo!
        </p>
      )}
      {status === 'ready' && shown.length > 0 && (
        <ul className="mt-2 grid gap-3">
          {shown.map((question) => (
            <BotQuestionRow key={question.id} question={question} isBusy={busyId === question.id} onResolve={setResolved} onDelete={remove} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default AdminBotQuestions
