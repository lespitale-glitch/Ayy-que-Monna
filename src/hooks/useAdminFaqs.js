import { useAdminSortableList } from './useAdminSortableList.js'
import { deleteFaq, fetchAdminFaqs, fetchBotQuestions, reorderFaqs, updateFaq } from '../services/faqsService.js'

// Preguntas frecuentes + cuántas preguntas sin responder hay pendientes
async function load() {
  const [items, questions] = await Promise.all([fetchAdminFaqs(), fetchBotQuestions()])
  return { items, extra: { pending: questions.filter((q) => !q.isResolved).length } }
}

const API = { load, update: updateFaq, reorder: reorderFaqs, remove: deleteFaq, label: (faq) => `"${faq.question}"` }

export function useAdminFaqs() {
  const list = useAdminSortableList(API)
  return {
    ...list,
    faqs: list.items,
    pending: list.extra?.pending ?? 0,
    remove: (faq) => list.remove(faq, 'Se eliminó la pregunta.'),
  }
}
