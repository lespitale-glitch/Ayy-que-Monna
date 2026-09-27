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
        stone: '#716C67', // texto secundario / precios (contraste AA 4.9:1 sobre bone)
        line: '#E8E4DF', // bordes finos
        gold: '#B89B72', // acento cálido: solo bordes y líneas, NUNCA texto (contraste 2.5:1)
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
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
