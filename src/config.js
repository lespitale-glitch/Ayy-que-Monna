// Configuración general de la tienda. Todo lo que pueda cambiar vive aquí,
// así no hay que buscar valores sueltos dentro de los componentes.

// Número de WhatsApp para el checkout, con código de país y sin "+" ni espacios.
// Ejemplo Argentina: "5491122334455". Se usa en el Paso 4 (carrito).
export const WHATSAPP_NUMBER = ''

export const INSTAGRAM_URL = 'https://www.instagram.com/ayyquemonna'

// Categorías de la tienda: `slug` es lo que aparece en la URL (/tienda/aros)
// y en products.json; `label` es el texto que se muestra.
export const CATEGORIES = [
  { slug: 'aros', label: 'Aros' },
  { slug: 'collares', label: 'Collares' },
  { slug: 'anillos', label: 'Anillos' },
  { slug: 'pulseras', label: 'Pulseras' },
]
