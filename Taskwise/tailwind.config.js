/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1ec9d2",
        "primary-dark": "#169ea5",
        "background-light": "#f6f8f8",
        "background-dark": "#112021",
        "surface-dark": "#1c2a2b",
        "surface-dark-hover": "#293738",
        "surface-border": "#293738",
        "text-secondary": "#9eb6b7",
        "accent-blue": "#3b82f6",
        "accent-purple": "#8b5cf6",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
    },
  },
  plugins: [],
}

