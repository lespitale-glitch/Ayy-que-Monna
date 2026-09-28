import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../form/FormField.jsx'
import Switch from '../Switch.jsx'
import UnsavedChangesDialog from '../UnsavedChangesDialog.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js'
import { ANSWER_MAX, QUESTION_MAX, isFaqDirty, validateFaq } from '../../../utils/faqForm.js'
import { ANSWER_TOKENS } from '../../../utils/faqText.js'

const FIELD_LABELS = { question: 'Pregunta', answer: 'Respuesta', keywords: 'Palabras clave' }

function FaqForm({ initialValues, isNew, isSaving, saveError, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const summaryRef = useRef(null)
  const blocker = useUnsavedChangesGuard(isFaqDirty(initialValues, values) && !isSaving)
  const errors = submitted ? validateFaq(values) : {}
  const errorEntries = Object.entries(errors)
  const onField = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateFaq(values)).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10 max-w-3xl">
      {(errorEntries.length > 0 || saveError) && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-10 border-l-2 border-ink bg-white p-5 outline-none">
          <p className="text-sm">{saveError ?? 'Revisa estos campos:'}</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="underline underline-offset-4">{FIELD_LABELS[field]}</a>: {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6">
        <FormField id="question" label="Pregunta" hint="Como la escribiría una clienta. Se muestra tal cual." error={errors.question}>
          <input {...fieldA11y('question', { error: errors.question, hint: true })} type="text" value={values.question} onChange={onField('question')} maxLength={QUESTION_MAX} disabled={isSaving} className={`${inputClass} h-12`} />
        </FormField>

        <FormField id="answer" label="Respuesta" hint={`${values.answer.length}/${ANSWER_MAX}. Comodines: ${ANSWER_TOKENS.map((t) => `${t.token} = ${t.help}`).join(' · ')}`} error={errors.answer}>
          <textarea {...fieldA11y('answer', { error: errors.answer, hint: true })} rows={5} value={values.answer} onChange={onField('answer')} maxLength={ANSWER_MAX} disabled={isSaving} className={`${inputClass} py-3`} />
        </FormField>

        <FormField id="keywords" label="Palabras clave" hint="Separadas por comas. Otras formas de preguntar lo mismo: sinónimos, palabras sueltas o frases cortas (ej: mandan, correo, cuánto tarda)." error={errors.keywords}>
          <textarea {...fieldA11y('keywords', { error: errors.keywords, hint: true })} rows={3} value={values.keywords} onChange={onField('keywords')} disabled={isSaving} className={`${inputClass} py-3`} />
        </FormField>

        <Switch checked={values.isVisible} onChange={(v) => setValues((prev) => ({ ...prev, isVisible: v }))} label="Visible en la tienda y en el asistente" disabled={isSaving} />
      </div>

      <div className="sticky bottom-0 -mx-6 mt-12 flex items-center justify-end gap-3 border-t border-line bg-bone/95 px-6 py-4 backdrop-blur">
        <p aria-live="polite" className="mr-auto text-xs uppercase tracking-widest text-stone">{isSaving ? 'Guardando…' : ''}</p>
        <Link to="/admin/preguntas" className="whitespace-nowrap border border-line px-4 py-3 text-xs uppercase tracking-widest hover:border-ink sm:px-6">
          Cancelar
        </Link>
        <button type="submit" disabled={isSaving} className="btn-primary whitespace-nowrap px-4 sm:px-6">
          {isSaving ? 'Guardando…' : isNew ? 'Crear pregunta' : 'Guardar cambios'}
        </button>
      </div>
      <UnsavedChangesDialog blocker={blocker}>Hay cambios en esta pregunta que todavía no guardaste. Si sales ahora, se pierden.</UnsavedChangesDialog>
    </form>
  )
}

export default FaqForm
