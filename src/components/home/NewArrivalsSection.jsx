import { Link } from 'react-router-dom'
import SectionHeading from './SectionHeading.jsx'
import ProductCard from '../ProductCard.jsx'
import Reveal from '../Reveal.jsx'
import editorialImage from '../../assets/nuevo.jpg'
import { getNewArrivals } from '../../utils/products.js'

const newArrivals = getNewArrivals(4)

// Bloque editorial: una foto grande a un lado y cuatro novedades al otro.
function NewArrivalsSection() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:gap-16">
        <Reveal className="md:col-span-5">
          <SectionHeading eyebrow="Recién llegados" title="Novedades">
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone">
              Las últimas piezas que sumamos a la tienda.
            </p>
          </SectionHeading>
          <img
            src={editorialImage}
            alt="Collar con dije de flor sobre fondo naranja"
            loading="lazy"
            className="mt-10 aspect-product w-full object-cover"
          />
        </Reveal>

        <div className="md:col-span-7 md:pt-24">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8">
            {newArrivals.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <Link
            to="/tienda"
            className="mt-12 inline-block border border-ink px-8 py-3 text-xs uppercase tracking-widest transition-colors duration-300 ease-soft hover:bg-ink hover:text-bone"
          >
            Ver toda la tienda
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NewArrivalsSection
