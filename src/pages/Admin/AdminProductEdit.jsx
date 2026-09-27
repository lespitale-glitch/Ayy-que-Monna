import { Link, useParams } from 'react-router-dom'

// Página provisoria: el formulario de edición llega en el Paso 5.
function AdminProductEdit() {
  const { id } = useParams()
  return (
    <section>
      <Link to="/admin" className="text-xs uppercase tracking-widest text-stone hover:text-ink">
        ← Volver a productos
      </Link>
      <h1 className="mt-6 text-4xl">Editar producto</h1>
      <p className="mt-2 font-mono text-sm text-stone">{id}</p>
      <p className="mt-6 text-sm text-stone">El formulario de edición estará disponible en el próximo paso.</p>
    </section>
  )
}

export default AdminProductEdit
