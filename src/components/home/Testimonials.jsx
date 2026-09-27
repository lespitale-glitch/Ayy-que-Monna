import Reveal from '../Reveal.jsx'
import SectionHeading from './SectionHeading.jsx'
import TestimonialCard from './TestimonialCard.jsx'
import { TESTIMONIALS } from '../../data/testimonials.js'

// "Lo que dicen de nosotros". Se oculta sola si todavía no hay testimonios reales.
// "items" se puede pasar desde afuera (útil para probar); por defecto usa el archivo de datos.
function Testimonials({ items = TESTIMONIALS }) {
  if (items.length === 0) return null

  return (
    <section className="bg-brand-soft">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <SectionHeading eyebrow="Testimonios" title="Lo que dicen de nosotros" align="center" />
        </Reveal>
        {/* En celular se desliza de costado; desde tablet, grilla de 3 columnas */}
        <ul className="scrollbar-none -mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {items.map((testimonial) => (
            <li key={testimonial.id} className="w-[85%] shrink-0 snap-start md:w-auto">
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Testimonials
