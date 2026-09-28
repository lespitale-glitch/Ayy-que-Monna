// Elección de la visita sobre las cookies de analítica, guardada en su navegador.
// Si algún día cambia lo que se mide, subir VERSION: así se vuelve a preguntar.
const KEY = 'ayyquemonna_consent'
const VERSION = 1

// Devuelve 'granted' (aceptó), 'denied' (rechazó) o null (todavía no eligió)
export function readConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return saved?.version === VERSION && ['granted', 'denied'].includes(saved.value) ? saved.value : null
  } catch {
    return null // modo privado o datos rotos: se vuelve a preguntar
  }
}

export function saveConsent(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ value, version: VERSION, date: new Date().toISOString() }))
  } catch {
    // Si no se puede guardar, la elección vale solo para esta visita
  }
}

// ¿Hay algo para medir? Sin IDs en Ajustes no se muestra el aviso
export const hasAnalytics = (settings) => Boolean(settings.ga4Id || settings.metaPixelId)

// "Google Analytics y Meta" / "Google Analytics" / "Meta"
export function trackerNames(settings) {
  const names = [settings.ga4Id && 'Google Analytics', settings.metaPixelId && 'Meta (Facebook e Instagram)'].filter(Boolean)
  return names.join(' y ')
}
