/** @type {import('tailwindcss').Config} */
// Colours mirror CatalystOne "UI Lift" design tokens (design-tokens.css)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand purple — primary CatalystOne brand colour
        brand: {
          25:  '#fbfafc',
          50:  '#f7f4fb',
          100: '#eae3f2',
          200: '#d4c7e5',
          300: '#bfacd8',
          400: '#a990cb',
          500: '#9474be',
          600: '#765d98',
          700: '#594672',
          800: '#3b2e4c',
          900: '#1e1726',
        },
        // Warm beige — page & content backgrounds
        beige: {
          50:  '#ffffff',
          100: '#fefdfd',
          200: '#fdfbfa',
          300: '#fcfaf8',
          400: '#fbf8f5',
          500: '#faf6f3',  // default page bg
          600: '#f2ece8',  // content area bg
          700: '#c8c5c2',
        },
        // Warm gray — body text
        warm: {
          100: '#f9f8f7',
          200: '#f3f1f0',
          300: '#eceae8',
          400: '#e6e3e1',
          500: '#e0dcd9',  // border default
          600: '#b3b0ae',
          700: '#868482',
          800: '#5a5857',
          900: '#2d2c2b',  // body text
        },
        // Semantic — success (green)
        success: {
          DEFAULT: '#198754',
          50:  '#f6f9f6',
          100: '#edf3ec',
          200: '#dae7d9',
          500: '#a3c3a1',
          600: '#829c81',
          800: '#414e40',
        },
        // Semantic — warning (orange)
        warning: {
          DEFAULT: '#ff8d4b',
          50:  '#fff5f0',
          100: '#ffe8db',
          200: '#ffd1b7',
          600: '#cc713c',
          800: '#66381e',
        },
        // Semantic — danger/error (bright red)
        danger: {
          DEFAULT: '#e42354',
          50:  '#fcf5f7',
          100: '#fad3dd',
          200: '#f4a7bb',
          600: '#b61c43',
          700: '#891532',
          800: '#5b0e22',
        },
        // Teal — HCM module accent
        teal: {
          50:  '#eff6f7',
          100: '#e0eef0',
          200: '#c1dde1',
          400: '#83bbc3',
          500: '#64aab4',
          600: '#508890',
          700: '#3c666c',
        },
        // Blue — secondary / learning accent
        cobalt: {
          50:  '#f4f4fb',
          100: '#dee0f6',
          200: '#bdc1ed',
          400: '#7b82da',
          500: '#5a63d1',
          600: '#484fa7',
          700: '#363b7d',
        },
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        'co-sm':  '4px',
        'co':     '8px',
        'co-md':  '12px',
        'co-lg':  '16px',
        'co-xl':  '20px',
        'co-2xl': '24px',
      },
      boxShadow: {
        // CatalystOne elevation scale
        'e1': '0 1px 2px rgba(0,0,0,.10)',
        'e2': '0 2px 4px rgba(0,0,0,.12)',
        'e3': '0 4px 8px rgba(0,0,0,.14)',
        'e4': '0 8px 16px rgba(0,0,0,.16)',
        'e5': '0 12px 24px rgba(0,0,0,.18)',
        // legacy alias kept for existing usages
        soft: '0 8px 24px rgba(59,46,76,.12)',
      },
    },
  },
  plugins: [],
};
