/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          page: 'rgb(var(--color-page) / <alpha-value>)',
          soft: 'rgb(var(--color-soft) / <alpha-value>)',
          deep: 'rgb(var(--color-deep) / <alpha-value>)',
          line: 'rgb(var(--color-line) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
          ink: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-muted) / <alpha-value>)',
          contrast: 'rgb(var(--color-contrast) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
