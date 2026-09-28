import { useAdminSortableList } from './useAdminSortableList.js'
import {
  deleteCollection,
  fetchAdminCollections,
  reorderCollections,
  updateCollection,
} from '../services/collectionsService.js'
import { fetchAdminProducts } from '../services/productsService.js'

// Carga las colecciones y cuenta cuántos productos tiene cada una
async function load() {
  const [items, products] = await Promise.all([fetchAdminCollections(), fetchAdminProducts()])
  const counts = {}
  for (const product of products) {
    for (const id of product.collections) counts[id] = (counts[id] ?? 0) + 1
  }
  return { items, extra: counts }
}

// Definido afuera del componente: el objeto es siempre el mismo y "load" no cambia entre renders
const API = {
  load,
  update: updateCollection,
  reorder: reorderCollections,
  remove: deleteCollection,
  label: (collection) => collection.name,
}

// Lista de colecciones del panel (ver useAdminSortableList)
export function useAdminCollections() {
  const list = useAdminSortableList(API)
  return {
    ...list,
    collections: list.items,
    counts: list.extra ?? {},
    remove: (collection) => list.remove(collection, `Se eliminó la colección ${collection.name}.`),
  }
}
