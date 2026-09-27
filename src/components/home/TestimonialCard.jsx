import { Link } from 'react-router-dom'
import { Quote } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts.js'

// Tarjeta de un testimonio: comentario, nombre y (si hay) el producto que compró
function TestimonialCard({ testimonial }) {
  const { getProductById } = useProducts()
  const { name, text, location, productId, source } = testimonial
  const product = productId ? getProductById(productId) : null

  return (
    <figure className="flex h-full flex-col rounded-3xl bg-white p-8">
      <Quote size={28} strokeWidth={1.5} className="text-fucsia" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed">{text}</blockquote>
      <figcaption className="mt-6 border-t border-line pt-4 text-sm">
        <span className="font-medium">{name}</span>
        {location && <span className="text-stone"> · {location}</span>}
        {(product || source) && (
          <span className="mt-1 block text-xs text-stone">
            {product && (
              <>
                Compró{' '}
                <Link to={`/producto/${product.id}`} className="underline decoration-fucsia underline-offset-4">
                  {product.name}
                </Link>
              </>
            )}
            {product && source && ' · '}
            {source && `vía ${source}`}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

export default TestimonialCard
