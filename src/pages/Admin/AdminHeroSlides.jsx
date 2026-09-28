import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import HeroSlideRow from '../../components/admin/hero/HeroSlideRow.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import FeedbackMessage from '../../components/admin/FeedbackMessage.jsx'
import { useAdminHeroSlides } from '../../hooks/useAdminHeroSlides.js'
import { useFlashMessage } from '../../hooks/useFlashMessage.js'

// /admin/inicio: diapositivas del carrusel de la página de inicio
function AdminHeroSlides() {
  const { status, slides, isBusy, feedback, toggle, move, remove } = useAdminHeroSlides()
  const flash = useFlashMessage()
  const [toDelete, setToDelete] = useState(null)
  const nameOf = (slide) => `${slide.title} ${slide.highlight}`.trim()

  const handleToggle = (slide, field, value) =>
    toggle(slide, field, value, value ? 'La diapositiva ahora se ve en el inicio.' : 'La diapositiva ahora está oculta.')

  // Si llegó a un extremo, su flecha se deshabilita: pasamos el foco a la otra
  const handleMove = (index, direction) => {
    const name = nameOf(slides[index])
    const target = index + direction
    move(index, direction)
    if (target === 0 || target === slides.length - 1) {
      const other = target === 0 ? 'Bajar' : 'Subir'
      requestAnimationFrame(() =>
        [...document.querySelectorAll('button[aria-label]')].find((b) => b.getAttribute('aria-label') === `${other}: ${name}`)?.focus(),
      )
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
          <h1 className="mt-3 text-4xl">Carrusel del inicio</h1>
          <p className="mt-3 max-w-xl text-sm text-stone">
            Se muestran en este orden. Al final se suman solas las de retiro gratis e Instagram (salen de Ajustes).
          </p>
        </div>
        <Link to="/admin/inicio/nueva" className="btn-primary px-5">
          <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
          Nueva diapositiva
        </Link>
      </header>

      <FeedbackMessage message={feedback ?? flash} />

      {status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">Cargando…</p>
      )}
      {status === 'error' && (
        <p role="alert" className="py-24 text-center text-sm">No se pudo cargar el carrusel. Recarga la página para intentar de nuevo.</p>
      )}
      {status === 'ready' && slides.length === 0 && (
        <p className="mt-6 border border-line py-16 text-center text-sm text-stone">Todavía no hay diapositivas.</p>
      )}
      {status === 'ready' && slides.length > 0 && (
        <ol className="mt-6 grid gap-3">
          {slides.map((slide, index) => (
            <HeroSlideRow key={slide.id} slide={slide} index={index} total={slides.length} disabled={isBusy} onToggle={handleToggle} onMove={handleMove} onDelete={setToDelete} />
          ))}
        </ol>
      )}

      <ConfirmDialog open={toDelete !== null} title="¿Eliminar diapositiva?" confirmLabel="Eliminar" isBusy={isBusy} onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
        <p>
          Vas a eliminar <strong className="text-ink">{toDelete && nameOf(toDelete)}</strong> y su foto. Si solo quieres
          sacarla por un tiempo, usa el interruptor Visible.
        </p>
      </ConfirmDialog>
    </section>
  )
}

export default AdminHeroSlides
