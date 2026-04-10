import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        pixel: ['"Press Start 2P"', "cursive"],
      },
      colors: {
        'neon-pink': '#ff006e',
        'neon-blue': '#00e5ff',
        'neon-purple': '#7F2FFF',
        'neon-green': '#00ff88',
        'neon-orange': '#FF6B2B',
        'neon-magenta': '#D4537E',
        'dark-bg': '#0a0a0f',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin 12s linear infinite reverse',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'marquee': 'marquee-scroll 25s linear infinite',
        'glitch': 'glitch 2s infinite',
        'fadein-up': 'fadeInUp 0.8s ease forwards',
        'eq-bounce': 'eqBounce 1s ease-in-out infinite alternate',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 5px 30px rgba(37,211,102,0.4)' },
          '50%': { boxShadow: '0 5px 60px rgba(37,211,102,0.8)' },
        },
        'marquee-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        glitch: {
          '0%, 100%': { textShadow: '2px 0 #ff006e, -2px 0 #00e5ff' },
          '25%': { textShadow: '-2px 0 #ff006e, 2px 0 #00e5ff' },
          '50%': { textShadow: '2px 2px #ff006e, -2px -2px #00e5ff' },
          '75%': { textShadow: '-2px 2px #ff006e, 2px -2px #00e5ff' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        eqBounce: {
          '0%': { height: '5px' },
          '100%': { height: '40px' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(127,47,255,0.3)' },
          '50%': { borderColor: 'rgba(0,229,255,0.6)' },
        },
      },
      backgroundImage: {
        'gradient-dj': 'linear-gradient(135deg, #ff006e, #7F2FFF, #00e5ff)',
        'gradient-green': 'linear-gradient(135deg, #00ff88, #00e5ff)',
        'gradient-fire': 'linear-gradient(135deg, #ff006e, #FF6B2B)',
        'gradient-magic': 'linear-gradient(135deg, #7F2FFF, #D4537E)',
      },
    },
  },
  plugins: [],
};

export default config;
