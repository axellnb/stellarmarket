export interface Review { id: string; client: string; rating: number; comment: string; date: string }
export interface Freelancer {
  id: string; name: string; profession: string; category: string; description: string; tags: string[]; match?: number;
  priceXLM: number; priceType: 'fixed' | 'hour'; avatar: string; available: boolean;
  portfolioUrl: string; stellarWallet: string; reviews: Review[]; rating: number; reviewCount: number;
}
export interface PaymentResult {
  success: boolean; hash: string; from: string; to: string; amount: number; fee: number;
  ledger: number; network: string; timestamp: string; explorerUrl: string;
}
export const CATEGORIES = ['Diseño', 'Desarrollo', 'Marketing', 'Escritura', 'Video'];
export const priceLabel = (f: Pick<Freelancer, 'priceXLM' | 'priceType'>) => `${f.priceXLM} XLM${f.priceType === 'hour' ? ' / h' : ''}`;

export const INTERESTS = [
  { id: 'Logos', emoji: '🎨', from: '#3ee6a0', to: '#0b6b4a', h: 'h-40' },
  { id: 'Branding', emoji: '✨', from: '#a78bfa', to: '#4c1d95', h: 'h-32' },
  { id: 'UI/UX', emoji: '📱', from: '#38bdf8', to: '#075985', h: 'h-44' },
  { id: 'Ilustración', emoji: '🖌️', from: '#fb7185', to: '#881337', h: 'h-36' },
  { id: 'Web', emoji: '🌐', from: '#34d399', to: '#064e3b', h: 'h-32' },
  { id: 'Apps', emoji: '📲', from: '#60a5fa', to: '#1e3a8a', h: 'h-40' },
  { id: 'Blockchain', emoji: '⛓️', from: '#facc15', to: '#713f12', h: 'h-36' },
  { id: 'SEO', emoji: '🔎', from: '#4ade80', to: '#14532d', h: 'h-44' },
  { id: 'Copywriting', emoji: '✍️', from: '#f472b6', to: '#831843', h: 'h-32' },
  { id: 'Redes sociales', emoji: '💬', from: '#22d3ee', to: '#164e63', h: 'h-40' },
  { id: 'Publicidad', emoji: '📣', from: '#fb923c', to: '#7c2d12', h: 'h-36' },
  { id: 'Edición de video', emoji: '🎬', from: '#c084fc', to: '#581c87', h: 'h-44' },
  { id: 'Motion graphics', emoji: '🌀', from: '#2dd4bf', to: '#134e4a', h: 'h-32' }
];
