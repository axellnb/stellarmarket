import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1B1B39',          // Navy Blue (Brand Primary Base)
        darkGray: '#202020',    // Dark Gray (Brand Primary Container)
        navy: '#1B1B39',        // Navy Blue
        brand: '#3965FA',       // Purposium Blue (Brand Primary Accent)
        softBlue: '#99B7FC',    // Soft Blue
        paleBlue: '#E9EBFF',    // Pale Blue
        baseWhite: '#FFFFFF',   // Base White
        lightGray: '#EDEDED',   // Light Gray
        panel: 'rgba(32, 32, 32, 0.75)',
        line: 'rgba(233, 235, 255, 0.12)',
        muted: '#99B7FC',
        
        // Secondary Palette (Functional):
        secTeal: '#215452',
        secGreen: '#8CC63E',
        secLime: '#E0FFB7',
        secGold: '#FFD16B',
        secPeach: '#FFF2D6',
        secCoral: '#FF6D47',
        secMaroon: '#6F3432'
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        display: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        liquid: '0 8px 32px 0 rgba(27, 27, 57, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        liquidHover: '0 12px 40px 0 rgba(57, 101, 250, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        glow: '0 0 25px -5px rgba(57, 101, 250, 0.4)'
      }
    }
  },
  plugins: []
};

export default config;
