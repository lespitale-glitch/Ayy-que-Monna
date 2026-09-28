import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import HeroSlideForm from '../../components/admin/hero/HeroSlideForm.jsx'
import { useHeroSlideEditor } from '../../hooks/useHeroSlideEditor.js'
import { EMPTY_SLIDE, buildLinkOptions, valuesFromSlide } from '../../utils/heroSlideForm.js'

// Crear (/admin/inicio/nueva) o editar (/admin/inicio/:id) una diapositiva del carrusel
function AdminHeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editor = useHeroSlideEditor(id)
  const initialValues = useMemo(() => (editor.slide ? valuesFromSlide(editor.slide) : EMPTY_SLIDE), [editor.slide])
  const linkOptions = useMemo(() => buildLinkOptions(editor.collections), [editor.collections])

  const handleSubmit = async (values) => {
    const saved = await editor.save(values)
    if (saved) navigate('/admin/inicio', { state: { flash: `La diapositiva se ${editor.isNew ? 'creó' : 'guardó'} correctamente.` } })
  }

  return (
    <section>
      <Link to="/admin/inicio" className="text-xs uppercase tracking-widest text-stone hover:text-ink">
        ← Volver al carrusel
      </Link>
      <h1 className="mt-6 text-4xl">{editor.isNew ? 'Nueva diapositiva' : 'Editar diapositiva'}</h1>

      {editor.status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">Cargando…</p>
      )}
      {editor.status === 'notfound' && <p role="alert" className="mt-10 text-sm">Esa diapositiva ya no existe.</p>}
      {editor.status === 'error' && (
        <p role="alert" className="mt-10 text-sm">No se pudo cargar la diapositiva. Recarga la página para intentar de nuevo.</p>
      )}
      {editor.status === 'ready' && (
        <HeroSlideForm
          key={id ?? 'nueva'}
          initialValues={initialValues}
          isNew={editor.isNew}
          linkOptions={linkOptions}
          phase={editor.phase}
          saveError={editor.saveError}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}

export default AdminHeroSlideForm
