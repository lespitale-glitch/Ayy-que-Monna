// Arma las diapositivas del carrusel del inicio: solo las que se editan en el panel
// (/admin/inicio, tabla hero_slides), en su orden. No hay placas fijas.

// Foto grande + chica: el navegador elige según el ancho de la pantalla
function photo(src, small) {
  return { src, srcSet: small ? `${small} 800w, ${src} 1600w` : undefined }
}

// Enlaces internos ("/tienda") usan el router; los externos ("https://…") abren otra pestaña
const toCta = (label, link) => (link.startsWith('/') ? { label, to: link } : { label, href: link })

export function buildHeroSlides(slides) {
  return slides.map((s) => ({
    id: s.id,
    image: photo(s.image, s.imageSmall),
    alt: s.alt,
    eyebrow: s.eyebrow,
    title: s.title,
    highlight: s.highlight,
    cta: toCta(s.ctaLabel, s.ctaLink),
  }))
}
