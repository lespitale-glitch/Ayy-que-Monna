import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import CollectionRow from '../../components/admin/collections/CollectionRow.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import FeedbackMessage from '../../components/admin/FeedbackMessage.jsx'
import { useAdminCollections } from '../../hooks/useAdminCollections.js'
import { useFlashMessage } from '../../hooks/useFlashMessage.js'

const TOGGLE_TEXT = {
  isVisible: (on) => (on ? 'ahora se ve en la tienda' : 'ahora está oculta'),
  showOnHome: (on) => (on ? 'ahora aparece en el inicio' : 'ya no aparece en el inicio'),
}

// /admin/colecciones: lista, orden, visibilidad y borrado de colecciones
function AdminCollections() {
  const { status, collections, counts, isBusy, feedback, toggle, move, remove } = useAdminCollections()
  const flash = useFlashMessage()
  const [toDelete, setToDelete] = useState(null)

  const handleToggle = (collection, field, value) =>
    toggle(collection, field, value, `${collection.name} ${TOGGLE_TEXT[field](value)}.`)

  // Si la colección llegó a un extremo, su flecha se deshabilita: pasamos el foco a la otra
  const handleMove = (index, direction) => {
    const { name } = collections[index]
    const target = index + direction
    move(index, direction)
    if (target === 0 || target === collections.length - 1) {
      const other = target === 0 ? 'Bajar' : 'Subir'
      requestAnimationFrame(() => document.querySelector(`button[aria-label="${other} ${name}"]`)?.focus())
    }
  }

  const confirmDelete = async () => {
    await remove(toDelete)
    setToDelete(null)
  }

  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone">Panel de administración</p>
          <h1 className="mt-3 text-4xl">Colecciones</h1>
          <p className="mt-3 max-w-xl text-sm text-stone">
            Aparecen en el menú Colecciones de la tienda (en este orden) y, si lo eliges, con una sección en el inicio.
          </p>
        </div>
        <Link to="/admin/colecciones/nueva" className="btn-primary px-5">
          <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
          Nueva colección
        </Link>
      </header>

      <FeedbackMessage message={feedback ?? flash} />

      {status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">
          Cargando colecciones…
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="py-24 text-center text-sm">
          No se pudieron cargar las colecciones. Recarga la página para intentar de nuevo.
        </p>
      )}
      {status === 'ready' && collections.length === 0 && (
        <div className="mt-6 border border-line py-16 text-center">
          <p className="text-sm text-stone">Todavía no hay colecciones.</p>
          <Link to="/admin/colecciones/nueva" className="btn-outline mt-6">
            Crear la primera
          </Link>
        </div>
      )}
      {status === 'ready' && collections.length > 0 && (
        <ol className="mt-6 grid gap-3">
          {collections.map((collection, index) => (
            <CollectionRow
              key={collection.id}
              collection={collection}
              count={counts[collection.id] ?? 0}
              index={index}
              total={collections.length}
              disabled={isBusy}
              onToggle={handleToggle}
              onMove={handleMove}
              onDelete={setToDelete}
            />
          ))}
        </ol>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="¿Eliminar colección?"
        confirmLabel="Eliminar"
        isBusy={isBusy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <p>
          Vas a eliminar la colección <strong className="text-ink">{toDelete?.name}</strong>. Se quita de sus{' '}
          {counts[toDelete?.id] ?? 0} productos, pero <strong className="text-ink">los productos no se borran</strong>.
          Si solo quieres sacarla de la tienda por un tiempo, usa el interruptor Visible.
        </p>
      </ConfirmDialog>
    </section>
  )
}

export default AdminCollections
