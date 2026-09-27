import wordmark from '../../assets/brand/logo-monna.webp'

// Logotipo original de la marca (generado con `npm run brand:logo`).
// El alt dice el nombre completo de la tienda aunque el dibujo diga "monna".
function BrandLogo({ className = 'h-8' }) {
  return <img src={wordmark} alt="Ayy Que Monna" width="517" height="96" className={`w-auto ${className}`} />
}

export default BrandLogo
