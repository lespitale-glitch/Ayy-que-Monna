import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo.jsx'

// Logo del Header: lleva al inicio
function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} aria-label="Ayy Que Monna, ir al inicio" className="inline-flex">
      <BrandLogo size="md" />
    </Link>
  )
}

export default Logo
