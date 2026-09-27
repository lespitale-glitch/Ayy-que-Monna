import { WHATSAPP_NUMBER } from '../config.js'
import { formatPrice } from './formatPrice.js'

// Las esclavas (y cualquier producto cuya descripción hable de "color") se venden
// en varios colores: pedimos que la clienta indique cuál quiere.
function needsColor(product) {
  return product.id.startsWith('esclava') || /color/i.test(product.description)
}

// Arma el texto del pedido. Los asteriscos *así* se ven en negrita en WhatsApp.
export function buildOrderMessage(lines, total) {
  const detail = lines.map(({ product, quantity }) =>
    [
      `• *${product.name}*${needsColor(product) ? ' (Indicar color deseado)' : ''}`,
      `  Cantidad: ${quantity} × ${formatPrice(product.price)} = ${formatPrice(product.price * quantity)}`,
    ].join('\n'),
  )

  return [
    '¡Hola Ayy Que Monna! 👋 Quiero hacer este pedido:',
    '',
    ...detail,
    '',
    `*Total: ${formatPrice(total)}*`,
    '',
    '¿Me confirman disponibilidad y envío? ¡Gracias!',
  ].join('\n')
}

// encodeURIComponent convierte espacios, saltos de línea y acentos
// en un formato seguro para usar dentro de una URL.
export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
