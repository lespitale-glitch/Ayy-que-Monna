import { CATEGORIES } from '../../config.js'
import { PRICE_RANGES } from '../search.js'
import { fillAnswer } from '../faqText.js'
import { buildWhatsAppUrl } from '../whatsapp.js'
import { GREETING } from './botReply.js'

// Convierte las respuestas del motor (botReply.js) en mensajes para la pantalla.
// Mensaje: { from: 'bot' | 'user', text, title?, products?, link?, suggestions?, chips?, whatsappUrl?, faqLink? }
// Cada chip es { label, action } y "action" dice qué hacer al tocarlo (ver useBot).

const MENU_FAQS = 3
const GIFT_PRODUCTS = 4

export function menuChips(faqs) {
  return [
    ...faqs.slice(0, MENU_FAQS).map((faq) => ({ label: faq.question, action: { type: 'faq', id: faq.id } })),
    { label: 'Buscar un producto', action: { type: 'search-help' } },
    { label: 'Ideas para regalar', action: { type: 'gift' } },
    { label: 'Hablar por WhatsApp', action: { type: 'human' } },
  ]
}

export const welcomeMessage = (faqs) => ({ from: 'bot', text: GREETING, chips: menuChips(faqs) })

// Enlace de WhatsApp con la consulta ya escrita (solo si el número está confirmado)
export function whatsappFor(settings, question) {
  if (settings.status !== 'ready') return null
  const text = question
    ? `¡Hola Ayy Que Monna! Vengo del asistente de la web. Mi consulta: ${question}`
    : '¡Hola Ayy Que Monna! Vengo del asistente de la web y quería hacerles una consulta.'
  return buildWhatsAppUrl(settings.whatsappNumber, text)
}

export function faqMessage(faq, settings) {
  return { from: 'bot', title: faq.question, text: fillAnswer(faq.answer, settings) }
}

// Respuesta del motor → uno o dos mensajes
export function replyToMessages(reply, { faqs, settings, question }) {
  const handoff = reply.handoff ? { whatsappUrl: whatsappFor(settings, question), faqLink: reply.unanswered } : {}
  const menu = reply.menu ? { chips: menuChips(faqs) } : {}
  if (reply.kind === 'faq') {
    const messages = [faqMessage(reply.faq, settings)]
    if (reply.extra) messages.push(...replyToMessages(reply.extra, { faqs, settings, question }))
    return messages
  }
  if (reply.kind === 'gift') return [giftCategoryMessage()]
  const suggestions = reply.suggestions?.map((faq) => ({ label: faq.question, action: { type: 'faq', id: faq.id } }))
  return [
    {
      from: 'bot',
      text: reply.text,
      products: reply.products,
      link: reply.link,
      ...(suggestions ? { chips: suggestions } : menu),
      ...handoff,
    },
  ]
}

// --- Asistente de regalos: categoría → presupuesto → productos ---

export function giftCategoryMessage() {
  return {
    from: 'bot',
    text: '¡Qué lindo regalar algo! ¿Qué te gustaría regalar?',
    chips: [
      ...CATEGORIES.map((c) => ({ label: c.label, action: { type: 'gift-category', value: c.slug } })),
      { label: 'Sorprendeme', action: { type: 'gift-category', value: '' } },
    ],
  }
}

export function giftBudgetMessage(category) {
  return {
    from: 'bot',
    text: '¿Cuánto querés gastar, más o menos?',
    chips: [
      ...PRICE_RANGES.map((r) => ({ label: r.label, action: { type: 'gift-budget', category, value: r.id } })),
      { label: 'No importa', action: { type: 'gift-budget', category, value: '' } },
    ],
  }
}

// Primero los destacados y las novedades: suelen ser las mejores ideas de regalo
export function giftResultsMessage(products, category, rangeId) {
  const range = PRICE_RANGES.find((r) => r.id === rangeId)
  const rank = (p) => (p.isFeatured ? 2 : 0) + (p.isNew ? 1 : 0)
  const found = products
    .filter((p) => (!category || p.category === category) && (!range || (p.price >= range.min && p.price <= range.max)))
    .sort((a, b) => rank(b) - rank(a))
  if (found.length === 0) {
    return { from: 'bot', text: 'Con eso no encontré opciones. Probá con otro presupuesto.', chips: giftBudgetMessage(category).chips }
  }
  return {
    from: 'bot',
    text: 'Estas son algunas ideas para regalar:',
    products: found.slice(0, GIFT_PRODUCTS),
    link: { to: category ? `/tienda/${category}` : '/tienda', label: 'Ver más opciones' },
  }
}

// Antes de guardar una pregunta sin respuesta: sacamos emails y teléfonos por si alguien
// escribió sus datos (la pregunta se guarda de forma anónima).
export function sanitizeQuestion(text) {
  return text
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[dato oculto]')
    .replace(/\+?\d[\d\s-]{6,}\d/g, '[dato oculto]')
    .trim()
    .slice(0, 300)
}
