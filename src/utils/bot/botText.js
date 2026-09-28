import { normalize } from '../text.js'
import { STOPWORDS, SYNONYMS } from './lexicon.js'

// "Raíz" muy simple para el español: saca el plural ("envios" → "envio", "materiales" → "material").
// El "es" solo se quita después de l, r, n, z, y o j (material-es, color-es, corazon-es);
// en el resto el plural es solo la "s" (tarde-s, noche-s).
export function stem(word) {
  if (word.length > 4 && word.endsWith('es') && /[lrnzyj]/.test(word[word.length - 3])) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith('s')) return word.slice(0, -1)
  return word
}

// Texto → lista de palabras normalizadas (sin acentos, signos ni mayúsculas)
export function words(text) {
  return normalize(text)
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

// Distancia de edición (Damerau-Levenshtein): cuántas letras hay que cambiar, agregar,
// sacar o intercambiar para pasar de una palabra a otra. "evnio" → "envio" = 1.
export function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}

// Errores de tipeo tolerados según el largo de la palabra
const maxTypos = (word) => (word.length >= 7 ? 2 : word.length >= 4 ? 1 : 0)

// Busca en el vocabulario la palabra más parecida (o null si ninguna está cerca)
export function closestWord(word, vocabulary) {
  const limit = maxTypos(word)
  if (limit === 0) return null
  let best = null
  let bestDistance = limit + 1
  for (const candidate of vocabulary) {
    if (Math.abs(candidate.length - word.length) > limit) continue
    const distance = editDistance(word, candidate)
    if (distance < bestDistance) {
      best = candidate
      bestDistance = distance
    }
  }
  return best
}

// Palabra → su término de búsqueda: raíz + sinónimo ("mandan" → "envio")
export const toTerm = (word) => {
  const root = stem(word)
  return SYNONYMS[word] ?? SYNONYMS[root] ?? root
}

// Texto → términos con significado (sin palabras vacías), corrigiendo errores de tipeo
// contra el vocabulario conocido. Devuelve [{ term, fuzzy }].
export function toTerms(text, vocabulary = new Set()) {
  const terms = []
  for (const word of words(text)) {
    // Las letras sueltas ("q", "x") no aportan: casi siempre son abreviaturas de chat
    if (word.length < 2 || STOPWORDS.has(word) || STOPWORDS.has(stem(word))) continue
    let term = toTerm(word)
    let fuzzy = false
    if (!vocabulary.has(term) && !SYNONYMS[word]) {
      const fixed = closestWord(stem(word), vocabulary)
      if (fixed) {
        term = SYNONYMS[fixed] ?? fixed // la palabra corregida también pasa por los sinónimos
        fuzzy = true
      }
    }
    terms.push({ term, fuzzy })
  }
  return terms
}
