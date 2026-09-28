import { getFinish } from '../search.js'
import { isOutOfStock } from '../stock.js'
import { stem, words } from './botText.js'
import { CATEGORY_WORDS, CHEAP_WORDS, FINISH_WORDS, STOPWORDS, SYNONYMS } from './lexicon.js'
import { normalize } from '../text.js'

const CHEAP_LIMIT = 3000

// Precio escrito en la pregunta: "menos de 5000", "hasta $ 4.500", "más de 6000"
function readPrice(text) {
  const t = normalize(text).replace(/(\d)\.(\d{3})/g, '$1$2') // "4.500" → "4500"
  const max = t.match(/(?:menos de|hasta|maximo|max|por debajo de|no mas de)\s*\$?\s*(\d+)/)
  const min = t.match(/(?:mas de|desde|arriba de|minimo)\s*\$?\s*(\d+)/)
  return { max: max ? Number(max[1]) : null, min: min ? Number(min[1]) : null }
}

// Lee la pregunta y arma los filtros: categoría, terminación, precio, colección y palabras sueltas
export function readProductQuery(text, collections = []) {
  const list = words(text)
  let category = null
  let finish = null
  let cheap = false
  const rest = []
  for (const word of list) {
    const root = stem(word)
    if (CATEGORY_WORDS[word] || CATEGORY_WORDS[root]) category = CATEGORY_WORDS[word] ?? CATEGORY_WORDS[root]
    else if (FINISH_WORDS[word] || FINISH_WORDS[root]) finish = FINISH_WORDS[word] ?? FINISH_WORDS[root]
    else if (CHEAP_WORDS.has(word)) cheap = true
    else if (!STOPWORDS.has(word) && !STOPWORDS.has(root) && !SYNONYMS[word] && !SYNONYMS[root] && !/^\d+$/.test(word) && word.length > 2)
      rest.push(root)
  }
  const price = readPrice(text)
  if (cheap && price.max === null) price.max = CHEAP_LIMIT
  const normalized = normalize(text)
  const collection = collections.find((c) => normalized.includes(normalize(c.name))) ?? null
  // Las palabras del nombre de la colección ya son un filtro: no las buscamos en los nombres
  const collectionWords = collection ? words(collection.name).map(stem) : []
  return { category, finish, price, collection, rest: rest.filter((w) => !collectionWords.includes(w)) }
}

// ¿La pregunta habla de productos? (menciona una categoría, terminación, precio o colección)
export const isProductQuery = (q) => Boolean(q.category || q.finish || q.collection || q.price.max || q.price.min)

// Filtra el catálogo con lo que se entendió. Si hay palabras sueltas ("luna", "corazon"),
// primero van los productos cuyo nombre las contiene.
// Los agotados van al final (se muestran, pero primero lo que se puede comprar)
const availableFirst = (list) => [...list].sort((a, b) => Number(isOutOfStock(a)) - Number(isOutOfStock(b)))

export function findProducts(products, q) {
  return availableFirst(matchProducts(products, q))
}

function matchProducts(products, q) {
  // Sin filtros ni palabras de producto no hay nada que buscar (no devolvemos todo el catálogo)
  if (!isProductQuery(q) && q.rest.length === 0) return []
  const filtered = products.filter(
    (p) =>
      (!q.category || p.category === q.category) &&
      (!q.finish || getFinish(p) === q.finish) &&
      (!q.collection || p.collections.includes(q.collection.id)) &&
      (q.price.max === null || p.price <= q.price.max) &&
      (q.price.min === null || p.price >= q.price.min),
  )
  if (q.rest.length === 0) return filtered
  const hits = (p) => q.rest.filter((w) => normalize(p.name).includes(w)).length
  const withHits = filtered.filter((p) => hits(p) > 0).sort((a, b) => hits(b) - hits(a))
  // Si ninguna palabra coincide con un nombre, las palabras no eran de producto: usamos solo los filtros
  return withHits.length > 0 ? withHits : isProductQuery(q) ? filtered : []
}

// Palabras de la pregunta que no se entendieron ("hacen aros a medida" → "medida"):
// no son filtros ni aparecen en ningún nombre de producto.
export const unknownWords = (products, q) => q.rest.filter((w) => !products.some((p) => normalize(p.name).includes(w)))
