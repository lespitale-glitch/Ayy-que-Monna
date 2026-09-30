/** @type {import('tailwindcss').Config} */
// Tokens de diseño de Ayy Que Monna. Todos los colores y fuentes de la marca se
// definen aquí: no usar hex sueltos en los componentes.
// Contraste medido sobre `bone`: mango/fucsia/marina NO pasan AA como texto → solo decorativos.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#FFF8F3', // fondo crema cálido (el del logo original)
        ink: '#1A1A1A', // texto principal (16.5:1)
        stone: '#716C67', // texto secundario / precios (4.9:1)
        line: '#F2E3DA', // bordes finos
        // Colores del logo. DEFAULT = decorativo; deep = texto y botones con texto blanco (AA)
        // Los "deep" son los colores de marca editables desde /admin/ajustes (variables CSS de
        // utils/theme.js; los valores de siempre están en index.css). El panel exige contraste AA.
        mango: { DEFAULT: '#FD8927', deep: 'var(--brand-from)' }, // logo: #C2410C, 4.9:1
        fucsia: { DEFAULT: '#F27084', deep: 'var(--brand-to)' }, // logo: #BE185D, 5.7:1
        marina: { DEFAULT: '#2BB5C3', deep: '#0E7490' }, // Colección Marina; deep: 5.1:1
      },
      backgroundImage: {
        brand: 'linear-gradient(90deg, #FD8927, #F27084)', // decorativo (el degradado del logo)
        'brand-deep': 'linear-gradient(90deg, var(--brand-from), var(--brand-to))', // con texto blanco encima
        'brand-soft': 'linear-gradient(135deg, #FFF1E6, #FFE8EC)', // fondos de sección suaves
      },
      fontFamily: {
        display: ['"Comfortaa Variable"', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['"Geist Variable"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      aspectRatio: {
        product: '4 / 5',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 400ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
