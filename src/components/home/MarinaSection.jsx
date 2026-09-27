import SectionHeading from './SectionHeading.jsx'
import ProductCarousel from './ProductCarousel.jsx'
import Reveal from '../Reveal.jsx'
import { getCollectionProducts } from '../../utils/products.js'

const marina = getCollectionProducts('marina')

// Bloque temático con fondo blanco para diferenciarse del resto de la Home.
// El texto es el original de la sección Marina del sitio anterior.
function MarinaSection() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <SectionHeading eyebrow="Colección" title={<span className="italic">Marina</span>} align="center">
            <span className="mx-auto mt-6 block h-px w-16 bg-gold" aria-hidden="true" />
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-stone">
              Perlas, conchas y destellos turquesa para llevar el océano con vos.
            </p>
          </SectionHeading>
        </Reveal>
        <div className="mt-12 md:mt-4">
          <ProductCarousel products={marina} label="Colección Marina" />
        </div>
      </div>
    </section>
  )
}

export default MarinaSection
