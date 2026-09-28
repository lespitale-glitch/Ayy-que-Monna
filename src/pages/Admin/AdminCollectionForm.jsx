import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CollectionForm from '../../components/admin/collections/CollectionForm.jsx'
import { useCollectionEditor } from '../../hooks/useCollectionEditor.js'
import { EMPTY_COLLECTION, valuesFromCollection } from '../../utils/collectionForm.js'

// Crear (/admin/colecciones/nueva) o editar (/admin/colecciones/:id) una colección
function AdminCollectionForm() {
  const { id } = useParams() // undefined en /admin/colecciones/nueva
  const navigate = useNavigate()
  const editor = useCollectionEditor(id)

  // Valores iniciales: los ids de los productos que ya están en la colección
  const initialValues = useMemo(() => {
    if (!editor.collection) return EMPTY_COLLECTION
    const productIds = editor.products.filter((p) => p.collections.includes(editor.collection.id)).map((p) => p.id)
    return valuesFromCollection(editor.collection, productIds)
  }, [editor.collection, editor.products])

  const handleSubmit = async (values) => {
    const result = await editor.save(initialValues, values)
    if (!result) return
    const { saved, productsFailed } = result
    const flash = productsFailed
      ? `${saved.name} se guardó, pero no sus productos. Ábrela y vuelve a guardar.`
      : `La colección ${saved.name} se ${editor.isNew ? 'creó' : 'guardó'} correctamente.`
    navigate('/admin/colecciones', { state: { flash, flashType: productsFailed ? 'error' : 'success' } })
  }

  return (
    <section>
      <Link to="/admin/colecciones" className="text-xs uppercase tracking-widest text-stone hover:text-ink">
        ← Volver a colecciones
      </Link>
      <h1 className="mt-6 text-4xl">{editor.isNew ? 'Nueva colección' : 'Editar colección'}</h1>

      {editor.status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">
          Cargando…
        </p>
      )}
      {editor.status === 'notfound' && (
        <p role="alert" className="mt-10 text-sm">
          No existe una colección con el id <code>{id}</code>.
        </p>
      )}
      {editor.status === 'error' && (
        <p role="alert" className="mt-10 text-sm">
          No se pudo cargar la colección. Recarga la página para intentar de nuevo.
        </p>
      )}
      {editor.status === 'ready' && (
        <CollectionForm
          key={id ?? 'nueva'}
          initialValues={initialValues}
          isNew={editor.isNew}
          products={editor.products}
          existingIds={editor.existingIds}
          isSaving={editor.isSaving}
          saveError={editor.saveError}
          onSubmit={handleSubmit}
          onFieldEdit={editor.clearFieldError}
        />
      )}
    </section>
  )
}

export default AdminCollectionForm
