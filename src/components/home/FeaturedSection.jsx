import { Link } from 'react-router-dom'
import SectionHeading from './SectionHeading.jsx'
import Reveal from '../Reveal.jsx'
import ProductCarousel from './ProductCarousel.jsx'
import { useProducts } from '../../hooks/useProducts.js'

function FeaturedSection() {
  const featured = useProducts().getFeaturedProducts()
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-0">
        <SectionHeading eyebrow="Selección Monna" title="Destacados" />
        <Link to="/tienda" className="shrink-0 border-b border-ink pb-1 text-xs uppercase tracking-widest md:hidden">
          Ver todo
        </Link>
      </Reveal>
      <ProductCarousel products={featured} label="Productos destacados" />
    </section>
  )
}

export default FeaturedSection
