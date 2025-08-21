/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        /* Secondary */
        "secondary-soft-green": "hsl(var(--secondary-soft-green))",
        "secondary-light-green": "hsl(var(--secondary-light-green))",
        "secondary-soft-orange": "hsl(var(--secondary-soft-orange))",
        "secondary-light-orange": "hsl(var(--secondary-light-orange))",
        "secondary-soft-red": "hsl(var(--secondary-soft-red))",
        "secondary-light-red": "hsl(var(--secondary-light-red))",

        /* Feel */
        "feel-tired-text": "hsl(var(--feel-tired-text))",
        "feel-soso-text": "hsl(var(--feel-soso-text))",
        "feel-free-text": "hsl(var(--feel-free-text))",
        "feel-back-default": "hsl(var(--feel-back-default))",
        "feel-back-tired": "hsl(var(--feel-back-tired))",
        "feel-back-soso": "hsl(var(--feel-back-soso))",
        "feel-back-free": "hsl(var(--feel-back-free))",

        /* Gray scale */
        gray: {
          900: "hsl(var(--gray-900))",
          800: "hsl(var(--gray-800))",
          700: "hsl(var(--gray-700))",
          600: "hsl(var(--gray-600))",
          500: "hsl(var(--gray-500))",
          400: "hsl(var(--gray-400))",
          300: "hsl(var(--gray-300))",
          200: "hsl(var(--gray-200))",
          100: "hsl(var(--gray-100))",
          50: "hsl(var(--gray-50))",
        },
      },

      /* Typography */
      fontSize: {
        heading24: ["var(--heading-24)", { lineHeight: "140%" }],
        heading22: ["var(--heading-22)", { lineHeight: "140%" }],
        heading20: ["var(--heading-20)", { lineHeight: "140%" }],
        body18: ["var(--body-18)", { lineHeight: "150%" }],
        body17: ["var(--body-17)", { lineHeight: "140%" }],
        body15: ["var(--body-15)", { lineHeight: "150%" }],
        paragraph18: ["var(--paragraph-18)", { lineHeight: "150%" }],
        paragraph16: ["var(--paragraph-16)", { lineHeight: "150%" }],
        paragraph15: ["var(--paragraph-15)", { lineHeight: "150%" }],
        paragraph14: ["var(--paragraph-14)", { lineHeight: "150%" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
