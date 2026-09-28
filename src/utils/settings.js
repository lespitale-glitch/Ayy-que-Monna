import { formatPrice } from './formatPrice.js'

// Reglas de los ajustes: las mismas que los CHECK de store_settings en schema.sql.
export const WHATSAPP_PATTERN = /^[0-9]{10,15}$/
export const INSTAGRAM_PATTERN = /^[A-Za-z0-9._]{0,30}$/
export const SHIPPING_NOTE_MAX = 300
export const PICKUP_MAX = 10
export const PICKUP_NAME_MAX = 40
export const GA4_PATTERN = /^G-[A-Z0-9]{4,20}$/
export const PIXEL_PATTERN = /^[0-9]{5,20}$/

// Deja solo los dígitos: "+54 9 11 1234-5678" → "5491112345678"
export const onlyDigits = (text) => text.replace(/\D/g, '')

// Acepta "@usuario", "usuario" o el enlace completo de Instagram
export function cleanInstagramHandle(text) {
  return text
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/.*$/, '')
}

export const instagramUrl = (handle) => (handle ? `https://www.instagram.com/${handle}` : null)

// ["Ballester", "Carapachay", "Belgrano"] → "Ballester, Carapachay y Belgrano"
// Intl.ListFormat es la forma estándar del navegador de unir listas según el idioma.
export const joinList = (items) => new Intl.ListFormat('es', { type: 'conjunction' }).format(items)

// Texto corto de envíos (sección "Por qué comprar" de la Home)
export function shippingSummary({ shippingEnabled, shippingFrom }) {
  if (!shippingEnabled) return null
  return shippingFrom
    ? `A todo el país, desde ${formatPrice(shippingFrom)} según tu ubicación.`
    : 'A todo el país, según tu ubicación.'
}

// ---------------------------------------------------------------------------
// Formulario de /admin/ajustes
// ---------------------------------------------------------------------------

// Cada punto de retiro del formulario es { key, name }: la "key" estable le permite a React
// saber qué input es cuál al quitar uno del medio (el índice cambiaría).
let lastKey = 0
export const newPickupPoint = (name = '') => ({ key: `punto-${++lastKey}`, name })

// Ajustes guardados → valores del formulario (los inputs trabajan con texto)
export function valuesFromSettings(settings) {
  return {
    whatsappNumber: settings.whatsappNumber,
    instagramHandle: settings.instagramHandle,
    shippingEnabled: settings.shippingEnabled,
    shippingNote: settings.shippingNote,
    shippingFrom: settings.shippingFrom === null ? '' : String(settings.shippingFrom),
    pickupPoints: settings.pickupPoints.map((name) => newPickupPoint(name)),
    botEnabled: settings.botEnabled,
    showLowStock: settings.showLowStock,
    ga4Id: settings.ga4Id ?? '',
    metaPixelId: settings.metaPixelId ?? '',
  }
}

// Valores del formulario → ajustes listos para guardar
export function toSettings(values) {
  return {
    whatsappNumber: onlyDigits(values.whatsappNumber),
    instagramHandle: cleanInstagramHandle(values.instagramHandle),
    shippingEnabled: values.shippingEnabled,
    shippingNote: values.shippingNote.trim(),
    shippingFrom: values.shippingFrom === '' ? null : Number(values.shippingFrom),
    // Se descartan los puntos vacíos
    pickupPoints: values.pickupPoints.map((p) => p.name.trim()).filter(Boolean),
    botEnabled: values.botEnabled,
    showLowStock: values.showLowStock,
    // Se aceptan con espacios o en minúsculas (al copiar y pegar); se guardan limpios
    ga4Id: values.ga4Id.trim().toUpperCase(),
    metaPixelId: values.metaPixelId.replace(/\s/g, ''),
  }
}

// Devuelve { campo: 'mensaje' } solo con los campos que tienen errores
export function validateSettings(values) {
  const errors = {}
  const settings = toSettings(values)

  if (!settings.whatsappNumber) errors.whatsappNumber = 'Escribe el número de WhatsApp.'
  else if (!WHATSAPP_PATTERN.test(settings.whatsappNumber))
    errors.whatsappNumber = 'Entre 10 y 15 dígitos, con código de país (ej: 5491112345678).'

  if (!INSTAGRAM_PATTERN.test(settings.instagramHandle))
    errors.instagramHandle = 'Solo letras, números, puntos y guiones bajos (máximo 30).'

  if (settings.shippingNote.length > SHIPPING_NOTE_MAX)
    errors.shippingNote = `Máximo ${SHIPPING_NOTE_MAX} caracteres.`

  const from = settings.shippingFrom
  if (from !== null && (!Number.isInteger(from) || from < 0))
    errors.shippingFrom = 'Número entero, sin puntos (o vacío para no mostrarlo).'

  if (settings.pickupPoints.length > PICKUP_MAX) errors.pickupPoints = `Máximo ${PICKUP_MAX} puntos de retiro.`
  else if (settings.pickupPoints.some((p) => p.length > PICKUP_NAME_MAX))
    errors.pickupPoints = `Cada punto puede tener hasta ${PICKUP_NAME_MAX} caracteres.`

  if (settings.ga4Id && !GA4_PATTERN.test(settings.ga4Id))
    errors.ga4Id = 'Empieza con "G-" seguido de letras y números (ej: G-AB12CD34EF).'
  if (settings.metaPixelId && !PIXEL_PATTERN.test(settings.metaPixelId))
    errors.metaPixelId = 'Solo números (entre 5 y 20).'

  return errors
}

// ¿Hay algo distinto de lo guardado? Comparamos ya "limpio" (sin espacios de más)
export function isSettingsDirty(initialValues, values) {
  return JSON.stringify(toSettings(initialValues)) !== JSON.stringify(toSettings(values))
}
