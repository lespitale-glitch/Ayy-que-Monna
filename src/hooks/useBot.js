import { useEffect, useMemo, useRef, useState } from 'react'
import { useFaqs } from './useFaqs.js'
import { useProducts } from './useProducts.js'
import { useSettings } from './useSettings.js'
import { logUnansweredQuestion } from '../services/faqsService.js'
import { buildFaqIndex } from '../utils/bot/faqMatcher.js'
import { buildExtraVocabulary, getBotReply } from '../utils/bot/botReply.js'
import * as msg from '../utils/bot/botMessages.js'

const MAX_LOGGED_PER_VISIT = 5 // tope de preguntas guardadas por visita (evita llenar la tabla)
let loggedThisVisit = 0

// Conversación del asistente: lista de mensajes, enviar texto y tocar opciones (chips)
export function useBot() {
  const { products, collections } = useProducts()
  const settings = useSettings()
  const { status, faqs } = useFaqs()
  const [messages, setMessages] = useState([])
  const nextId = useRef(1)

  // useMemo: el índice de búsqueda se arma una sola vez por cada lista de preguntas
  const faqIndex = useMemo(() => buildFaqIndex(faqs), [faqs])
  const extraVocabulary = useMemo(() => buildExtraVocabulary(products), [products])

  // Los ids se generan ANTES de setMessages: React puede ejecutar dos veces la función
  // que actualiza el estado (modo estricto) y no queremos saltear números.
  const push = (...items) => {
    const withIds = items.map((item) => ({ ...item, id: nextId.current++ }))
    setMessages((prev) => [...prev, ...withIds])
  }

  // Mensaje de bienvenida cuando llegan las preguntas frecuentes
  useEffect(() => {
    if (status !== 'loading' && nextId.current === 1) push(msg.welcomeMessage(faqs))
  }, [status, faqs])

  const logQuestion = (text) => {
    const question = msg.sanitizeQuestion(text)
    if (question.length < 2 || loggedThisVisit >= MAX_LOGGED_PER_VISIT) return
    loggedThisVisit++
    // Si falla no molestamos a la persona: solo queda registrado en la consola
    logUnansweredQuestion(question).catch((error) => console.warn('No se guardó la pregunta:', error))
  }

  const send = (text) => {
    const question = text.trim()
    if (!question) return
    const reply = getBotReply(question, { faqIndex, extraVocabulary, products, collections })
    if (reply.unanswered) logQuestion(question)
    push({ from: 'user', text: question }, ...msg.replyToMessages(reply, { faqs, settings, question }))
  }

  // Lo que pasa al tocar una opción. El texto de la opción se muestra como si lo hubiera escrito la persona.
  const choose = ({ label, action }) => {
    const user = { from: 'user', text: label }
    if (action.type === 'faq') {
      const faq = faqs.find((f) => f.id === action.id)
      if (faq) push(user, msg.faqMessage(faq, settings))
    } else if (action.type === 'gift') {
      push(user, msg.giftCategoryMessage())
    } else if (action.type === 'gift-category') {
      push(user, msg.giftBudgetMessage(action.value))
    } else if (action.type === 'gift-budget') {
      push(user, msg.giftResultsMessage(products, action.category, action.value))
    } else if (action.type === 'search-help') {
      push(user, { from: 'bot', text: 'Contame qué buscás. Por ejemplo: "aros dorados", "collares de menos de 5000" o "algo de la colección Marina".' })
    } else if (action.type === 'human') {
      push(user, { from: 'bot', text: 'Escribinos por WhatsApp y te responde una persona del equipo.', whatsappUrl: msg.whatsappFor(settings) })
    }
  }

  return { isReady: status !== 'loading', messages, send, choose }
}
