/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0F172A',
          800: '#16213A',
          700: '#1E293B',
          500: '#2563EB'
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626'
      },
      boxShadow: {
        soft: '0 12px 24px rgba(15, 23, 42, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
