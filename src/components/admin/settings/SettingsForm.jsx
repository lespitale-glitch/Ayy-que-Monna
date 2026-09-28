import { useRef, useState } from 'react'
import ContactFields from './ContactFields.jsx'
import ShippingFields from './ShippingFields.jsx'
import AssistantFields from './AssistantFields.jsx'
import UnsavedChangesDialog from '../UnsavedChangesDialog.jsx'
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js'
import { isSettingsDirty, validateSettings } from '../../../utils/settings.js'
import { SETTINGS_LABELS } from './settingsConfig.js'

// Formulario de /admin/ajustes. Se reinicia (key) después de cada guardado exitoso.
function SettingsForm({ initialValues, isSaving, saveError, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  // Los errores se muestran recién después del primer intento de guardar
  const [submitted, setSubmitted] = useState(false)
  const summaryRef = useRef(null)

  const isDirty = isSettingsDirty(initialValues, values)
  const blocker = useUnsavedChangesGuard(isDirty && !isSaving)
  const errors = submitted ? validateSettings(values) : {}
  const errorEntries = Object.entries(errors)

  const setField = (field, value) => setValues((prev) => ({ ...prev, [field]: value }))
  const onField = (field) => (event) => setField(field, event.target.value)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateSettings(values)).length > 0) {
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
          {errorEntries.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm">
              {errorEntries.map(([field, message]) => (
                <li key={field}>
                  <a href={`#${field}`} className="underline underline-offset-4">
                    {SETTINGS_LABELS[field]}
                  </a>
                  : {message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-16 lg:grid-cols-2">
        <div className="grid content-start gap-16">
          <ContactFields values={values} errors={errors} onField={onField} disabled={isSaving} />
          <AssistantFields values={values} setField={setField} disabled={isSaving} />
        </div>
        <ShippingFields values={values} errors={errors} onField={onField} setField={setField} disabled={isSaving} />
      </div>

      <div className="sticky bottom-0 -mx-6 mt-12 flex items-center justify-end gap-3 border-t border-line bg-bone/95 px-6 py-4 backdrop-blur">
        <p aria-live="polite" className="mr-auto text-xs uppercase tracking-widest text-stone">
          {isSaving ? 'Guardando…' : isDirty ? 'Cambios sin guardar' : ''}
        </p>
        <button
          type="button"
          onClick={() => setValues(initialValues)}
          disabled={!isDirty || isSaving}
          className="whitespace-nowrap border border-line px-4 py-3 text-xs uppercase tracking-widest hover:border-ink disabled:opacity-50 sm:px-6"
        >
          Descartar
        </button>
        <button type="submit" disabled={isSaving || !isDirty} className="btn-primary whitespace-nowrap px-4 disabled:opacity-60 sm:px-6">
          {isSaving ? 'Guardando…' : 'Guardar ajustes'}
        </button>
      </div>
      <UnsavedChangesDialog blocker={blocker}>
        Hay ajustes que todavía no guardaste. Si sales ahora, se pierden.
      </UnsavedChangesDialog>
    </form>
  )
}

export default SettingsForm
