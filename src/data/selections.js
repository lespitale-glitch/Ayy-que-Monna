import { getFinish } from '../utils/search.js'
import { isInCollection } from '../utils/collections.js'

// "Selecciones especiales": agrupaciones de productos que no son categorías.
// Se usan en el mega-menú "Colecciones" y en la página /seleccion/:slug.
// "select" decide si un producto pertenece a la selección.

// Selecciones automáticas (siempre están). Sus slugs están reservados en schema.sql:
// ninguna colección puede llamarse igual.
const AUTO_SELECTIONS = [
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

export const RESERVED_SLUGS = AUTO_SELECTIONS.map((s) => s.slug)

// Primero las colecciones que arma la administradora (en su orden), después las automáticas
export function buildSelections(collections) {
  const fromCollections = collections.map((collection) => ({
    slug: collection.id,
    label: collection.name,
    description: collection.description,
    theme: collection.theme,
    isCollection: true,
    select: (p) => isInCollection(p, collection.id),
  }))
  return [...fromCollections, ...AUTO_SELECTIONS.map((s) => ({ ...s, theme: 'brand', isCollection: false }))]
}

export function findSelection(selections, slug) {
  return selections.find((selection) => selection.slug === slug)
}

export function getSelectionProducts(products, selection) {
  return selection ? products.filter(selection.select) : []
}
