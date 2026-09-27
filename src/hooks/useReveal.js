import { useEffect, useRef, useState } from 'react'

// Devuelve una ref para poner en un elemento y "isVisible", que pasa a true
// la primera vez que el elemento entra en pantalla.
// IntersectionObserver es una API del navegador que avisa cuando algo aparece en el viewport,
// sin tener que escuchar el scroll a mano (que es más costoso).
export function useReveal() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    // Navegadores muy viejos sin IntersectionObserver: mostramos todo directamente
    if (!element || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // Solo animamos una vez
        }
      },
      { rootMargin: '0px 0px -10% 0px' }, // Empieza un poco antes del borde inferior
    )
    observer.observe(element)

    // Al desmontar el componente dejamos de observar
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}
