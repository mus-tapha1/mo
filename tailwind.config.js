/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: '#0a0a0a',
          50: '#1a1a1a',
          100: '#222222',
          200: '#2a2a2a',
          300: '#333333',
        },
        or: {
          DEFAULT: '#c9a14a',
          clair: '#e6c87a',
          fonce: '#a67c30',
          pale: '#f0e0b0',
        },
        creme: '#f5efe0',
        ivoire: '#faf7f0',
      },
      fontFamily: {
        arabe: ['"Tajawal"', '"Cairo"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
        latin: ['"Jost"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a14a 0%, #e6c87a 50%, #a67c30 100%)',
        'gold-text': 'linear-gradient(135deg, #e6c87a 0%, #c9a14a 40%, #f0e0b0 60%, #a67c30 100%)',
        'noir-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.7s ease-out',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
