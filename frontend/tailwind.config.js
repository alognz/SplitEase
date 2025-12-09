/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5A8A88",
        accent: "#D4AF7F",
        background: "#FCFCFC",
        textPrimary: "#1C1C1C",
        textSecondary: "#555555",
        success: "#6BBF59",
        warning: "#E9A23B",
        error: "#E35656",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

