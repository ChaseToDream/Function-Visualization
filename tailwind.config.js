/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
      },
      colors: {
        'cyber': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0ca5eb',
          600: '#0084c9',
          700: '#0169a3',
          800: '#065986',
          900: '#0b4a6f',
          950: '#072f4a',
        },
        'neon': {
          'blue': '#00f0ff',
          'purple': '#b026ff',
          'pink': '#ff2d95',
          'green': '#39ff14',
          'yellow': '#fff01f',
          'orange': '#ff6b35',
        },
        'dark': {
          '900': '#0a0a0f',
          '800': '#12121a',
          '700': '#1a1a25',
          '600': '#222230',
          '500': '#2a2a3a',
        }
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 5px #b026ff, 0 0 20px rgba(176, 38, 255, 0.3)',
        'neon-pink': '0 0 5px #ff2d95, 0 0 20px rgba(255, 45, 149, 0.3)',
        'neon-green': '0 0 5px #39ff14, 0 0 20px rgba(57, 255, 20, 0.3)',
        'glow': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)',
        'glow-lg': '0 0 20px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.3)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a25 100%)',
        'neon-gradient': 'linear-gradient(90deg, #00f0ff, #b026ff, #ff2d95)',
      },
      backgroundSize: {
        'grid': '30px 30px',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)' },
          '100%': { boxShadow: '0 0 10px #00f0ff, 0 0 40px rgba(0, 240, 255, 0.5)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
