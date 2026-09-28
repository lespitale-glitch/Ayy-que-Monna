import { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import FaqForm from '../../components/admin/faqs/FaqForm.jsx'
import { useFaqEditor } from '../../hooks/useFaqEditor.js'
import { EMPTY_FAQ, valuesFromFaq } from '../../utils/faqForm.js'

// Crear (/admin/preguntas/nueva) o editar (/admin/preguntas/:id) una pregunta frecuente.
// Desde "Sin responder" se llega con la pregunta de la clienta ya escrita (location.state).
function AdminFaqForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const fromQuestion = state?.fromQuestion ?? null // { id, question }
  const editor = useFaqEditor(id, fromQuestion?.id)

  const initialValues = useMemo(() => {
    if (editor.faq) return valuesFromFaq(editor.faq)
    return fromQuestion ? { ...EMPTY_FAQ, question: fromQuestion.question } : EMPTY_FAQ
  }, [editor.faq, fromQuestion])

  const handleSubmit = async (values) => {
    const saved = await editor.save(values)
    if (saved) navigate('/admin/preguntas', { state: { flash: `La pregunta se ${editor.isNew ? 'creó' : 'guardó'} correctamente.` } })
  }

  return (
    <section>
      <Link to="/admin/preguntas" className="text-xs uppercase tracking-widest text-stone hover:text-ink">
        ← Volver a preguntas
      </Link>
      <h1 className="mt-6 text-4xl">{editor.isNew ? 'Nueva pregunta' : 'Editar pregunta'}</h1>
      {fromQuestion && (
        <p className="mt-3 text-sm text-stone">Al guardarla, la pregunta sin responder se marca como resuelta.</p>
      )}

      {editor.status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">Cargando…</p>
      )}
      {editor.status === 'notfound' && <p role="alert" className="mt-10 text-sm">Esa pregunta ya no existe.</p>}
      {editor.status === 'error' && (
        <p role="alert" className="mt-10 text-sm">No se pudo cargar la pregunta. Recarga la página para intentar de nuevo.</p>
      )}
      {editor.status === 'ready' && (
        <FaqForm
          key={id ?? 'nueva'}
          initialValues={initialValues}
          isNew={editor.isNew}
          isSaving={editor.isSaving}
          saveError={editor.saveError}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}

export default AdminFaqForm
