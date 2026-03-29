import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /** Design system Stitch — Lodgemarket (gîtes) */
      colors: {
        estate: {
          primary: '#061b0e',
          'on-primary': '#ffffff',
          'primary-container': '#1b3022',
          'on-primary-container': '#819986',
          surface: '#faf9f6',
          background: '#faf9f6',
          'on-surface': '#1a1c1a',
          'on-surface-variant': '#434843',
          'surface-container': '#efeeeb',
          'surface-container-low': '#f4f3f1',
          'surface-container-lowest': '#ffffff',
          'surface-container-high': '#e9e8e5',
          'surface-container-highest': '#e3e2e0',
          outline: '#737973',
          'outline-variant': '#c3c8c1',
          secondary: '#6d5b4c',
          'on-secondary': '#ffffff',
          'secondary-container': '#f4dbc9',
          'on-secondary-container': '#715f50',
          'secondary-fixed': '#f6decb',
          'on-tertiary-container': '#cb8341',
          'inverse-surface': '#2f312f',
          'inverse-on-surface': '#f2f1ee',
          error: '#ba1a1a',
          'tertiary-fixed': '#ffdcc2',
        },
        // Palette shell app (héritage) : charbon / brique / orange / crème
        primary: {
          DEFAULT: '#C2410C', // Orange brûlé principal
          dark: '#9A3412',
          light: '#EA580C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#C2410C',
          600: '#9A3412',
          700: '#7C2D12',
        },
        brique: {
          DEFAULT: '#B91C1C', // Brique
          light: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          700: '#991B1B',
        },
        charbon: {
          DEFAULT: '#1F2937', // Charbon
          light: '#374151',
          dark: '#111827',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        creme: {
          DEFAULT: '#FEF3C7', // Crème
          light: '#FDE68A',
          50: '#FFFBEB',
          100: '#FEF3C7',
        },
        gray: {
          text: '#111827',
          secondary: '#6B7280',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
        },
      },
      backgroundImage: {
        'gradient-broques': 'linear-gradient(to bottom, #FFFBEB, #FFF7ED)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        estate: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        'estate-serif': ['var(--font-noto-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        warm: '0 4px 12px 0 rgba(194, 65, 12, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        medium: '0 6px 16px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.06)',
        large: '0 12px 24px 0 rgba(0, 0, 0, 0.12), 0 4px 8px 0 rgba(0, 0, 0, 0.08)',
        /** Stitch ambient card shadow */
        estate:
          '0 12px 40px 0 rgba(26, 28, 26, 0.04)',
        'estate-hover':
          '0 12px 40px 0 rgba(26, 28, 26, 0.08)',
      },
      borderRadius: {
        'soft': '12px',
        'softer': '16px',
      },
    },
  },
  plugins: [],
}
export default config

