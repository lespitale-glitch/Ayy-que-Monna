// Colores de cada tema de colección. Las clases van escritas completas (no armadas con
// variables) porque Tailwind solo genera las clases que encuentra tal cual en el código.
// Regla de contraste: el texto siempre usa las versiones "deep" (pasan AA).
export const COLLECTION_THEMES = {
  brand: {
    label: 'Marca (naranja y fucsia)',
    swatch: 'bg-brand',
    section: 'bg-fucsia/5',
    title: 'text-gradient',
    tag: 'border-fucsia text-fucsia-deep',
  },
  marina: {
    label: 'Marina (turquesa)',
    swatch: 'bg-marina',
    section: 'bg-marina/10',
    title: 'text-marina-deep',
    tag: 'border-marina text-marina-deep',
  },
}

export const getTheme = (theme) => COLLECTION_THEMES[theme] ?? COLLECTION_THEMES.brand

export const isInCollection = (product, collectionId) => product.collections.includes(collectionId)

// Colecciones de un producto, en el orden de la lista de colecciones.
// Los ids que no están en la lista (colecciones ocultas o borradas) se ignoran.
export function getProductCollections(product, collections) {
  return collections.filter((collection) => isInCollection(product, collection.id))
}
