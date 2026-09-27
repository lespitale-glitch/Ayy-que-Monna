import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import AdminProductCards from '../../components/admin/AdminProductCards.jsx'
import AdminProductsTable from '../../components/admin/AdminProductsTable.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ProductFilters from '../../components/admin/ProductFilters.jsx'
import { useAdminProducts } from '../../hooks/useAdminProducts.js'
import { filterAdminProducts } from '../../utils/adminFilters.js'

const INITIAL_FILTERS = { query: '', category: '', visibility: '' }

function AdminProducts() {
  const { products, status, reload, savingIds, feedback, updateFields, removeProduct } = useAdminProducts()
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  // Producto que se está por eliminar (abre el diálogo de confirmación)
  const [toDelete, setToDelete] = useState(null)

  // Mensaje que deja el formulario al guardar (navigate con state). Lo leemos una vez
  // y lo borramos del historial para que no vuelva a aparecer al recargar.
  const location = useLocation()
  const navigate = useNavigate()
  const [flash] = useState(location.state?.flash ?? null)
  useEffect(() => {
    if (location.state?.flash) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])
  const message = feedback ?? (flash ? { type: 'success', text: flash } : null)

  const visibleProducts = filterAdminProducts(products, filters)
  const hiddenCount = products.filter((p) => !p.isVisible).length

  const handleToggle = (product, toggle, value) => {
    updateFields(product, toggle.toChanges(value), `${product.name} ${toggle.describe(value)}.`)
  }

  const confirmDelete = async () => {
    await removeProduct(toDelete)
    setToDelete(null)
  }

  if (status === 'loading') {
    return (
      <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">
        Cargando productos…
      </p>
    )
  }

  if (status === 'error') {
    return (
      <div role="alert" className="py-24 text-center">
        <p className="font-display text-2xl">No se pudieron cargar los productos</p>
        <button
          type="button"
          onClick={reload}
          className="btn-outline mt-6"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const listProps = { products: visibleProducts, savingIds, onToggle: handleToggle, onDelete: setToDelete }

  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone">Panel de administración</p>
          <h1 className="mt-3 text-4xl">Productos</h1>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <p className="text-xs uppercase tracking-widest text-stone">
            {products.length} en total · {hiddenCount} {hiddenCount === 1 ? 'oculto' : 'ocultos'}
          </p>
          <Link
            to="/admin/productos/nuevo"
            className="btn-primary px-5"
          >
            <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            Nuevo producto
          </Link>
        </div>
      </header>

      <div className="mt-10">
        <ProductFilters filters={filters} onChange={setFilters} />
      </div>

      {/* aria-live: los lectores de pantalla anuncian cada resultado sin mover el foco */}
      <div aria-live="polite" className="mt-6 min-h-6">
        {message && (
          <p
            role={message.type === 'error' ? 'alert' : undefined}
            className={`border-l-2 px-4 py-2 text-sm ${message.type === 'error' ? 'border-ink bg-white' : 'border-fucsia'}`}
          >
            {message.text}
          </p>
        )}
      </div>

      <p className="mb-4 mt-6 text-xs uppercase tracking-widest text-stone">
        Mostrando {visibleProducts.length} de {products.length}
      </p>

      {visibleProducts.length === 0 ? (
        <div className="border border-line py-16 text-center">
          <p className="text-sm text-stone">Ningún producto coincide con los filtros.</p>
          <button
            type="button"
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="mt-4 text-xs uppercase tracking-widest underline underline-offset-4"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          {/* Tabla en pantallas grandes, tarjetas en móvil y tablet */}
          <div className="hidden lg:block">
            <AdminProductsTable {...listProps} />
          </div>
          <div className="lg:hidden">
            <AdminProductCards {...listProps} />
          </div>
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="¿Eliminar producto?"
        confirmLabel="Eliminar"
        isBusy={toDelete !== null && savingIds.has(toDelete.id)}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <p>
          Vas a eliminar <strong className="text-ink">{toDelete?.name}</strong> de forma permanente. Si solo quieres
          sacarlo de la tienda por un tiempo, usa el interruptor <strong className="text-ink">Visible</strong>.
        </p>
      </ConfirmDialog>
    </section>
  )
}

export default AdminProducts
