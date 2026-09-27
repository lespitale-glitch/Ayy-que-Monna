// Los 4 interruptores rápidos del panel. "get" lee el estado actual del producto y
// "toChanges" arma los cambios a guardar. Marina no es un booleano en la base:
// es collection = 'marina' o null.
export const PRODUCT_TOGGLES = [
  {
    key: 'visible',
    label: 'Visible',
    get: (p) => p.isVisible,
    toChanges: (value) => ({ isVisible: value }),
    describe: (value) => (value ? 'ahora está visible en la tienda' : 'ahora está oculto'),
  },
  {
    key: 'featured',
    label: 'Destacado',
    get: (p) => p.isFeatured,
    toChanges: (value) => ({ isFeatured: value }),
    describe: (value) => (value ? 'se agregó a Destacados' : 'se quitó de Destacados'),
  },
  {
    key: 'new',
    label: 'Nuevo',
    get: (p) => p.isNew,
    toChanges: (value) => ({ isNew: value }),
    describe: (value) => (value ? 'se marcó como Nuevo' : 'ya no está marcado como Nuevo'),
  },
  {
    key: 'marina',
    label: 'Marina',
    get: (p) => p.collection === 'marina',
    toChanges: (value) => ({ collection: value ? 'marina' : null }),
    describe: (value) => (value ? 'se agregó a la Colección Marina' : 'se quitó de la Colección Marina'),
  },
]
