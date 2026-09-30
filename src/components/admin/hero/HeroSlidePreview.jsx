import HeroSlide from '../../home/hero/HeroSlide.jsx'
import { buildHeroSlides } from '../../../utils/heroSlides.js'

// Vista previa en vivo, con el mismo componente que usa la tienda.
// "inert": no se puede enfocar ni hacer clic (es solo para mirar).
function HeroSlidePreview({ values }) {
  const photo = values.photo
  if (!photo) return null
  const [slide] = buildHeroSlides([
    {
      id: 'preview',
      image: photo.url ?? photo.previewUrl,
      imageSmall: photo.urlSmall ?? null,
      alt: '',
      eyebrow: values.eyebrow,
      title: values.title || 'Título',
      highlight: values.highlight,
      ctaLabel: values.ctaLabel || 'Botón',
      ctaLink: '/',
    },
  ])

  return (
    <section aria-label="Vista previa" className="rounded-2xl border border-line bg-bone p-3">
      <p className="mb-3 px-1 text-xs uppercase tracking-widest text-stone">Vista previa</p>
      <div inert className="grid overflow-hidden rounded-2xl lg:aspect-[16/7]">
        <HeroSlide slide={slide} isActive position={1} total={1} isFirst />
      </div>
    </section>
  )
}

export default HeroSlidePreview
