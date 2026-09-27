import { Link } from 'react-router-dom'
import { ArrowUpDown, Plus } from 'lucide-react'

// Encabezado de la lista de productos: título, totales y accesos a "Ordenar" y "Nuevo"
function AdminProductsHeader({ total, hiddenCount }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-stone">Panel de administración</p>
        <h1 className="mt-3 text-4xl">Productos</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        <p className="text-xs uppercase tracking-widest text-stone">
          {total} en total · {hiddenCount} {hiddenCount === 1 ? 'oculto' : 'ocultos'}
        </p>
        <Link to="/admin/orden" className="btn-outline px-5">
          <ArrowUpDown size={14} strokeWidth={1.5} aria-hidden="true" />
          Ordenar catálogo
        </Link>
        <Link to="/admin/productos/nuevo" className="btn-primary px-5">
          <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
          Nuevo producto
        </Link>
      </div>
    </header>
  )
}

export default AdminProductsHeader
