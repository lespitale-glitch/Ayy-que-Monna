import { useState } from 'react'
import { toTitleCase } from '../../utils/text.js'

// Galería del detalle: foto grande + miniaturas (solo si hay más de una foto).
function ProductGallery({ images, name }) {
  // Guardamos el índice (posición en el array) de la foto que se está viendo
  const [selected, setSelected] = useState(0)
  const hasThumbnails = images.length > 1
  const altName = toTitleCase(name)

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {hasThumbnails && (
        <ul className="flex gap-3 md:w-20 md:flex-col" aria-label="Fotos del producto">
          {images.map((src, index) => (
            <li key={src} className="w-20">
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Ver foto ${index + 1} de ${images.length}`}
                aria-pressed={selected === index}
                className={`block aspect-product w-full overflow-hidden bg-white transition-opacity duration-300 ease-soft ${
                  selected === index ? 'ring-1 ring-ink' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="aspect-product flex-1 overflow-hidden bg-white">
        {/* Sin loading="lazy": es la imagen principal y queremos que cargue enseguida */}
        <img
          key={images[selected]}
          src={images[selected]}
          alt={hasThumbnails ? `${altName}, foto ${selected + 1}` : altName}
          className="h-full w-full animate-fade-in object-cover"
        />
      </div>
    </div>
  )
}

export default ProductGallery
