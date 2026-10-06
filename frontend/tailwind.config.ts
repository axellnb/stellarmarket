import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#0b0f14', panel: '#111720', line: '#1e2733', brand: '#3ee6a0', sky: '#7dc4ff', muted: '#8693a4' },
    fontFamily: {
      sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
    }
  } },
  plugins: []
};
export default config;
