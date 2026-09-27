import { getFinish } from '../utils/search.js'

// "Selecciones especiales": agrupaciones de productos que no son categorías.
// Se usan en el mega-menú "Colecciones" y en la página /seleccion/:slug.
// "select" decide si un producto pertenece a la selección.
export const SELECTIONS = [
  {
    slug: 'marina',
    label: 'Colección Marina',
    description: 'Perlas, conchas y destellos turquesa para llevar el océano con vos.',
    select: (p) => p.collection === 'marina',
  },
  {
    slug: 'novedades',
    label: 'Novedades',
    description: 'Las últimas piezas que sumamos a la tienda.',
    select: (p) => p.isNew,
  },
  {
    slug: 'destacados',
    label: 'Destacados',
    description: 'Nuestros favoritos de siempre.',
    select: (p) => p.isFeatured,
  },
  {
    slug: 'dorados',
    label: 'Dorados',
    description: 'Todas las piezas en terminación dorada.',
    select: (p) => getFinish(p) === 'dorado',
  },
  {
    slug: 'plateados',
    label: 'Plateados',
    description: 'Todas las piezas en terminación plateada.',
    select: (p) => getFinish(p) === 'plateado',
  },
]

export function getSelection(slug) {
  return SELECTIONS.find((selection) => selection.slug === slug)
}

export function getSelectionProducts(products, slug) {
  const selection = getSelection(slug)
  return selection ? products.filter(selection.select) : []
}
