// Configuración general de la tienda. Todo lo que pueda cambiar vive aquí,
// así no hay que buscar valores sueltos dentro de los componentes.

// Número de WhatsApp para el checkout, con código de país y sin "+" ni espacios.
// ⚠️ PLACEHOLDER DE PRUEBA: reemplazar por el número real de la tienda antes del deploy final.
// Formato Argentina: 549 + código de área + número (ej. "5491112345678").
export const WHATSAPP_NUMBER = '5491112345678'

export const INSTAGRAM_URL = 'https://www.instagram.com/ayyquemonna'

// Categorías de la tienda: `slug` es lo que aparece en la URL (/tienda/aros)
// y en products.json; `label` es el texto que se muestra.
export const CATEGORIES = [
  { slug: 'aros', label: 'Aros' },
  { slug: 'collares', label: 'Collares' },
  { slug: 'anillos', label: 'Anillos' },
  { slug: 'pulseras', label: 'Pulseras' },
]
