// Google Analytics 4 y Meta Pixel, SOLO con consentimiento de la visita.
// Este módulo guarda su estado en variables propias (fuera de React): los componentes
// solo llaman a trackEvent(); si la analítica no está activa, no pasa nada.
//
// Páginas vistas:
//  - GA4 las registra solo (al activarse y con cada cambio de dirección: "medición mejorada").
//  - Meta: las mandamos a mano desde AnalyticsManager (y apagamos su registro automático),
//    así nunca cuenta las páginas del panel.

let active = false // hay consentimiento, algún ID y estamos en la tienda (no en /admin)
let ids = { ga4Id: '', metaPixelId: '' }
const started = new Set() // qué scripts ya se cargaron ('ga', 'meta')

function loadScript(src) {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function startGa(ga4Id) {
  window.dataLayer = window.dataLayer || []
  // gtag necesita recibir el objeto "arguments" tal cual (así lo define Google)
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', ga4Id)
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`)
}

// Versión mínima del código oficial de Meta: crea fbq y encola las llamadas hasta que carga el script
function startMeta(pixelId) {
  const fbq = function fbq(...args) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  }
  Object.assign(fbq, { push: fbq, loaded: true, version: '2.0', queue: [], disablePushState: true })
  window.fbq = fbq
  window._fbq = fbq
  fbq('set', 'autoConfig', false, pixelId) // sin eventos automáticos de clics
  fbq('init', pixelId)
  loadScript('https://connect.facebook.net/en_US/fbevents.js')
}

// Activa (o reactiva) la analítica con los IDs de Ajustes
export function enableAnalytics({ ga4Id, metaPixelId }) {
  ids = { ga4Id, metaPixelId }
  if (ga4Id && !started.has('ga')) {
    startGa(ga4Id)
    started.add('ga')
  }
  if (metaPixelId && !started.has('meta')) {
    startMeta(metaPixelId)
    started.add('meta')
  }
  if (ga4Id) window[`ga-disable-${ga4Id}`] = false
  if (metaPixelId) window.fbq('consent', 'grant')
  active = Boolean(ga4Id || metaPixelId)
}

// Deja de medir: al rechazar las cookies o al entrar al panel.
// Los scripts ya cargados no se pueden "descargar", pero dejan de enviar datos.
export function disableAnalytics() {
  active = false
  if (ids.ga4Id) window[`ga-disable-${ids.ga4Id}`] = true
  if (ids.metaPixelId && window.fbq) window.fbq('consent', 'revoke')
}

export const isAnalyticsActive = () => active

export function trackPageView() {
  if (active && ids.metaPixelId) window.fbq('track', 'PageView')
}

// Nombres de GA4 → nombres de Meta
const META_EVENTS = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', contact: 'Contact' }

// lines: [{ product, quantity }]
export function trackEvent(name, lines = []) {
  if (!active) return
  const value = lines.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
  if (ids.ga4Id) {
    const items = lines.map(({ product, quantity }) => ({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity,
    }))
    window.gtag('event', name, lines.length ? { currency: 'ARS', value, items } : {})
  }
  if (ids.metaPixelId && META_EVENTS[name]) {
    const data = lines.length
      ? { content_ids: lines.map((l) => l.product.id), content_type: 'product', currency: 'ARS', value }
      : {}
    window.fbq('track', META_EVENTS[name], data)
  }
}
