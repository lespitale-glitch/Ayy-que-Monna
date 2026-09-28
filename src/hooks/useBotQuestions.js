import { useEffect, useState } from 'react'
import { deleteBotQuestion, fetchBotQuestions, setBotQuestionResolved } from '../services/faqsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'

// Preguntas que el asistente no supo responder: marcar como resueltas o borrar
export function useBotQuestions() {
  const [status, setStatus] = useState('loading')
  const [questions, setQuestions] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchBotQuestions()
      .then((list) => {
        if (ignore) return
        setQuestions(list)
        setStatus('ready')
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setStatus('error')
      })
    return () => {
      ignore = true
    }
  }, [])

  // Ejecuta una acción sobre una pregunta y muestra el resultado
  const run = async (question, action, successText) => {
    setBusyId(question.id)
    setFeedback(null)
    try {
      await action()
      setFeedback({ type: 'success', text: successText })
    } catch (error) {
      console.error(error)
      setFeedback({ type: 'error', text: getAdminErrorMessage(error) })
    } finally {
      setBusyId(null)
    }
  }

  const setResolved = (question, isResolved) =>
    run(
      question,
      async () => {
        const saved = await setBotQuestionResolved(question.id, isResolved)
        setQuestions((prev) => prev.map((q) => (q.id === saved.id ? saved : q)))
      },
      isResolved ? 'Pregunta marcada como resuelta.' : 'La pregunta volvió a pendientes.',
    )

  const remove = (question) =>
    run(
      question,
      async () => {
        await deleteBotQuestion(question.id)
        setQuestions((prev) => prev.filter((q) => q.id !== question.id))
      },
      'Pregunta eliminada.',
    )

  return { status, questions, busyId, feedback, setResolved, remove }
}
