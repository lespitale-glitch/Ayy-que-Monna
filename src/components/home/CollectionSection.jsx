import { Link } from 'react-router-dom'
import SectionHeading from './SectionHeading.jsx'
import ProductCarousel from './ProductCarousel.jsx'
import Reveal from '../Reveal.jsx'
import { useProducts } from '../../hooks/useProducts.js'
import { getTheme } from '../../utils/collections.js'

// Bloque de una colección en la Home (antes era fijo para Marina; ahora sirve para
// cualquier colección marcada "en el inicio" desde el panel). Los colores salen de su tema.
function CollectionSection({ collection }) {
  const products = useProducts().getCollectionProducts(collection.id)
  const theme = getTheme(collection.theme)

  return (
    <section className={theme.section}>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <SectionHeading eyebrow="Colección" title={<span className={theme.title}>{collection.name}</span>} align="center">
            <span className={`mx-auto mt-6 block h-1 w-16 rounded-full ${theme.swatch}`} aria-hidden="true" />
            {collection.description && (
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-stone">{collection.description}</p>
            )}
          </SectionHeading>
        </Reveal>
        <div className="mt-12 md:mt-4">
          <ProductCarousel products={products} label={`Colección ${collection.name}`} />
        </div>
        <div className="mt-10 text-center">
          <Link to={`/seleccion/${collection.id}`} className="btn-outline">
            Ver toda la colección
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CollectionSection
