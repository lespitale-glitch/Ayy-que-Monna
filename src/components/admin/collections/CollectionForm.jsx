import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CollectionFields from './CollectionFields.jsx'
import CollectionProductsPicker from './CollectionProductsPicker.jsx'
import UnsavedChangesDialog from '../UnsavedChangesDialog.jsx'
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js'
import { slugify } from '../../../utils/slugify.js'
import { isCollectionDirty, validateCollection } from '../../../utils/collectionForm.js'

const FIELD_LABELS = { name: 'Nombre', id: 'Id', description: 'Descripción', theme: 'Color' }

function CollectionForm({ initialValues, isNew, products, existingIds, isSaving, saveError, onSubmit, onFieldEdit }) {
  const [values, setValues] = useState(initialValues)
  // Mientras no se edite el id a mano, se sigue generando a partir del nombre
  const [idTouched, setIdTouched] = useState(!isNew)
  const [submitted, setSubmitted] = useState(false)
  const summaryRef = useRef(null)

  const blocker = useUnsavedChangesGuard(isCollectionDirty(initialValues, values) && !isSaving)
  const validate = () => validateCollection(values, { isNew, existingIds })
  const errors = submitted ? validate() : {}
  if (saveError?.field) errors[saveError.field] = saveError.message
  const errorEntries = Object.entries(errors)

  const setField = (field, value) => setValues((prev) => ({ ...prev, [field]: value }))
  const onField = (field) => (event) => {
    const { value } = event.target
    if (field === 'id') setIdTouched(true)
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
    if (Object.keys(validate()).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10">
      {(errorEntries.length > 0 || saveError) && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-10 border-l-2 border-ink bg-white p-5 outline-none">
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

      <div className="grid gap-16 lg:grid-cols-2">
        <CollectionFields values={values} errors={errors} onField={onField} setField={setField} isNew={isNew} disabled={isSaving} />
        <CollectionProductsPicker
          products={products}
          selected={values.productIds}
          onChange={(ids) => setField('productIds', ids)}
          disabled={isSaving}
        />
      </div>

      <div className="sticky bottom-0 -mx-6 mt-12 flex items-center justify-end gap-3 border-t border-line bg-bone/95 px-6 py-4 backdrop-blur">
        <p aria-live="polite" className="mr-auto text-xs uppercase tracking-widest text-stone">
          {isSaving ? 'Guardando…' : ''}
        </p>
        <Link
          to="/admin/colecciones"
          className="whitespace-nowrap border border-line px-4 py-3 text-xs uppercase tracking-widest hover:border-ink sm:px-6"
        >
          Cancelar
        </Link>
        <button type="submit" disabled={isSaving} className="btn-primary whitespace-nowrap px-4 sm:px-6">
          {isSaving ? 'Guardando…' : isNew ? 'Crear colección' : 'Guardar cambios'}
        </button>
      </div>
      <UnsavedChangesDialog blocker={blocker}>
        Hay cambios en esta colección que todavía no guardaste. Si sales ahora, se pierden.
      </UnsavedChangesDialog>
    </form>
  )
}

export default CollectionForm
