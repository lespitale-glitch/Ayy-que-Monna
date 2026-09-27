import { Link } from 'react-router-dom'

// Home provisoria: la versión completa (hero, destacados, Colección Marina) llega en el Paso 5.
function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-widest text-stone">Bijouterie</p>
      <h1 className="mt-6 text-5xl md:text-7xl">
        Ayy Que <span className="italic">Monna</span>
      </h1>
      <span className="mt-8 h-px w-16 bg-gold" aria-hidden="true" />
      <Link
        to="/tienda"
        className="mt-10 border border-ink px-8 py-3 text-xs uppercase tracking-widest transition-colors duration-300 ease-soft hover:bg-ink hover:text-bone"
      >
        Ver la tienda
      </Link>
    </section>
  )
}

export default Home
