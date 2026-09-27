import { useRef } from 'react'
import HeroSlide from './HeroSlide.jsx'
import SliderControls from './SliderControls.jsx'
import { HERO_SLIDES } from '../../../data/heroSlides.js'
import { useSlider } from '../../../hooks/useSlider.js'

const SWIPE_THRESHOLD = 50 // px mínimos de deslizamiento para cambiar de diapositiva

// Carrusel principal de la Home (patrón de carrusel accesible de WAI-ARIA)
function HeroSlider() {
  const slider = useSlider(HERO_SLIDES.length)
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
        {HERO_SLIDES.map((slide, i) => (
          <HeroSlide
            key={slide.id}
            slide={slide}
            isActive={i === slider.index}
            position={i + 1}
            total={HERO_SLIDES.length}
            isFirst={i === 0}
          />
        ))}
      </div>

      <SliderControls
        total={HERO_SLIDES.length}
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
