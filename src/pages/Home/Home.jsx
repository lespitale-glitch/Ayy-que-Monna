import Hero from '../../components/home/Hero.jsx'
import FeaturedSection from '../../components/home/FeaturedSection.jsx'
import NewArrivalsSection from '../../components/home/NewArrivalsSection.jsx'
import MarinaSection from '../../components/home/MarinaSection.jsx'
import TrustSection from '../../components/home/TrustSection.jsx'

// La Home solo ordena las secciones; cada una vive en su propio componente.
function Home() {
  return (
    <>
      <Hero />
      <FeaturedSection />
      <NewArrivalsSection />
      <MarinaSection />
      <TrustSection />
    </>
  )
}

export default Home
