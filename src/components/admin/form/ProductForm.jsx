import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductFields from './ProductFields.jsx'
import ImageUploader from '../ImageUploader.jsx'
import Switch from '../Switch.jsx'
import UnsavedChangesDialog from '../UnsavedChangesDialog.jsx'
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js'
import { slugify } from '../../../utils/slugify.js'
import { isFormDirty, validateProduct } from '../../../utils/productForm.js'
import { FIELD_LABELS, FLAGS, PHASE_LABEL } from './formConfig.js'

function ProductForm({ initialValues, isNew, phase, saveError, onSubmit, onFieldEdit }) {
  const [values, setValues] = useState(initialValues)
  // Mientras no se edite el id a mano, se sigue generando a partir del nombre
  const [idTouched, setIdTouched] = useState(!isNew)
  // Los errores se muestran recién después del primer intento de guardar
  const [submitted, setSubmitted] = useState(false)
  const summaryRef = useRef(null)

  const isBusy = phase !== 'idle'
  // Mientras se guarda no bloqueamos: al terminar, el formulario navega solo a la lista
  const blocker = useUnsavedChangesGuard(isFormDirty(initialValues, values) && !isBusy)
  const errors = submitted ? validateProduct(values) : {}
  if (saveError?.field) errors[saveError.field] = saveError.message
  const errorEntries = Object.entries(errors)

  const setField = (field, value) => setValues((prev) => ({ ...prev, [field]: value }))

  // Devuelve el manejador onChange de un campo de texto
  const onField = (field) => (event) => {
    const { value } = event.target
    if (field === 'id') setIdTouched(true)
    // Si la base había rechazado el id (repetido), el error se borra al corregirlo
    if (field === 'id' || field === 'name') onFieldEdit?.()
    setValues((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && !idTouched ? { id: slugify(value) } : {}),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateProduct(values)).length > 0) {
      // Llevamos el foco al resumen para que el lector de pantalla lea los errores
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10">
      {(errorEntries.length > 0 || saveError) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-10 border-l-2 border-ink bg-white p-5 outline-none"
        >
          <p className="text-sm">{saveError && !saveError.field ? saveError.message : 'Revisa estos campos:'}</p>
          {errorEntries.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm">
              {errorEntries.map(([field, message]) => (
                <li key={field}>
                  <a href={`#${field}`} className="underline underline-offset-4">
                    {FIELD_LABELS[field]}
                  </a>
                  : {message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProductFields values={values} errors={errors} onField={onField} isNew={isNew} disabled={isBusy} />
        </div>

        <div id="images" className="space-y-10 lg:col-span-5">
          <ImageUploader
            images={values.images}
            onChange={(images) => setField('images', images)}
            disabled={isBusy}
            error={errors.images}
            errorId="images-error"
          />

          <fieldset>
            <legend className="text-xs uppercase tracking-widest">Estado</legend>
            <div className="mt-4 grid gap-4">
              {FLAGS.map(({ field, label }) => (
                <Switch
                  key={field}
                  checked={values[field]}
                  onChange={(value) => setField(field, value)}
                  label={label}
                  disabled={isBusy}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-6 mt-12 flex items-center justify-end gap-3 border-t border-line bg-bone/95 px-6 py-4 backdrop-blur">
        <p aria-live="polite" className="mr-auto text-xs uppercase tracking-widest text-stone">
          {PHASE_LABEL[phase] ?? ''}
        </p>
        <Link
          to="/admin"
          className="whitespace-nowrap border border-line px-4 py-3 text-xs uppercase tracking-widest hover:border-ink sm:px-6"
        >
          Cancelar
        </Link>
        <button type="submit" disabled={isBusy} className="btn-primary whitespace-nowrap px-4 sm:px-6">
          {PHASE_LABEL[phase] ?? (isNew ? 'Crear producto' : 'Guardar cambios')}
        </button>
      </div>
      <UnsavedChangesDialog blocker={blocker}>
        Hay cambios en este producto que todavía no guardaste. Si sales ahora, se pierden.
      </UnsavedChangesDialog>
    </form>
  )
}

export default ProductForm
