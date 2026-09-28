import HeroSlider from '../../components/home/hero/HeroSlider.jsx'
import FeaturedSection from '../../components/home/FeaturedSection.jsx'
import NewArrivalsSection from '../../components/home/NewArrivalsSection.jsx'
import CollectionSection from '../../components/home/CollectionSection.jsx'
import TrustSection from '../../components/home/TrustSection.jsx'
import Testimonials from '../../components/home/Testimonials.jsx'
import { useProducts } from '../../hooks/useProducts.js'

// La Home solo ordena las secciones; cada una vive en su propio componente.
function Home() {
  const { homeCollections } = useProducts()
  return (
    <>
      {/* Título principal de la página para lectores de pantalla y buscadores */}
      <h1 className="sr-only">Ayy Que Monna — bijouterie en acero quirúrgico</h1>
      <HeroSlider />
      <FeaturedSection />
      <NewArrivalsSection />
      {/* Una sección por cada colección marcada "en el inicio" en el panel */}
      {homeCollections.map((collection) => (
        <CollectionSection key={collection.id} collection={collection} />
      ))}
      <TrustSection />
      {/* Justo antes del Footer. Oculta hasta cargar reseñas reales en data/testimonials.js */}
      <Testimonials />
    </>
  )
}

export default Home
