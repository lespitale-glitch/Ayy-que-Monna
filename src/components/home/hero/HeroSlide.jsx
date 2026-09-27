import { Link } from 'react-router-dom'

// Una diapositiva. En celular: foto arriba y texto debajo (así el texto no tapa la joya).
// En pantallas grandes (lg): la foto ocupa todo y el texto va en un panel claro encima
// (el contraste del texto nunca depende de la foto).
// Las inactivas quedan invisibles e "inert": no se pueden enfocar ni las lee el lector de pantalla.
function HeroSlide({ slide, isActive, position, total, isFirst }) {
  const { image, alt, eyebrow, title, highlight, cta } = slide
  const ctaClass = 'btn-primary mt-6 md:mt-8'

  return (
    <div
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${position} de ${total}`}
      inert={!isActive}
      // Todas las diapositivas ocupan la misma celda de la grilla (una encima de otra)
      className={`col-start-1 row-start-1 flex flex-col lg:relative lg:block motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-soft ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes="(min-width: 1280px) 1232px, 100vw"
        alt={alt}
        // Los banners de estampados son decorativos: alt vacío + aria-hidden (regla de CLAUDE.md)
        aria-hidden={alt ? undefined : true}
        // La primera foto es lo primero que se ve: se carga con prioridad; las demás, cuando haga falta
        fetchPriority={isFirst ? 'high' : 'auto'}
        loading={isFirst ? 'eager' : 'lazy'}
        decoding="async"
        // Sin esto, arrastrar con el mouse "levanta" la imagen y cancela el deslizamiento
        draggable={false}
        className="aspect-[4/3] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
      />

      <div className="flex-1 bg-bone px-6 py-6 md:px-10 lg:absolute lg:bottom-10 lg:left-10 lg:max-w-md lg:flex-none lg:rounded-3xl lg:bg-bone/95 lg:p-10 lg:backdrop-blur">
        <p className="text-xs font-medium uppercase tracking-widest text-fucsia-deep">{eyebrow}</p>
        <h2 className="mt-3 text-3xl leading-tight md:text-5xl">
          {title} <span className="text-gradient">{highlight}</span>
        </h2>
        {cta.to ? (
          <Link to={cta.to} className={ctaClass}>
            {cta.label}
          </Link>
        ) : (
          <a href={cta.href} target="_blank" rel="noreferrer" className={ctaClass}>
            {cta.label}
          </a>
        )}
      </div>
    </div>
  )
}

export default HeroSlide
