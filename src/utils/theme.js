// Colores de la marca editables desde /admin/ajustes: los dos tonos del degradado de los
// botones principales y de los textos destacados (text-gradient, eyebrows, foco).
// Se aplican como variables CSS (--brand-from, --brand-to) en <html>; tailwind.config.js las usa
// en `mango-deep`, `fucsia-deep` y `bg-brand-deep`, así que ningún componente tiene que cambiar.

// Los tonos "deep" del logo (los de siempre). Iguales a los valores por defecto de schema.sql.
export const DEFAULT_THEME = { brandColorFrom: '#C2410C', brandColorTo: '#BE185D' }

// Mismo formato que el CHECK de schema.sql: "#" + 6 dígitos hexadecimales en mayúsculas
export const HEX_PATTERN = /^#[0-9A-F]{6}$/

// Mínimo WCAG AA para texto normal. Se mide contra blanco (texto de los botones) y contra
// el fondo crema `bone` (textos destacados): tiene que pasar en los dos.
export const MIN_CONTRAST = 4.5
const WHITE = '#FFFFFF'
const BONE = '#FFF8F3'

// Combinaciones listas que ya pasan AA (medidas con contrastRatio)
export const THEME_PRESETS = [
  { id: 'logo', label: 'Colores del logo', from: '#C2410C', to: '#BE185D' },
  { id: 'frutilla', label: 'Frutilla', from: '#BE123C', to: '#9D174D' },
  { id: 'lavanda', label: 'Fucsia y violeta', from: '#BE185D', to: '#7E22CE' },
  { id: 'marina', label: 'Marina', from: '#0E7490', to: '#1D4ED8' },
  { id: 'jardin', label: 'Jardín', from: '#047857', to: '#0E7490' },
]

// "c2410c", "#c24", " #C2410C " → "#C2410C". Si no es un color válido devuelve el texto tal cual
// (así la validación puede marcar el error).
export function normalizeHex(text) {
  let hex = text.trim().replace(/^#/, '').toUpperCase()
  // Formato corto: "F80" → "FF8800"
  if (/^[0-9A-F]{3}$/.test(hex)) hex = [...hex].map((c) => c + c).join('')
  return /^[0-9A-F]{6}$/.test(hex) ? `#${hex}` : text.trim()
}

// Luminancia relativa (fórmula de WCAG 2): cuánta luz "percibe" el ojo de un color
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Contraste entre dos colores: de 1 (iguales) a 21 (negro sobre blanco)
export function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

// El peor de los dos fondos (blanco y crema): es el que hay que cuidar
export const worstContrast = (hex) => Math.min(contrastRatio(hex, WHITE), contrastRatio(hex, BONE))

// ¿Se puede usar este color en botones y textos? (formato válido y contraste AA)
export const isUsableColor = (hex) => HEX_PATTERN.test(hex) && worstContrast(hex) >= MIN_CONTRAST

// Mensaje de error de un color, o null si está bien
export function colorError(hex) {
  if (!HEX_PATTERN.test(hex)) return 'Elige un color o escribe un código como #C2410C.'
  const ratio = worstContrast(hex)
  if (ratio < MIN_CONTRAST)
    return `Es muy claro para leer texto blanco encima (contraste ${ratio.toFixed(1)}:1, mínimo ${MIN_CONTRAST}:1). Prueba un tono más oscuro.`
  return null
}

// Colores guardados → los que se aplican. Si alguno no sirve (dato viejo o roto), se usan los del
// logo: la tienda nunca queda con botones ilegibles.
export function resolveTheme({ brandColorFrom, brandColorTo }) {
  return isUsableColor(brandColorFrom) && isUsableColor(brandColorTo)
    ? { brandColorFrom, brandColorTo }
    : DEFAULT_THEME
}

// Variables CSS de un tema. Sirve para <html> y para la vista previa del panel
// (las variables se heredan: un div con estas variables pinta distinto solo lo que tiene adentro).
export const themeVars = ({ brandColorFrom, brandColorTo }) => ({
  '--brand-from': brandColorFrom,
  '--brand-to': brandColorTo,
})

// Clave de localStorage: el script de index.html la lee ANTES de que cargue React, así quien
// vuelve a la tienda ve sus colores desde el primer instante (sin "parpadeo" de los viejos).
export const THEME_STORAGE_KEY = 'monna-theme'

// Aplica el tema a toda la página y lo recuerda para la próxima visita
export function applyTheme(settings) {
  const theme = resolveTheme(settings)
  for (const [name, value] of Object.entries(themeVars(theme))) {
    document.documentElement.style.setProperty(name, value)
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme))
  } catch {
    // Navegación privada o almacenamiento bloqueado: no pasa nada, solo no se recuerda
  }
}
