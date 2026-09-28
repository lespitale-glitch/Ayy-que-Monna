import { useMemo, useRef } from 'react'
import HeroSlide from './HeroSlide.jsx'
import SliderControls from './SliderControls.jsx'
import { buildHeroSlides } from '../../../utils/heroSlides.js'
import { useProducts } from '../../../hooks/useProducts.js'
import { useSettings } from '../../../hooks/useSettings.js'
import { useSlider } from '../../../hooks/useSlider.js'

const SWIPE_THRESHOLD = 50 // px mínimos de deslizamiento para cambiar de diapositiva

// Carrusel principal de la Home (patrón de carrusel accesible de WAI-ARIA)
function HeroSlider() {
  // Diapositivas del panel (/admin/inicio) + las automáticas de Ajustes (retiro, Instagram)
  const { heroSlides } = useProducts()
  const { pickupPoints, instagramHandle } = useSettings()
  // useMemo: la lista se rearma solo si cambian los datos que la afectan
  const slides = useMemo(
    () => buildHeroSlides(heroSlides, { pickupPoints, instagramHandle }),
    [heroSlides, pickupPoints, instagramHandle],
  )
  const slider = useSlider(slides.length)
  const pointerStartX = useRef(null)

  // Deslizar con el dedo (o arrastrar con el mouse)
  const onPointerDown = (event) => {
    pointerStartX.current = event.clientX
  }
  const onPointerUp = (event) => {
    if (pointerStartX.current === null) return
    const distance = event.clientX - pointerStartX.current
    pointerStartX.current = null
    if (distance > SWIPE_THRESHOLD) slider.prev()
    if (distance < -SWIPE_THRESHOLD) slider.next()
  }

  // Sin diapositivas (todas ocultas y sin ajustes automáticos): no se muestra el carrusel
  if (slides.length === 0) return null

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Novedades y colecciones de Ayy Que Monna"
      className="mx-auto max-w-7xl md:px-6 md:pt-6"
      // Pausa mientras el mouse está encima o el foco del teclado está adentro
      onMouseEnter={() => slider.setIsInteracting(true)}
      onMouseLeave={() => slider.setIsInteracting(false)}
      onFocus={() => slider.setIsInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) slider.setIsInteracting(false)
      }}
    >
      <div
        // Con avance automático no anunciamos cada cambio; pausado, sí
        aria-live={slider.isPlaying ? 'off' : 'polite'}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointerStartX.current = null)}
        className="grid touch-pan-y select-none overflow-hidden md:rounded-3xl lg:aspect-[16/7]"
      >
        {slides.map((slide, i) => (
          <HeroSlide
            key={slide.id}
            slide={slide}
            isActive={i === slider.index}
            position={i + 1}
            total={slides.length}
            isFirst={i === 0}
          />
        ))}
      </div>

      <SliderControls
        total={slides.length}
        index={slider.index}
        onGoTo={slider.goTo}
        onPrev={slider.prev}
        onNext={slider.next}
        isPaused={slider.isPaused}
        onTogglePause={slider.togglePause}
      />
    </section>
  )
}

export default HeroSlider
