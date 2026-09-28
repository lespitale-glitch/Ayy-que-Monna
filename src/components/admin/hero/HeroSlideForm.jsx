import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroPhotoPicker from './HeroPhotoPicker.jsx'
import HeroSlideFields from './HeroSlideFields.jsx'
import HeroSlidePreview from './HeroSlidePreview.jsx'
import UnsavedChangesDialog from '../UnsavedChangesDialog.jsx'
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js'
import { isSlideDirty, validateSlide } from '../../../utils/heroSlideForm.js'

const FIELD_LABELS = { photo: 'Foto', title: 'Título', eyebrow: 'Etiqueta', highlight: 'Final del título', ctaLabel: 'Texto del botón', ctaLink: 'El botón lleva a', alt: 'Descripción de la foto' }
const PHASE_LABEL = { uploading: 'Subiendo foto…', saving: 'Guardando…' }

function HeroSlideForm({ initialValues, isNew, linkOptions, phase, saveError, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const summaryRef = useRef(null)
  const isBusy = phase !== 'idle'
  const blocker = useUnsavedChangesGuard(isSlideDirty(initialValues, values) && !isBusy)
  const errors = submitted ? validateSlide(values) : {}
  const errorEntries = Object.entries(errors)

  const setField = (field, value) => setValues((prev) => ({ ...prev, [field]: value }))
  const onField = (field) => (event) => setField(field, event.target.value)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateSlide(values)).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10">
      {(errorEntries.length > 0 || saveError) && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-10 border-l-2 border-ink bg-white p-5 outline-none">
          <p className="text-sm">{saveError ?? 'Revisa estos campos:'}</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={`#${field === 'ctaLink' && !linkOptions.some((o) => o.value === values.ctaLink) ? 'ctaLinkCustom' : field}`} className="underline underline-offset-4">
                  {FIELD_LABELS[field]}
                </a>
                : {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <HeroPhotoPicker photo={values.photo} onChange={(photo) => setField('photo', photo)} error={errors.photo} disabled={isBusy} />
        </div>
        <div className="lg:col-span-7">
          <HeroSlideFields values={values} errors={errors} onField={onField} setField={setField} linkOptions={linkOptions} disabled={isBusy} />
        </div>
      </div>
      <div className="mt-12">
        <HeroSlidePreview values={values} />
      </div>

      <div className="sticky bottom-0 -mx-6 mt-12 flex items-center justify-end gap-3 border-t border-line bg-bone/95 px-6 py-4 backdrop-blur">
        <p aria-live="polite" className="mr-auto text-xs uppercase tracking-widest text-stone">{PHASE_LABEL[phase] ?? ''}</p>
        <Link to="/admin/inicio" className="whitespace-nowrap border border-line px-4 py-3 text-xs uppercase tracking-widest hover:border-ink sm:px-6">
          Cancelar
        </Link>
        <button type="submit" disabled={isBusy} className="btn-primary whitespace-nowrap px-4 sm:px-6">
          {PHASE_LABEL[phase] ?? (isNew ? 'Crear diapositiva' : 'Guardar cambios')}
        </button>
      </div>
      <UnsavedChangesDialog blocker={blocker}>Hay cambios en esta diapositiva que todavía no guardaste. Si sales ahora, se pierden.</UnsavedChangesDialog>
    </form>
  )
}

export default HeroSlideForm
