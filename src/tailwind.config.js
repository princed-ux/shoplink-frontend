/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // REMOVE: darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22c55e',
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      animation: {
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'bounce-subtle': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  // Force-generate dark: variants for brand colors
  // because Tailwind sometimes can't detect them in dynamic class strings
  safelist: [
    {
      pattern: /^(bg|text|border|ring|shadow|fill|stroke)-brand-(50|100|200|300|400|500|600|700|800|900)$/,
      variants: ['dark', 'hover', 'dark:hover', 'focus', 'dark:focus', 'group-hover'],
    },
    {
      pattern: /^(bg|border)-brand-(50|100|200|300|400|500|600|700|800|900)\/(10|20|25|30|40|50|60|70|80|90)$/,
      variants: ['dark', 'hover', 'dark:hover'],
    },
    {
      pattern: /^shadow-brand-(500|600)(\/\d+)?$/,
    },
  ],
  plugins: [],
}