import { Link } from 'react-router-dom'
import heroImage from '../../assets/banner8.jpg'

// Al importar una imagen, Vite nos da su URL final (con nombre optimizado para caché).
function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl md:grid-cols-12 md:items-center md:gap-12 md:px-6 md:py-12">
      <div className="md:order-2 md:col-span-7">
        {/* Imagen principal: sin lazy y con prioridad alta porque es lo primero que se ve */}
        <img
          src={heroImage}
          alt="Collar con dije de flor esmaltada puesto"
          fetchPriority="high"
          className="aspect-[4/5] w-full object-cover md:aspect-[4/3]"
        />
      </div>

      <div className="px-6 py-14 text-center md:order-1 md:col-span-5 md:px-0 md:text-left">
        <p className="text-xs uppercase tracking-widest text-stone">Bijouterie en acero quirúrgico</p>
        <h1 className="mt-6 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
          Pequeños brillos para <span className="italic">todos los días</span>
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-gold md:mx-0" aria-hidden="true" />
        <Link
          to="/tienda"
          className="mt-10 inline-block bg-ink px-10 py-4 text-xs uppercase tracking-widest text-bone transition-colors duration-300 ease-soft hover:bg-ink/85"
        >
          Explorar tienda
        </Link>
      </div>
    </section>
  )
}

export default Hero
