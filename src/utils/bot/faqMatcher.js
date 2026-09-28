import { stem, toTerm, toTerms, words } from './botText.js'
import { STOPWORDS } from './lexicon.js'
import { normalize } from '../text.js'

// Peso de cada lugar donde puede aparecer una palabra de la pregunta frecuente
const WEIGHT = { keyword: 2, question: 1.5, answer: 0.5 }
const FUZZY_PENALTY = 0.7 // una palabra corregida (error de tipeo) vale un poco menos

// Términos con significado de un texto de la pregunta frecuente
const termsOf = (text) =>
  words(text)
    .filter((w) => !STOPWORDS.has(w) && !STOPWORDS.has(stem(w)))
    .map(toTerm)

// Prepara las preguntas frecuentes para buscar rápido. Se calcula una sola vez.
export function buildFaqIndex(faqs) {
  const entries = faqs.map((faq) => {
    const weights = new Map()
    const add = (terms, weight) => terms.forEach((t) => weights.set(t, Math.max(weights.get(t) ?? 0, weight)))
    add(termsOf(faq.answer), WEIGHT.answer)
    add(termsOf(faq.question), WEIGHT.question)
    faq.keywords.forEach((keyword) => add(termsOf(keyword), WEIGHT.keyword))
    // Frases de varias palabras ("medios de pago"): si aparecen enteras, suman extra
    const phrases = faq.keywords.map(normalize).filter((k) => k.includes(' '))
    return { faq, weights, phrases }
  })

  // IDF: una palabra que aparece en pocas preguntas distingue más que una que está en todas
  const documentCount = new Map()
  entries.forEach((e) => e.weights.forEach((_, term) => documentCount.set(term, (documentCount.get(term) ?? 0) + 1)))
  const idf = new Map([...documentCount].map(([term, n]) => [term, Math.log(1 + entries.length / n)]))

  return { entries, idf, vocabulary: new Set(documentCount.keys()) }
}

// Devuelve las preguntas ordenadas de mejor a peor: [{ faq, score, coverage }]
// - score: suma de los pesos de las palabras que coinciden
// - coverage: qué parte de las palabras de la persona se encontró (0 a 1)
export function matchFaqs(index, text, extraVocabulary = []) {
  const vocabulary = new Set([...index.vocabulary, ...extraVocabulary])
  const terms = toTerms(text, vocabulary)
  if (terms.length === 0) return []
  const normalized = normalize(text)

  return index.entries
    .map(({ faq, weights, phrases }) => {
      let score = 0
      let matched = 0
      for (const { term, fuzzy } of terms) {
        const weight = weights.get(term)
        if (!weight) continue
        matched++
        score += weight * (index.idf.get(term) ?? 1) * (fuzzy ? FUZZY_PENALTY : 1)
      }
      score += phrases.filter((p) => normalized.includes(p)).length * 1.5
      return { faq, score, coverage: matched / terms.length }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
}

// Umbrales (ajustados con las pruebas de utils/bot): por encima de SURE se responde directo;
// entre MAYBE y SURE se ofrece "¿Quisiste preguntar…?"
export const SURE = 2.2
export const MAYBE = 0.9
const SHORT_SURE = 1.2

export function classifyMatch(results) {
  const [best, second] = results
  if (!best || best.score < MAYBE) return { level: 'none', results }
  // Si la segunda está muy cerca de la primera, mejor preguntar cuál de las dos
  const isClear = !second || best.score >= second.score * 1.35
  if (best.score >= SURE && isClear) return { level: 'sure', results }
  // Preguntas cortas en las que se entendió TODO ("evnios", "cuotas?") también son seguras
  if (best.coverage === 1 && best.score >= SHORT_SURE && isClear) return { level: 'sure', results }
  return { level: 'maybe', results }
}
