import logo from '../../assets/brand/logo.webp'

// Alto del logo según dónde se usa (el ancho se ajusta solo, manteniendo la proporción)
const SIZES = {
  sm: 'h-9', // panel de administración
  md: 'h-11 md:h-12', // Header de la tienda
  lg: 'h-16', // Footer y login
}

// Logo completo de la marca: "ayy que" arriba y "Monna" abajo (la "M" es el símbolo).
// Es la imagen original sin el fondo crema, generada con `npm run brand:logo` desde design/logo-completo.png.
// width y height evitan que la página "salte" mientras la imagen carga.
function BrandLogo({ size = 'md' }) {
  return <img src={logo} alt="Ayy Que Monna" width="431" height="144" className={`w-auto ${SIZES[size]}`} />
}

export default BrandLogo
