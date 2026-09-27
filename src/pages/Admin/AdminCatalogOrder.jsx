import { Link } from 'react-router-dom'
import UnsavedChangesDialog from '../../components/admin/UnsavedChangesDialog.jsx'
import ReorderToolbar from '../../components/admin/order/ReorderToolbar.jsx'
import SortableProductList from '../../components/admin/order/SortableProductList.jsx'
import { useCatalogOrder } from '../../hooks/useCatalogOrder.js'
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard.js'

// /admin/orden: reordenar todo el catálogo (incluidos los ocultos) y guardarlo de una vez
function AdminCatalogOrder() {
  const { status, items, isDirty, isSaving, message, move, save, discard } = useCatalogOrder()

  // Si hay cambios sin guardar, preguntamos antes de salir (o avisa el navegador al cerrar la pestaña)
  const blocker = useUnsavedChangesGuard(isDirty)

  return (
    <section>
      <Link to="/admin" className="text-xs uppercase tracking-widest text-stone hover:text-ink">
        ← Volver a productos
      </Link>
      <h1 className="mt-6 text-4xl">Ordenar catálogo</h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">
        Este es el orden en que se ven los productos en la tienda. Arrastra desde el asa, usa las flechas o el teclado,
        y cuando termines toca <strong className="text-ink">Guardar orden</strong>.
      </p>

      {status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">
          Cargando productos…
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-10 text-sm">
          No se pudieron cargar los productos. Recarga la página para intentar de nuevo.
        </p>
      )}

      {status === 'ready' && (
        <div className="mt-8">
          <ReorderToolbar isDirty={isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
          {/* Anuncia cada movimiento y el resultado del guardado sin mover el foco */}
          <div aria-live="polite" className="min-h-6 py-4">
            {message && (
              <p
                role={message.type === 'error' ? 'alert' : undefined}
                className={`rounded-2xl border-l-4 bg-white px-4 py-2 text-sm ${
                  message.type === 'error' ? 'border-ink' : message.type === 'success' ? 'border-fucsia' : 'border-line'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
          <SortableProductList items={items} onMove={move} disabled={isSaving} />
        </div>
      )}

      <UnsavedChangesDialog blocker={blocker}>
        Cambiaste el orden del catálogo pero todavía no lo guardaste. Si sales ahora, se pierden esos cambios.
      </UnsavedChangesDialog>
    </section>
  )
}

export default AdminCatalogOrder
