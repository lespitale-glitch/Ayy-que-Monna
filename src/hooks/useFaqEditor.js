import { useEffect, useState } from 'react'
import { createFaq, fetchAdminFaqs, setBotQuestionResolved, updateFaq } from '../services/faqsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { toFaq } from '../utils/faqForm.js'

// Carga y guarda una pregunta frecuente. id === undefined → pregunta nueva.
// fromQuestionId: si se creó desde "Sin responder", esa pregunta se marca como resuelta al guardar.
export function useFaqEditor(id, fromQuestionId) {
  const isNew = id === undefined
  // status: 'loading' | 'ready' | 'notfound' | 'error'
  const [load, setLoad] = useState({ status: isNew ? 'ready' : 'loading', faq: null })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (isNew) return
    let ignore = false
    fetchAdminFaqs()
      .then((faqs) => {
        const faq = faqs.find((f) => f.id === id) ?? null
        if (!ignore) setLoad({ status: faq ? 'ready' : 'notfound', faq })
      })
      .catch((error) => {
        if (ignore) return // ya se salió de la página: no es un error real
        console.error(error)
        setLoad({ status: 'error', faq: null })
      })
    return () => {
      ignore = true
    }
  }, [id, isNew])

  // Devuelve la pregunta guardada, o null si falló (el mensaje queda en saveError)
  const save = async (values) => {
    setSaveError(null)
    setIsSaving(true)
    try {
      const faq = toFaq(values)
      const saved = isNew ? await createFaq(faq) : await updateFaq(id, faq)
      // Marcar la pregunta original como resuelta es un extra: si falla, no deshacemos lo guardado
      if (fromQuestionId) await setBotQuestionResolved(fromQuestionId, true).catch((error) => console.warn(error))
      return saved
    } catch (error) {
      console.error(error)
      setSaveError(getAdminErrorMessage(error))
      setIsSaving(false)
      return null
    }
  }

  return { isNew, ...load, isSaving, saveError, save }
}
