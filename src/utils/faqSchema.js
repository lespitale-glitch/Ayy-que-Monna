import { fillAnswer } from './faqText.js'

// Datos estructurados FAQPage (schema.org): así Google entiende que la página tiene
// preguntas y respuestas, y puede mostrarlas directamente en los resultados de búsqueda.
export function buildFaqSchema(faqs, settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: fillAnswer(faq.answer, settings) },
    })),
  }
}

// JSON dentro de <script>: escapamos "<" para que un texto como "</script>" no pueda cerrar la etiqueta
export const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c')
