import { useState } from 'react'
import AdminProductCards from '../../components/admin/AdminProductCards.jsx'
import AdminProductsHeader from '../../components/admin/AdminProductsHeader.jsx'
import AdminProductsTable from '../../components/admin/AdminProductsTable.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import FeedbackMessage from '../../components/admin/FeedbackMessage.jsx'
import ProductFilters from '../../components/admin/ProductFilters.jsx'
import StockAlertBanner from '../../components/admin/StockAlertBanner.jsx'
import { useAdminProducts } from '../../hooks/useAdminProducts.js'
import { useFlashMessage } from '../../hooks/useFlashMessage.js'
import { filterAdminProducts } from '../../utils/adminFilters.js'

const INITIAL_FILTERS = { query: '', category: '', visibility: '', stock: '' }

function AdminProducts() {
  const { products, status, reload, savingIds, feedback, updateFields, changeStock, removeProduct } = useAdminProducts()
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  // Producto que se está por eliminar (abre el diálogo de confirmación)
  const [toDelete, setToDelete] = useState(null)

  // Mensaje que deja el formulario al guardar ("Se guardó correctamente…")
  const flash = useFlashMessage()
  const message = feedback ?? flash

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
        <button type="button" onClick={reload} className="btn-outline mt-6">
          Reintentar
        </button>
      </div>
    )
  }

  const listProps = { products: visibleProducts, savingIds, onToggle: handleToggle, onStockChange: changeStock, onDelete: setToDelete }

  return (
    <section>
      <AdminProductsHeader total={products.length} hiddenCount={hiddenCount} />

      <StockAlertBanner products={products} onShow={(stock) => setFilters({ ...INITIAL_FILTERS, stock })} />

      <div className="mt-10">
        <ProductFilters filters={filters} onChange={setFilters} />
      </div>

      <FeedbackMessage message={message} />

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
