import { Link } from 'react-router-dom'

// Logotipo tipográfico: solo texto en serif, sin imagen.
function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`font-serif text-2xl font-light tracking-wide text-ink md:text-3xl ${className}`}
    >
      Ayy Que <span className="italic">Monna</span>
    </Link>
  )
}

export default Logo
