import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0A0B',
          surface: '#16161A',
        },
        ink: {
          DEFAULT: '#F5F5F5',
          muted: '#A0A0A8',
        },
        accent: {
          DEFAULT: '#C4F135',
        },
      },
      fontFamily: {
        display: ['"Wild Display"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Wild Body"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config
