/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EB',
        'cream-deep': '#EFE8DC',
        espresso: '#382C2A',
        'espresso-70': '#6B5A56',
        'espresso-40': '#A99B96',
        terracotta: '#E27D60',
        clay: '#C96A4E',
        sand: '#E8DCC8',
        risk: {
          moss: '#6E8B5E',
          ochre: '#C9A227',
          'burnt-orange': '#D97742',
          'deep-rust': '#A63A28',
          oxblood: '#7B2D26'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'xs': ['13px', { lineHeight: '1.55' }],
        'sm': ['15px', { lineHeight: '1.55' }],
        'base': ['17px', { lineHeight: '1.55' }],
        'lg': ['20px', { lineHeight: '1.55' }],
        'xl': ['26px', { lineHeight: '1.15' }],
        '2xl': ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '3xl': ['52px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '4xl': ['72px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'soft': '4px',
      }
    },
  },
  plugins: [],
}
