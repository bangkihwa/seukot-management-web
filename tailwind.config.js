/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        copper: {
          50: '#fdf8f0',
          100: '#faecd0',
          200: '#f5d6a0',
          300: '#edbc6e',
          400: '#e4a23e',
          500: '#d49243',
          600: '#b8762e',
          700: '#945c24',
          800: '#7a4a1f',
          900: '#663d1c',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-landing': 'radial-gradient(ellipse at 20% 50%, rgba(13,148,136,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(20,184,166,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(212,146,67,0.08) 0%, transparent 50%)',
        'gradient-admin': 'linear-gradient(135deg, #042f2e 0%, #115e59 50%, #0f766e 100%)',
        'gradient-student': 'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #14b8a6 100%)',
        'gradient-page': 'linear-gradient(180deg, #f8fafc 0%, #f0fdfa 50%, #f0fdfa 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(4, 47, 46, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 16px 48px rgba(4, 47, 46, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'card': '0 1px 3px rgba(4, 47, 46, 0.06), 0 4px 12px rgba(4, 47, 46, 0.04)',
        'card-hover': '0 4px 12px rgba(4, 47, 46, 0.1), 0 8px 24px rgba(4, 47, 46, 0.06)',
        'copper-glow': '0 4px 24px rgba(212, 146, 67, 0.25)',
        'nav': '0 1px 3px rgba(4, 47, 46, 0.05), 0 0 0 1px rgba(4, 47, 46, 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
