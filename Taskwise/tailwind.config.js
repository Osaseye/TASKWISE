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
        "primary-dark": "#179ea6",
        "primary-light": "#e0fbfd",
        "background-light": "#f6f8f8",
        "background-dark": "#112021",
        "surface-dark": "#1A2627",
        "surface-dark-lighter": "#233233",
        "surface-dark-hover": "#293738",
        "border-dark": "#293738",
        "text-secondary": "#94a3b8",
        "accent-blue": "#3b82f6",
        "accent-purple": "#8b5cf6",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "heading": ["Poppins", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
    },
  },
  plugins: [],
}

