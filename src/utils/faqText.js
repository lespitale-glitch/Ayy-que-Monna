import { joinList } from './settings.js'

// Completa los comodines de las respuestas con los Ajustes de la tienda, así las
// preguntas frecuentes no quedan desactualizadas al cambiar el envío o los puntos de retiro.
export const ANSWER_TOKENS = [
  { token: '{envios}', help: 'el texto de envíos de Ajustes' },
  { token: '{retiro}', help: 'los puntos de retiro (ej: "Ballester, Carapachay y Belgrano")' },
  { token: '{instagram}', help: 'tu usuario de Instagram (ej: "@ayyquemonna")' },
]

export function fillAnswer(answer, settings) {
  return answer
    .replaceAll('{envios}', settings.shippingNote || 'Coordinamos el envío por WhatsApp.')
    .replaceAll('{retiro}', settings.pickupPoints.length ? joinList(settings.pickupPoints) : 'nuestros puntos de retiro')
    .replaceAll('{instagram}', settings.instagramHandle ? `@${settings.instagramHandle}` : 'nuestro Instagram')
}
