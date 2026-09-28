import { classifyMatch, matchFaqs } from './faqMatcher.js'
import { findProducts, isProductQuery, readProductQuery, unknownWords } from './productFinder.js'
import { detectIntent } from './intents.js'
import { toTerms } from './botText.js'
import { CATEGORY_WORDS, SYNONYMS } from './lexicon.js'

const MAX_PRODUCTS = 4

export const GREETING =
  '¡Hola! Soy el asistente de Ayy Que Monna. Preguntame sobre envíos, pagos o materiales, o contame qué estás buscando.'

// Vocabulario extra para corregir errores de tipeo: sinónimos, categorías y nombres de productos
export function buildExtraVocabulary(products) {
  const productWords = products.flatMap((p) => p.name.toLowerCase().split(/\s+/))
  return [...Object.keys(SYNONYMS), ...Object.values(SYNONYMS), ...Object.keys(CATEGORY_WORDS), ...productWords]
}

// Enlace para ver todos los resultados en la tienda
function moreLinkFor(q) {
  if (q.collection) return { to: `/seleccion/${q.collection.id}`, label: `Ver la colección ${q.collection.name}` }
  if (q.category) return { to: `/tienda/${q.category}`, label: `Ver todos los ${q.category}` }
  return { to: '/tienda', label: 'Ver toda la tienda' }
}

function productReply(q, products) {
  const found = findProducts(products, q)
  if (found.length === 0) {
    return { kind: 'no-products', text: 'No encontré productos con eso. Probá con otras palabras o mirá toda la tienda.', link: { to: '/tienda', label: 'Ver toda la tienda' } }
  }
  const reply = {
    kind: 'products',
    text: found.length === 1 ? 'Encontré este producto:' : `Encontré ${found.length} productos. Estos son algunos:`,
    products: found.slice(0, MAX_PRODUCTS),
    link: found.length > MAX_PRODUCTS ? moreLinkFor(q) : null,
  }
  // "¿Hacen aros a medida?": hay palabras que no entendimos. Mostramos los productos,
  // pero lo decimos, ofrecemos WhatsApp y guardamos la pregunta para responderla mejor.
  if (unknownWords(products, q).length > 0) {
    Object.assign(reply, {
      text: 'No estoy segura de haber entendido del todo, pero esto te puede interesar:',
      handoff: true,
      unanswered: true,
    })
  }
  return reply
}

// Decide qué contestar. Es una función pura: recibe el texto y el contexto
// ({ faqIndex, extraVocabulary, products, collections }) y devuelve un objeto respuesta.
// "kind" dice qué tipo de respuesta es; el componente decide cómo mostrarla.
export function getBotReply(text, { faqIndex, extraVocabulary = [], products = [], collections = [] }) {
  const intent = detectIntent(text)
  if (intent === 'human') return { kind: 'human', text: '¡Claro! Escribinos por WhatsApp y te responde una persona del equipo.', handoff: true }

  const terms = toTerms(text, new Set([...faqIndex.vocabulary, ...extraVocabulary]))
  // Solo un saludo o un "gracias", sin pregunta: respuesta corta
  if (terms.length === 0) {
    if (intent === 'thanks') return { kind: 'thanks', text: '¡De nada! Si necesitás algo más, acá estoy.' }
    if (intent === 'bye') return { kind: 'bye', text: '¡Chau! Gracias por pasar por Ayy Que Monna.' }
    if (intent === 'greeting') return { kind: 'greeting', text: GREETING, menu: true }
    // "?", "jajaja": no hay nada que buscar ni vale la pena guardarlo
    return { kind: 'empty', text: 'No te entendí. Probá con otras palabras o elegí una de estas opciones:', menu: true }
  }

  const q = readProductQuery(text, collections)
  const wantsProducts = isProductQuery(q)
  if (terms.some((t) => t.term === 'regalo') && !wantsProducts) {
    return { kind: 'gift', text: '¡Qué lindo regalar algo! ¿Qué te gustaría regalar?' }
  }

  const match = classifyMatch(matchFaqs(faqIndex, text, extraVocabulary))
  if (match.level === 'sure') {
    const reply = { kind: 'faq', faq: match.results[0].faq }
    // "¿Tienen aros de plata?" responde la pregunta (materiales) y además muestra aros plateados
    if (wantsProducts) Object.assign(reply, { extra: productReply(q, products) })
    return reply
  }

  if (wantsProducts || findProducts(products, q).length > 0) return productReply(q, products)

  // "¿Cuánto sale?" sin decir qué: los precios están en cada producto
  if (terms.some((t) => t.term === 'precio') && match.level === 'none') {
    return { kind: 'price', text: 'Cada producto tiene su precio en la tienda. Contame qué buscás (por ejemplo "aros dorados") y te muestro opciones.', link: { to: '/tienda', label: 'Ver la tienda' } }
  }

  if (match.level === 'maybe') {
    return { kind: 'maybe', text: 'No sé si te entendí bien. ¿Quisiste preguntar alguna de estas?', suggestions: match.results.slice(0, 3).map((r) => r.faq) }
  }

  return {
    kind: 'unknown',
    text: 'Uy, esa no la sé. Podés escribirnos por WhatsApp y te respondemos, o mirar las preguntas frecuentes.',
    handoff: true,
    unanswered: true,
  }
}
