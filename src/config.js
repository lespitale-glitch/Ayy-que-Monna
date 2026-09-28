// Configuración general de la tienda. Todo lo que pueda cambiar vive aquí,
// así no hay que buscar valores sueltos dentro de los componentes.

// Ajustes por defecto de la tienda. Con Supabase configurado, los valores reales se
// editan desde /admin/ajustes (tabla store_settings); estos se usan:
//  - en modo local (sin .env.local),
//  - mientras cargan los ajustes o si Supabase no responde (para que WhatsApp siga andando).
export const DEFAULT_SETTINGS = {
  // Código de país + área + número, sin "+" ni espacios. Formato Argentina: 549 + área + número.
  // ⚠️ PLACEHOLDER DE PRUEBA: el número real se carga desde el panel (/admin/ajustes).
  whatsappNumber: '5491112345678',
  instagramHandle: 'ayyquemonna', // sin "@"
  shippingEnabled: true,
  shippingNote: 'Enviamos a todo el país. El costo del envío está a cargo de quien compra y varía según la ubicación.',
  shippingFrom: 6000, // "desde $…"; null = no se muestra
  pickupPoints: ['Ballester', 'Carapachay', 'Belgrano'],
  botEnabled: true, // asistente de preguntas frecuentes en la tienda
  showLowStock: true, // "Últimas unidades" cuando queda poco stock
  ga4Id: '', // Google Analytics 4 (G-XXXXXXX); vacío = no se mide
  metaPixelId: '', // Meta Pixel (solo números); vacío = no se mide
}

// Categorías de la tienda: `slug` es lo que aparece en la URL (/tienda/aros)
// y en products.json; `label` es el texto que se muestra.
export const CATEGORIES = [
  { slug: 'aros', label: 'Aros' },
  { slug: 'collares', label: 'Collares' },
  { slug: 'anillos', label: 'Anillos' },
  { slug: 'pulseras', label: 'Pulseras' },
]
