import { Link } from 'react-router-dom'
import { CATEGORIES, INSTAGRAM_URL } from '../../config.js'

function Footer() {
  // Calculamos el año actual para no tener que actualizarlo a mano cada enero
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-light">
            Ayy Que <span className="italic">Monna</span>
          </p>
          <p className="mt-3 text-sm text-stone">Bijouterie para todos los días.</p>
        </div>

        <nav aria-label="Categorías">
          <h2 className="font-sans text-xs uppercase tracking-widest text-stone">Tienda</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/tienda/${c.slug}`} className="hover:text-gold">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-widest text-stone">Seguinos</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm hover:text-gold"
          >
            Instagram @ayyquemonna
          </a>
        </div>
      </div>

      <p className="border-t border-line py-6 text-center text-xs uppercase tracking-widest text-stone">
        © {year} Ayy Que Monna
      </p>
    </footer>
  )
}

export default Footer
