import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../components/admin/form/ProductForm.jsx'
import { useProductEditor } from '../../hooks/useProductEditor.js'
import { EMPTY_VALUES, valuesFromProduct } from '../../utils/productForm.js'

// Crear (/admin/productos/nuevo) o editar (/admin/productos/:id) un producto
function AdminProductForm() {
  const { id } = useParams() // undefined en /admin/productos/nuevo
  const navigate = useNavigate()
  const editor = useProductEditor(id)

  const handleSubmit = async (values) => {
    const saved = await editor.save(values)
    // Volvemos a la lista con un mensaje (se lee en AdminProducts desde location.state)
    if (saved)
      navigate('/admin', { state: { flash: `${saved.name} se ${editor.isNew ? 'creó' : 'guardó'} correctamente.` } })
  }

  return (
    <section>
      <Link to="/admin" className="text-xs uppercase tracking-widest text-stone hover:text-ink">
        ← Volver a productos
      </Link>
      <h1 className="mt-6 text-4xl">{editor.isNew ? 'Nuevo producto' : 'Editar producto'}</h1>

      {editor.status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">
          {editor.isNew ? 'Cargando…' : 'Cargando producto…'}
        </p>
      )}
      {editor.status === 'notfound' && (
        <p role="alert" className="mt-10 text-sm">
          No existe un producto con el id <code>{id}</code>.
        </p>
      )}
      {editor.status === 'error' && (
        <p role="alert" className="mt-10 text-sm">
          No se pudo cargar el producto. Recarga la página para intentar de nuevo.
        </p>
      )}
      {editor.status === 'ready' && (
        <ProductForm
          // "key" reinicia el formulario si se pasa de un producto a otro
          key={id ?? 'nuevo'}
          initialValues={editor.product ? valuesFromProduct(editor.product) : EMPTY_VALUES}
          isNew={editor.isNew}
          collections={editor.collections}
          phase={editor.phase}
          saveError={editor.saveError}
          onSubmit={handleSubmit}
          onFieldEdit={editor.clearFieldError}
        />
      )}
    </section>
  )
}

export default AdminProductForm
