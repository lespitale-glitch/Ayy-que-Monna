import { useCallback, useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Lógica de un carrusel: diapositiva actual, anterior/siguiente y avance automático.
// El avance automático se detiene si:
//  - la persona lo pausa con el botón (isPaused),
//  - el mouse está encima o el foco está adentro (isInteracting),
//  - el sistema pide "reducir movimiento" (entonces arranca pausado).
export function useSlider(total, { interval = 6000 } = {}) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(prefersReducedMotion)
  const [isInteracting, setIsInteracting] = useState(false)

  // El operador % hace que después de la última vuelva a la primera (y al revés)
  const goTo = useCallback((i) => setIndex(((i % total) + total) % total), [total])
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  const isPlaying = !isPaused && !isInteracting && total > 1

  useEffect(() => {
    if (!isPlaying) return
    // setInterval ejecuta next() cada "interval" milisegundos; lo limpiamos al pausar
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [isPlaying, next, interval])

  return {
    index,
    goTo,
    next,
    prev,
    isPaused,
    isPlaying,
    togglePause: () => setIsPaused((p) => !p),
    setIsInteracting,
  }
}
