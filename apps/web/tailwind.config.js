/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          pressed: 'hsl(var(--brand-primary-pressed))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          pressed: 'hsl(var(--secondary-pressed))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },

        /* Secondary */
        'secondary-soft-green': 'hsl(var(--secondary-soft-green))',
        'secondary-light-green': 'hsl(var(--secondary-light-green))',
        'secondary-soft-orange': 'hsl(var(--secondary-soft-orange))',
        'secondary-light-orange': 'hsl(var(--secondary-light-orange))',
        'secondary-soft-red': 'hsl(var(--secondary-soft-red))',
        'secondary-light-red': 'hsl(var(--secondary-light-red))',

        /* Feel */
        'feel-tired-text': 'hsl(var(--feel-tired-text))',
        'feel-soso-text': 'hsl(var(--feel-soso-text))',
        'feel-free-text': 'hsl(var(--feel-free-text))',
        'feel-back-default': 'hsl(var(--feel-back-default))',
        'feel-back-tired': 'hsl(var(--feel-back-tired))',
        'feel-back-soso': 'hsl(var(--feel-back-soso))',
        'feel-back-free': 'hsl(var(--feel-back-free))',

        /* Gray scale */
        gray: {
          900: 'hsl(var(--gray-900))',
          800: 'hsl(var(--gray-800))',
          700: 'hsl(var(--gray-700))',
          600: 'hsl(var(--gray-600))',
          500: 'hsl(var(--gray-500))',
          400: 'hsl(var(--gray-400))',
          300: 'hsl(var(--gray-300))',
          200: 'hsl(var(--gray-200))',
          100: 'hsl(var(--gray-100))',
          50: 'hsl(var(--gray-50))',
        },
      },
      fontSize: {
        14: ['0.875rem', { lineHeight: '150%', fontWeight: '600' }], // text-14
        '14sb': ['0.875rem', { lineHeight: '150%', fontWeight: '400' }], // text-14sb
        '14b': ['0.875rem', { lineHeight: '150%', fontWeight: '700' }], // text-14b
        15: ['0.9375rem', { lineHeight: '150%' }], // text-15
        '15sb': ['0.9375rem', { lineHeight: '150%', fontWeight: '600' }], // text-15sb
        16: ['1rem', { lineHeight: '150%' }], // text-16
        '16sb': ['1rem', { lineHeight: '150%', fontWeight: '600' }], // text-16sb
        17: ['1.0625rem', { lineHeight: '140%' }], // text-17
        '17sb': ['1.0625rem', { lineHeight: '140%', fontWeight: '600' }], // text-17sb
        18: ['1.125rem', { lineHeight: '150%' }], // text-18
        '18sb': ['1.125rem', { lineHeight: '150%', fontWeight: '600' }], // text-18sb
        20: ['1.25rem', { lineHeight: '140%', fontWeight: '700' }], // text-20
        22: ['1.375rem', { lineHeight: '140%', fontWeight: '600' }], // text-22
        24: ['1.5rem', { lineHeight: '140%', fontWeight: '600' }], // text-24
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
