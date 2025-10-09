/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: { max: '320px' },
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          pressed: 'var(--brand-primary-pressed)',
          sub: 'var(--brand-sub-green)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
          pressed: 'var(--secondary-pressed)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
        kakao: {
          DEFAULT: '#FEE500',
          pressed: '#e5cf00',
        },

        /* Secondary */
        'secondary-soft-green': 'var(--secondary-soft-green)',
        'secondary-light-green': 'var(--secondary-light-green)',
        'secondary-soft-orange': 'var(--secondary-soft-orange)',
        'secondary-light-orange': 'var(--secondary-light-orange)',
        'secondary-soft-red': 'var(--secondary-soft-red)',
        'secondary-light-red': 'var(--secondary-light-red)',

        /* Feel */
        'feel-tired-text': 'var(--feel-tired-text)',
        'feel-soso-text': 'var(--feel-soso-text)',
        'feel-free-text': 'var(--feel-free-text)',
        'feel-back-default': 'var(--feel-back-default)',
        'feel-back-tired': 'var(--feel-back-tired)',
        'feel-back-soso': 'var(--feel-back-soso)',
        'feel-back-free': 'var(--feel-back-free)',

        /* Gray scale */
        gray: {
          900: 'var(--gray-900)',
          800: 'var(--gray-800)',
          700: 'var(--gray-700)',
          600: 'var(--gray-600)',
          500: 'var(--gray-500)',
          400: 'var(--gray-400)',
          300: 'var(--gray-300)',
          200: 'var(--gray-200)',
          100: 'var(--gray-100)',
          50: 'var(--gray-50)',
        },
      },
      fontSize: {
        12: ['0.75rem', { lineHeight: '150%', fontWeight: '400' }], // text-12
        '12sb': ['0.75rem', { lineHeight: '150%', fontWeight: '600' }], // text-12sb
        13: ['0.8125rem', { lineHeight: '150%', fontWeight: '400' }], // text-13
        '13sb': ['0.8125rem', { lineHeight: '150%', fontWeight: '600' }], // text-13sb
        14: ['0.875rem', { lineHeight: '150%', fontWeight: '400' }], // text-14
        '14sb': ['0.875rem', { lineHeight: '150%', fontWeight: '600' }], // text-14sb
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
        28: ['1.75rem', { lineHeight: '100%', fontWeight: '700' }], // text-28
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
