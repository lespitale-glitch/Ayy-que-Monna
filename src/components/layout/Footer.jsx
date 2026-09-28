import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo.jsx'
import { CATEGORIES } from '../../config.js'
import { useSettings } from '../../hooks/useSettings.js'
import { instagramUrl } from '../../utils/settings.js'

function Footer() {
  // Calculamos el año actual para no tener que actualizarlo a mano cada enero
  const year = new Date().getFullYear()
  const { instagramHandle } = useSettings()

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div>
          <BrandLogo size="lg" />
          <p className="mt-3 text-sm text-stone">Bijouterie para todos los días.</p>
        </div>

        <nav aria-label="Categorías">
          <h2 className="font-sans text-xs uppercase tracking-widest text-stone">Tienda</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/tienda/${c.slug}`}
                  className="decoration-fucsia decoration-2 underline-offset-4 hover:underline"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ayuda">
          <h2 className="font-sans text-xs uppercase tracking-widest text-stone">Ayuda</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                to="/preguntas-frecuentes"
                className="decoration-fucsia decoration-2 underline-offset-4 hover:underline"
              >
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </nav>

        {/* Si no hay usuario de Instagram cargado en los ajustes, la columna no se muestra */}
        {instagramHandle && (
          <div>
            <h2 className="font-sans text-xs uppercase tracking-widest text-stone">Seguinos</h2>
            <a
              href={instagramUrl(instagramHandle)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm decoration-fucsia decoration-2 underline-offset-4 hover:underline"
            >
              Instagram @{instagramHandle}
            </a>
          </div>
        )}
      </div>

      <p className="border-t border-line py-6 text-center text-xs uppercase tracking-widest text-stone">
        © {year} Ayy Que Monna
      </p>
    </footer>
  )
}

export default Footer
