// Reglas del formulario de pregunta frecuente: las mismas que la tabla faqs de schema.sql
export const QUESTION_MAX = 200
export const ANSWER_MAX = 1000
export const KEYWORDS_MAX = 30
export const KEYWORD_LENGTH_MAX = 60

export const EMPTY_FAQ = { question: '', answer: '', keywords: '', isVisible: true }

// Las palabras clave se editan como texto: una por línea o separadas por comas
export const keywordsToText = (keywords) => keywords.join(', ')

export function parseKeywords(text) {
  const list = text
    .split(/[,\n]/)
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set(list)] // new Set quita las repetidas
}

export function valuesFromFaq(faq) {
  return { question: faq.question, answer: faq.answer, keywords: keywordsToText(faq.keywords), isVisible: faq.isVisible }
}

export function validateFaq(values) {
  const errors = {}
  const question = values.question.trim()
  const answer = values.answer.trim()
  const keywords = parseKeywords(values.keywords)

  if (question.length < 3) errors.question = 'Escribe la pregunta (al menos 3 caracteres).'
  else if (question.length > QUESTION_MAX) errors.question = `Máximo ${QUESTION_MAX} caracteres.`

  if (!answer) errors.answer = 'Escribe la respuesta.'
  else if (answer.length > ANSWER_MAX) errors.answer = `Máximo ${ANSWER_MAX} caracteres.`

  if (keywords.length > KEYWORDS_MAX) errors.keywords = `Máximo ${KEYWORDS_MAX} palabras clave.`
  else if (keywords.some((k) => k.length > KEYWORD_LENGTH_MAX))
    errors.keywords = `Cada palabra clave puede tener hasta ${KEYWORD_LENGTH_MAX} caracteres.`

  return errors
}

export function toFaq(values) {
  return {
    question: values.question.trim(),
    answer: values.answer.trim(),
    keywords: parseKeywords(values.keywords),
    isVisible: values.isVisible,
  }
}

export const isFaqDirty = (initial, current) => JSON.stringify(toFaq(initial)) !== JSON.stringify(toFaq(current))
