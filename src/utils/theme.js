// Colores de la marca editables desde /admin/ajustes: los dos tonos del degradado de los
// botones principales. De esos dos colores se calcula el resto, para que todo se lea bien:
//  - el color de las letras del botón: blanco si el botón es oscuro, negro si es claro;
//  - los tonos de los textos destacados (text-gradient, eyebrows, foco): el mismo color, oscurecido
//    lo justo para leerse sobre el fondo crema si es demasiado claro.
// Todo se aplica como variables CSS en <html> (themeVars); tailwind.config.js las usa en
// `bg-brand-deep`, `text-on-brand`, `bg-brand-text`, `mango-deep` y `fucsia-deep`.

// Los tonos "deep" del logo (los de siempre). Iguales a los valores por defecto de schema.sql.
export const DEFAULT_THEME = { brandColorFrom: '#C2410C', brandColorTo: '#BE185D' }

// Mismo formato que el CHECK de schema.sql: "#" + 6 dígitos hexadecimales en mayúsculas
export const HEX_PATTERN = /^#[0-9A-F]{6}$/

// Mínimo WCAG AA para texto normal
export const MIN_CONTRAST = 4.5
const WHITE = '#FFFFFF'
const INK = '#1A1A1A' // el negro de los textos de la tienda (token `ink`)
const BONE = '#FFF8F3' // el fondo crema (token `bone`)
const BLACK = '#000000'

// Combinaciones listas (con cualquiera, las letras se calculan solas)
export const THEME_PRESETS = [
  { id: 'logo', label: 'Colores del logo', from: '#C2410C', to: '#BE185D' },
  { id: 'frutilla', label: 'Frutilla', from: '#BE123C', to: '#9D174D' },
  { id: 'lavanda', label: 'Fucsia y violeta', from: '#BE185D', to: '#7E22CE' },
  { id: 'marina', label: 'Marina', from: '#0E7490', to: '#1D4ED8' },
  { id: 'jardin', label: 'Jardín', from: '#047857', to: '#0E7490' },
  { id: 'pastel', label: 'Pastel', from: '#F9A8D4', to: '#FCD34D' },
]

// "c2410c", "#c24", " #C2410C " → "#C2410C". Si no es un color válido devuelve el texto tal cual
// (así la validación puede marcar el error).
export function normalizeHex(text) {
  let hex = text.trim().replace(/^#/, '').toUpperCase()
  // Formato corto: "F80" → "FF8800"
  if (/^[0-9A-F]{3}$/.test(hex)) hex = [...hex].map((c) => c + c).join('')
  return /^[0-9A-F]{6}$/.test(hex) ? `#${hex}` : text.trim()
}

// "#C2410C" → [194, 65, 12] y al revés
const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const toHex = (rgb) => `#${rgb.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`.toUpperCase()

// Luminancia relativa (fórmula de WCAG 2): cuánta luz "percibe" el ojo de un color
function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((n) => {
    const channel = n / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Contraste entre dos colores: de 1 (iguales) a 21 (negro sobre blanco)
export function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

// Mezcla dos colores: amount 0 = a, 1 = b (así se calculan los tonos intermedios del degradado)
const mix = (a, b, amount) => {
  const [ra, rb] = [toRgb(a), toRgb(b)]
  return toHex(ra.map((n, i) => n + (rb[i] - n) * amount))
}

// Puntos del degradado que se revisan (los extremos y el medio): las letras tienen que
// leerse en todo el botón, no solo en una punta
const gradientStops = (from, to) => [0, 0.25, 0.5, 0.75, 1].map((t) => mix(from, to, t))

// El peor contraste de un color de letra sobre todo el degradado
const worstOnGradient = (text, from, to) => Math.min(...gradientStops(from, to).map((c) => contrastRatio(text, c)))

// Letras del botón: blanco si alcanza; si no, el negro de la tienda (ink); y si tampoco, negro puro.
// Con un solo color siempre hay uno que pasa: blanco o negro puro llegan a 4.5 con cualquier tono.
export function buttonTextColor(from, to) {
  const passing = [WHITE, INK, BLACK].find((c) => worstOnGradient(c, from, to) >= MIN_CONTRAST)
  if (passing) return passing
  // Ninguno pasa (degradado de muy claro a muy oscuro): el que mejor se lea, para la vista previa
  return worstOnGradient(WHITE, from, to) >= worstOnGradient(BLACK, from, to) ? WHITE : BLACK
}

// RGB ↔ HSL (tono, saturación, luminosidad). En HSL se puede oscurecer un color bajando solo la
// luminosidad: el tono y la saturación quedan iguales (mezclarlo con negro lo dejaría "apagado").
function toHsl(hex) {
  const [r, g, b] = toRgb(hex).map((n) => n / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l] // gris: sin tono
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h / 6, s, l]
}

function fromHsl([h, s, l]) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const channel = (t) => {
    const x = (t + 1) % 1
    if (x < 1 / 6) return p + (q - p) * 6 * x
    if (x < 1 / 2) return q
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
    return p
  }
  return toHex([h + 1 / 3, h, h - 1 / 3].map((t) => channel(t) * 255))
}

// Versión para textos sobre el fondo crema: si el color es muy claro, se baja su luminosidad de a
// poco hasta que se lea. Así sigue siendo "el mismo color" (mismo tono), pero legible.
export function readableTextColor(hex) {
  const isReadable = (c) => contrastRatio(c, BONE) >= MIN_CONTRAST && contrastRatio(c, WHITE) >= MIN_CONTRAST
  if (isReadable(hex)) return hex
  const [h, saturation, l] = toHsl(hex)
  // Los pasteles tienen saturación al 100%: oscurecidos así quedarían "fluo". Se suaviza un poco.
  const s = Math.min(saturation, 0.8)
  for (let light = l; light >= 0; light -= 0.01) {
    const candidate = fromHsl([h, s, light])
    if (isReadable(candidate)) return candidate
  }
  return INK
}

// Mensaje de error de un color, o null si está bien (solo el formato: cualquier tono sirve)
export function colorError(hex) {
  return HEX_PATTERN.test(hex) ? null : 'Elige un color o escribe un código como #C2410C.'
}

// Error de la combinación: el único caso que no tiene arreglo es un degradado de muy claro a
// muy oscuro, donde ni el blanco ni el negro se leen en todo el botón
export function pairError(from, to) {
  if (!HEX_PATTERN.test(from) || !HEX_PATTERN.test(to)) return null
  const ratio = worstOnGradient(buttonTextColor(from, to), from, to)
  return ratio < MIN_CONTRAST
    ? 'Un color es muy claro y el otro muy oscuro: ninguna letra se lee bien en todo el botón. Acerca los dos tonos.'
    : null
}

// Colores guardados → todo lo que se aplica. Si algo no sirve (dato viejo o roto), se usan los del
// logo: la tienda nunca queda con botones ilegibles.
export function resolveTheme({ brandColorFrom, brandColorTo }) {
  const isValid =
    HEX_PATTERN.test(brandColorFrom) && HEX_PATTERN.test(brandColorTo) && !pairError(brandColorFrom, brandColorTo)
  const from = isValid ? brandColorFrom : DEFAULT_THEME.brandColorFrom
  const to = isValid ? brandColorTo : DEFAULT_THEME.brandColorTo
  return {
    brandColorFrom: from,
    brandColorTo: to,
    onBrand: buttonTextColor(from, to),
    textFrom: readableTextColor(from),
    textTo: readableTextColor(to),
  }
}

// Variables CSS de un tema ya resuelto. Sirve para <html> y para la vista previa del panel
// (las variables se heredan: un div con estas variables pinta distinto solo lo que tiene adentro).
export const themeVars = (theme) => ({
  '--brand-from': theme.brandColorFrom,
  '--brand-to': theme.brandColorTo,
  '--brand-on': theme.onBrand,
  '--brand-text-from': theme.textFrom,
  '--brand-text-to': theme.textTo,
})

// Clave de localStorage: el script de index.html la lee ANTES de que cargue React, así quien
// vuelve a la tienda ve sus colores desde el primer instante (sin "parpadeo" de los viejos).
export const THEME_STORAGE_KEY = 'monna-theme'

// Aplica el tema a toda la página y lo recuerda para la próxima visita
export function applyTheme(settings) {
  const vars = themeVars(resolveTheme(settings))
  for (const [name, value] of Object.entries(vars)) {
    document.documentElement.style.setProperty(name, value)
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(vars))
  } catch {
    // Navegación privada o almacenamiento bloqueado: no pasa nada, solo no se recuerda
  }
}
