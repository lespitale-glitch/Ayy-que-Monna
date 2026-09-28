import { instagramUrl, joinList } from './settings.js'

// Arma las diapositivas del carrusel del inicio.
// 1. Las que se editan en el panel (/admin/inicio, tabla hero_slides), en su orden.
// 2. Al final, las automáticas que salen de Ajustes: retiro gratis e Instagram
//    (si no hay puntos de retiro o usuario de Instagram, no aparecen).

// Foto grande + chica: el navegador elige según el ancho de la pantalla
function photo(src, small) {
  return { src, srcSet: small ? `${small} 800w, ${src} 1600w` : undefined }
}

// Enlaces internos ("/tienda") usan el router; los externos ("https://…") abren otra pestaña
const toCta = (label, link) => (link.startsWith('/') ? { label, to: link } : { label, href: link })

export function buildHeroSlides(slides, { pickupPoints, instagramHandle }) {
  const list = slides.map((s) => ({
    id: s.id,
    image: photo(s.image, s.imageSmall),
    alt: s.alt,
    eyebrow: s.eyebrow,
    title: s.title,
    highlight: s.highlight,
    cta: toCta(s.ctaLabel, s.ctaLink),
  }))
  if (pickupPoints.length > 0) {
    list.push({
      id: 'retiro',
      image: photo('/hero/banner7-lg.webp', '/hero/banner7-sm.webp'),
      alt: '',
      eyebrow: 'Envíos y retiro',
      title: 'Retiro gratis en',
      highlight: joinList(pickupPoints),
      cta: { label: 'Elegí tu favorito', to: '/tienda' },
    })
  }
  if (instagramHandle) {
    list.push({
      id: 'instagram',
      image: photo('/hero/banner6-lg.webp', '/hero/banner6-sm.webp'),
      alt: '',
      eyebrow: `@${instagramHandle}`,
      title: 'Ayy, qué',
      highlight: 'monna',
      cta: { label: 'Seguinos en Instagram', href: instagramUrl(instagramHandle) },
    })
  }
  return list
}
