import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../ProductCard.jsx'

// Carrusel horizontal: en el teléfono se desliza con el dedo; en escritorio,
// además, con las flechas. "snap" hace que cada tarjeta quede alineada al soltar.
function ProductCarousel({ products, label }) {
  // useRef guarda una referencia al elemento del DOM para poder moverlo desde JS
  const listRef = useRef(null)

  const scroll = (direction) => {
    const list = listRef.current
    list.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: 'smooth' })
  }

  const arrowClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white transition-colors duration-300 ease-soft hover:border-fucsia'

  return (
    <div>
      <div className="mb-6 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => scroll(-1)} aria-label={`${label}: anteriores`} className={arrowClass}>
          <ChevronLeft size={18} strokeWidth={1.25} />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={`${label}: siguientes`} className={arrowClass}>
          <ChevronRight size={18} strokeWidth={1.25} />
        </button>
      </div>

      <ul
        ref={listRef}
        aria-label={label}
        className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 md:gap-8"
      >
        {products.map((product) => (
          <li key={product.id} className="w-[46%] shrink-0 snap-start md:w-[30%] lg:w-[23%]">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductCarousel
