/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        secondary: {
          500: '#ec4899',
        },
        success: {
          500: '#10b981',
        },
        error: {
          500: '#ef4444',
        },
        warning: {
          500: '#f59e0b',
        },
        info: {
          500: '#3b82f6',
        },
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        'grad-premium': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'grad-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
};
