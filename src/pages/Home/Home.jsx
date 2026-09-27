import HeroSlider from '../../components/home/hero/HeroSlider.jsx'
import FeaturedSection from '../../components/home/FeaturedSection.jsx'
import NewArrivalsSection from '../../components/home/NewArrivalsSection.jsx'
import MarinaSection from '../../components/home/MarinaSection.jsx'
import TrustSection from '../../components/home/TrustSection.jsx'

// La Home solo ordena las secciones; cada una vive en su propio componente.
function Home() {
  return (
    <>
      {/* Título principal de la página para lectores de pantalla y buscadores */}
      <h1 className="sr-only">Ayy Que Monna — bijouterie en acero quirúrgico</h1>
      <HeroSlider />
      <FeaturedSection />
      <NewArrivalsSection />
      <MarinaSection />
      <TrustSection />
    </>
  )
}

export default Home
