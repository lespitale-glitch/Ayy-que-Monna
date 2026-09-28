import { useEffect, useState } from 'react'
import { fetchFaqs } from '../services/faqsService.js'

// La Promesa se guarda fuera del componente: el bot y la página de preguntas frecuentes
// comparten UNA sola descarga aunque se abran varias veces.
let request = null

export function useFaqs() {
  const [state, setState] = useState({ status: 'loading', faqs: [] })

  useEffect(() => {
    let ignore = false
    request ??= fetchFaqs() // ??= asigna solo si todavía es null
    request
      .then((faqs) => {
        if (!ignore) setState({ status: 'ready', faqs })
      })
      .catch((error) => {
        console.error('No se pudieron cargar las preguntas frecuentes:', error)
        request = null // la próxima vez se vuelve a intentar
        if (!ignore) setState({ status: 'error', faqs: [] })
      })
    return () => {
      ignore = true
    }
  }, [])

  return state
}
