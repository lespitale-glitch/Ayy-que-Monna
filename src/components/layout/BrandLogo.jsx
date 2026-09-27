import wordmark from '../../assets/brand/logo-monna.webp'

// Tamaños del logo según dónde se usa (imagen y texto "ayy que" proporcionales)
const SIZES = {
  sm: { image: 'h-6', text: 'text-[11px]' }, // panel de administración
  md: { image: 'h-7 md:h-8', text: 'text-xs md:text-[13px]' }, // Header de la tienda
  lg: { image: 'h-10', text: 'text-base' }, // Footer y login
}

// Logo de la marca: "ayy que" arriba y "Monna" abajo, donde la "M" es el símbolo original
// (imagen generada con `npm run brand:logo`). "ayy que" es texto real: se ve nítido en
// cualquier tamaño y usa el mismo degradado del logo (los logotipos no tienen exigencia de contraste).
function BrandLogo({ size = 'md' }) {
  const { image, text } = SIZES[size]

  return (
    <span className="inline-flex flex-col items-start leading-none">
      {/* aria-hidden: el nombre completo ya lo dice el alt de la imagen */}
      <span
        aria-hidden="true"
        className={`bg-brand bg-clip-text pl-[0.15em] font-display font-bold lowercase tracking-wide text-transparent ${text}`}
      >
        ayy que
      </span>
      <img src={wordmark} alt="Ayy Que Monna" width="439" height="96" className={`-mt-0.5 w-auto ${image}`} />
    </span>
  )
}

export default BrandLogo
