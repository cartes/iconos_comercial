/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#0e2458",
          600: "#00674F",
          700: "#004738",
        },
        secondary: {
          500: "#68e4c7",
        },
        success: {
          500: "#10b981",
        },
        error: {
          500: "#ef4444",
        },
        warning: {
          500: "#f59e0b",
        },
        info: {
          500: "#3b82f6",
        },
        violet: {
          50: "#f2fcf9",
          100: "#d0f9ec",
          200: "#a1f2db",
          300: "#68e4c7",
          400: "#3ebb9e",
          500: "#219e83",
          600: "#177f6b",
          700: "#146657",
          800: "#125146",
          900: "#11433b",
          950: "#082824",
        },
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #0e2458 0%, #68e4c7 100%)",
        "grad-premium": "linear-gradient(135deg, #219e83 0%, #a1f2db 100%)",
        "grad-dark": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      },
    },
  },
  plugins: [],
};
