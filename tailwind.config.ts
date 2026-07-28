import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#F7F0D8',
          surface: '#EFE4C4',
        },
        ink: {
          DEFAULT: '#23201A',
          muted: '#55503D',
        },
        accent: {
          DEFAULT: '#B7D82A',
          deep: '#5C6913',
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
