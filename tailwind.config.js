/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Refined professional navy palette
        primary: {
          50: '#f0f4fa',
          100: '#dde6f3',
          200: '#bccfe7',
          300: '#8eaad4',
          400: '#5e82bd',
          500: '#3d62a5',
          600: '#2e4d8a',
          700: '#263f70',
          800: '#1f3257',
          900: '#152340',
          950: '#0c162b',
        },
        // Brown accent ramp anchored on #603813 (replaces the old gold/amber ramp).
        // 300-500 are the brand color itself; 50-200 stay light tints for use as
        // backgrounds/borders, 600-700 are darker steps for hover states.
        // Brown accent ramp built out from #603813 (replaces the old gold/amber
        // ramp). 700 is the base color; the lighter steps carry the same hue so
        // they stay legible on the dark navy sections.
        accent: {
          50: '#f9f4ee',
          100: '#efe1d0',
          200: '#dcc0a0',
          300: '#c98a4a',
          400: '#b06f2c',
          500: '#92591f',
          600: '#74461a',
          700: '#603813',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        'card': '0 1px 3px 0 rgb(15 23 42 / 0.05), 0 4px 14px -2px rgb(15 23 42 / 0.06)',
        'elevated': '0 4px 6px -2px rgb(15 23 42 / 0.05), 0 12px 28px -6px rgb(15 23 42 / 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'float': 'float 7s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        // The track renders the logo list twice, so shifting by half its
        // width lands exactly on the start of the second copy — a seamless loop.
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
