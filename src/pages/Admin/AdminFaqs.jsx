import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Plus } from 'lucide-react'
import BotTester from '../../components/admin/faqs/BotTester.jsx'
import FaqRow from '../../components/admin/faqs/FaqRow.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import FeedbackMessage from '../../components/admin/FeedbackMessage.jsx'
import { useAdminFaqs } from '../../hooks/useAdminFaqs.js'
import { useFlashMessage } from '../../hooks/useFlashMessage.js'

// /admin/preguntas: preguntas frecuentes del asistente y de /preguntas-frecuentes
function AdminFaqs() {
  const { status, faqs, pending, isBusy, feedback, toggle, move, remove } = useAdminFaqs()
  const flash = useFlashMessage()
  const [toDelete, setToDelete] = useState(null)

  const handleToggle = (faq, field, value) =>
    toggle(faq, field, value, value ? 'La pregunta ahora se ve en la tienda.' : 'La pregunta ahora está oculta.')

  // Si la pregunta llegó a un extremo, su flecha se deshabilita: pasamos el foco a la otra
  const handleMove = (index, direction) => {
    const { question } = faqs[index]
    const target = index + direction
    move(index, direction)
    if (target === 0 || target === faqs.length - 1) {
      const other = target === 0 ? 'Bajar' : 'Subir'
      requestAnimationFrame(() =>
        [...document.querySelectorAll('button[aria-label]')].find((b) => b.getAttribute('aria-label') === `${other}: ${question}`)?.focus(),
      )
    }
  }

  const confirmDelete = async () => {
    await remove(toDelete)
    setToDelete(null)
  }

  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone">Panel de administración</p>
          <h1 className="mt-3 text-4xl">Preguntas frecuentes</h1>
          <p className="mt-3 max-w-xl text-sm text-stone">
            Las usa el asistente de la tienda y la página /preguntas-frecuentes, en este orden.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/preguntas/sin-responder" className="btn-outline px-5">
            <Inbox size={14} strokeWidth={1.5} aria-hidden="true" />
            Sin responder ({pending})
          </Link>
          <Link to="/admin/preguntas/nueva" className="btn-primary px-5">
            <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            Nueva pregunta
          </Link>
        </div>
      </header>

      <FeedbackMessage message={feedback ?? flash} />

      {status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">
          Cargando preguntas…
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="py-24 text-center text-sm">
          No se pudieron cargar las preguntas. Recarga la página para intentar de nuevo.
        </p>
      )}
      {status === 'ready' && (
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem]">
          {faqs.length === 0 ? (
            <p className="border border-line py-16 text-center text-sm text-stone">Todavía no hay preguntas frecuentes.</p>
          ) : (
            <ol className="grid content-start gap-3">
              {faqs.map((faq, index) => (
                <FaqRow key={faq.id} faq={faq} index={index} total={faqs.length} disabled={isBusy} onToggle={handleToggle} onMove={handleMove} onDelete={setToDelete} />
              ))}
            </ol>
          )}
          <BotTester faqs={faqs} />
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="¿Eliminar pregunta?"
        confirmLabel="Eliminar"
        isBusy={isBusy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <p>
          Vas a eliminar <strong className="text-ink">{toDelete?.question}</strong>. Si solo quieres sacarla por un tiempo,
          usa el interruptor Visible.
        </p>
      </ConfirmDialog>
    </section>
  )
}

export default AdminFaqs
