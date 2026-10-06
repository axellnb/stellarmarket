import { MOCK_FREELANCERS, MOCK_PROJECTS } from './mockData';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const token = () => { try { return JSON.parse(localStorage.getItem('sm-state') || '{}')?.user?.token || ''; } catch { return ''; } };

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const t = token();
  try {
    const res = await fetch(`${API}${path}`, {
      ...init, cache: 'no-store',
      headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}), ...(init?.headers || {}) }
    });
    if (res.status === 401 && t) window.dispatchEvent(new Event('sm-unauthorized'));
    if (!res.ok) throw new Error('Error de servidor');
    return await res.json();
  } catch {
    // Fallback de datos de prueba cuando no se puede conectar al servidor backend
    if (path.startsWith('/api/freelancers')) {
      const url = new URL(`http://localhost${path}`);
      const category = url.searchParams.get('category');
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const minPrice = Number(url.searchParams.get('minPrice')) || 0;
      const maxPrice = Number(url.searchParams.get('maxPrice')) || 9999;
      
      let list = [...MOCK_FREELANCERS];
      if (category && category !== 'Todas') list = list.filter(f => f.category === category);
      if (q) list = list.filter(f => [f.name, f.profession, f.category, f.description, ...f.tags].some(s => s.toLowerCase().includes(q)));
      list = list.filter(f => f.priceXLM >= minPrice && f.priceXLM <= maxPrice);
      return list as unknown as T;
    }
    if (path.startsWith('/api/projects')) {
      const url = new URL(`http://localhost${path}`);
      const category = url.searchParams.get('category');
      const q = (url.searchParams.get('q') || '').toLowerCase();
      
      let list = [...MOCK_PROJECTS];
      if (category && category !== 'Todas') list = list.filter(p => p.category === category);
      if (q) list = list.filter(p => [p.title, p.clientName, p.category, p.description, ...p.tags].some(s => s.toLowerCase().includes(q)));
      return list as unknown as T;
    }
    return [] as unknown as T;
  }
}
