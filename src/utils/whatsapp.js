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
      `• *${product.name}*${product.stockMode === 'on_demand' ? ' (a pedido)' : ''}${needsColor(product) ? ' (Indicar color deseado)' : ''}`,
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

// El número llega de los ajustes de la tienda (useSettings), editables desde el panel.
// encodeURIComponent convierte espacios, saltos de línea y acentos
// en un formato seguro para usar dentro de una URL.
export function buildWhatsAppUrl(number, message) {
  const base = `https://wa.me/${number}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
