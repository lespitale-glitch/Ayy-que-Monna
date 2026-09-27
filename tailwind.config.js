/** @type {import('tailwindcss').Config} */
// Tokens de diseño de Ayy Que Monna (estética minimalista estilo Gortari Studio).
// Todos los colores y fuentes de la marca se definen aquí: no usar hex sueltos en los componentes.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#FAF8F5', // fondo principal
        ink: '#1A1A1A', // texto principal
        stone: '#8A8580', // texto secundario / precios
        line: '#E8E4DF', // bordes finos
        gold: '#B89B72', // acento cálido, solo para detalles
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      aspectRatio: {
        product: '4 / 5',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
