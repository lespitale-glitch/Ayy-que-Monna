// Diapositivas del Hero Slider. Las fotos son los banners originales de la marca,
// optimizados con `npm run brand:hero` (design/hero → src/assets/hero).

// import.meta.glob (de Vite) importa todos los archivos que coinciden con el patrón.
// Devuelve un objeto { ruta: url }, que convertimos a { 'banner8-lg': url, ... }.
const files = import.meta.glob('../assets/hero/*.webp', { eager: true, import: 'default' })
const images = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url]))

// Para cada foto: versión grande, chica y el "srcSet" para que el navegador elija
const photo = (name) => ({
  src: images[`${name}-lg`],
  srcSet: `${images[`${name}-sm`]} 800w, ${images[`${name}-lg`]} 1600w`,
})

export const HERO_SLIDES = [
  {
    id: 'inicio',
    image: photo('banner8'),
    alt: 'Collar con dije de flor esmaltada puesto',
    eyebrow: 'Bijouterie en acero quirúrgico',
    title: 'Pequeños brillos para',
    highlight: 'todos los días',
    cta: { label: 'Explorar tienda', to: '/tienda' },
  },
  {
    id: 'novedades',
    image: photo('nuevo'),
    alt: 'Collar con dije de flor sobre fondo naranja',
    eyebrow: 'Recién llegados',
    title: 'Lo nuevo de',
    highlight: 'Monna',
    cta: { label: 'Ver novedades', to: '/seleccion/novedades' },
  },
  {
    id: 'collares',
    image: photo('banner4'),
    alt: '',
    eyebrow: 'Collares',
    title: 'Dijes que',
    highlight: 'cuentan algo',
    cta: { label: 'Ver collares', to: '/tienda/collares' },
  },
  {
    id: 'aros',
    image: photo('banner3'),
    alt: '',
    eyebrow: 'Aros',
    title: 'Un toque de',
    highlight: 'color',
    cta: { label: 'Ver aros', to: '/tienda/aros' },
  },
  {
    id: 'anillos',
    image: photo('banner2'),
    alt: '',
    eyebrow: 'Anillos',
    title: 'Para combinar',
    highlight: 'a tu manera',
    cta: { label: 'Ver anillos', to: '/tienda/anillos' },
  },
  {
    id: 'pulseras',
    image: photo('banner5'),
    alt: '',
    eyebrow: 'Pulseras',
    title: 'Mezclá, sumá,',
    highlight: 'repetí',
    cta: { label: 'Ver pulseras', to: '/tienda/pulseras' },
  },
  {
    id: 'destacados',
    image: photo('banner'),
    alt: '',
    eyebrow: 'Selección Monna',
    title: 'Nuestros',
    highlight: 'favoritos',
    cta: { label: 'Ver destacados', to: '/seleccion/destacados' },
  },
  {
    id: 'retiro',
    image: photo('banner7'),
    alt: '',
    eyebrow: 'Envíos y retiro',
    title: 'Retiro gratis en',
    highlight: 'Ballester, Carapachay y Belgrano',
    cta: { label: 'Elegí tu favorito', to: '/tienda' },
  },
  {
    id: 'instagram',
    image: photo('banner6'),
    alt: '',
    eyebrow: '@ayyquemonna',
    title: 'Ayy, qué',
    highlight: 'monna',
    cta: { label: 'Seguinos en Instagram', href: 'https://www.instagram.com/ayyquemonna' },
  },
]
