import { CATEGORIES } from '../config.js'
import { buildSelections } from '../data/selections.js'

// Reglas del formulario de diapositiva: las mismas que la tabla hero_slides de schema.sql
export const LIMITS = { alt: 150, eyebrow: 40, title: 60, highlight: 60, ctaLabel: 30, ctaLink: 300 }
// Una página de la tienda ("/tienda/aros") o un enlace externo seguro ("https://…")
export const LINK_PATTERN = /^(\/[^/]|\/$|https:\/\/)/

// photo: { url, urlSmall } (ya guardada) o { large, small, previewUrl } (nueva, todavía sin subir)
export const EMPTY_SLIDE = {
  photo: null,
  alt: '',
  eyebrow: '',
  title: '',
  highlight: '',
  ctaLabel: 'Ver más',
  ctaLink: '/tienda',
  isVisible: true,
}

export function valuesFromSlide(slide) {
  return {
    photo: { url: slide.image, urlSmall: slide.imageSmall },
    alt: slide.alt,
    eyebrow: slide.eyebrow,
    title: slide.title,
    highlight: slide.highlight,
    ctaLabel: slide.ctaLabel,
    ctaLink: slide.ctaLink,
    isVisible: slide.isVisible,
  }
}

export function validateSlide(values) {
  const errors = {}
  const trimmed = (field) => values[field].trim()
  if (!values.photo) errors.photo = 'Elige una foto.'
  if (!trimmed('title')) errors.title = 'Escribe el título.'
  if (!trimmed('ctaLabel')) errors.ctaLabel = 'Escribe el texto del botón.'
  for (const field of ['alt', 'eyebrow', 'title', 'highlight', 'ctaLabel']) {
    if (trimmed(field).length > LIMITS[field]) errors[field] = `Máximo ${LIMITS[field]} caracteres.`
  }
  const link = trimmed('ctaLink')
  if (!LINK_PATTERN.test(link) || link.length > LIMITS.ctaLink)
    errors.ctaLink = 'Elige una página de la tienda o escribe un enlace que empiece con https://'
  return errors
}

// Valores → diapositiva lista para guardar (las URLs de la foto llegan aparte, después de subirla)
export function toSlide(values, { image, imageSmall }) {
  return {
    image,
    imageSmall,
    alt: values.alt.trim(),
    eyebrow: values.eyebrow.trim(),
    title: values.title.trim(),
    highlight: values.highlight.trim(),
    ctaLabel: values.ctaLabel.trim(),
    ctaLink: values.ctaLink.trim(),
    isVisible: values.isVisible,
  }
}

const photoKey = (photo) => photo?.url ?? photo?.previewUrl ?? ''

export function isSlideDirty(initial, current) {
  const fields = ['alt', 'eyebrow', 'title', 'highlight', 'ctaLabel', 'ctaLink', 'isVisible']
  return fields.some((f) => initial[f] !== current[f]) || photoKey(initial.photo) !== photoKey(current.photo)
}

// Destinos para el botón: la tienda, cada categoría y cada selección o colección
export function buildLinkOptions(collections) {
  return [
    { value: '/tienda', label: 'Toda la tienda' },
    ...CATEGORIES.map((c) => ({ value: `/tienda/${c.slug}`, label: `Categoría: ${c.label}` })),
    ...buildSelections(collections).map((s) => ({
      value: `/seleccion/${s.slug}`,
      label: `${s.isCollection ? 'Colección' : 'Selección'}: ${s.label}`,
    })),
    { value: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
  ]
}
