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
      const cleanPath = url.pathname.replace(/\/$/, '');
      const parts = cleanPath.split('/').filter(Boolean);

      if (parts.length <= 2) {
        if (init?.method === 'POST') {
          let body: any = {};
          try { body = JSON.parse(init.body as string || '{}'); } catch {}
          const newF: any = {
            id: 'freelancer-' + Date.now(),
            name: body.name || 'Freelancer Creado',
            profession: body.profession || 'Desarrollador / Diseñador',
            category: body.category || 'Diseño',
            tags: body.tags || ['ui-ux', 'branding'],
            description: body.description || 'Perfil profesional verificado.',
            portfolioUrl: body.portfolioUrl || 'https://behance.net',
            stellarWallet: body.stellarWallet || 'GBMOCKWALLETRANDOM1234567890STELLARNET',
            priceXLM: Number(body.priceXLM) || 50,
            priceType: body.priceType || 'fixed',
            available: body.available ?? true,
            rating: 5.0,
            reviewCount: 1,
            reviews: [{ client: 'Cliente Test', rating: 5, comment: '¡Perfil registrado y listo para recibir contrataciones!', date: new Date().toISOString().split('T')[0] }],
            avatar: body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
          };
          MOCK_FREELANCERS.unshift(newF);
          return newF as unknown as T;
        }

        const category = url.searchParams.get('category');
        const rawQ = (url.searchParams.get('q') || '').trim().toLowerCase();
        const minPrice = Number(url.searchParams.get('minPrice')) || 0;
        const maxPrice = Number(url.searchParams.get('maxPrice')) || 9999;
        
        let list = [...MOCK_FREELANCERS];
        if (category && category !== 'Todas') list = list.filter(f => f.category === category);
        if (rawQ) {
          const words = rawQ.split(/\s+/).filter(w => w.length > 1);
          list = list.filter(f => {
            const haystack = [f.name, f.profession, f.category, f.description, ...f.tags].join(' ').toLowerCase();
            return words.length > 0 ? words.some(w => haystack.includes(w)) : haystack.includes(rawQ);
          });
        }
        list = list.filter(f => f.priceXLM >= minPrice && f.priceXLM <= maxPrice);
        return list as unknown as T;
      }

      const id = parts[2];
      const freelancer = MOCK_FREELANCERS.find(f => String(f.id) === String(id)) || MOCK_FREELANCERS[0];

      if (parts.length >= 4 && parts[3] === 'reviews') {
        if (init?.body) {
          try {
            const body = JSON.parse(init.body as string);
            const newReview = { client: 'Cliente Test', rating: body.rating || 5, comment: body.comment || '', date: new Date().toISOString().split('T')[0] };
            const updatedReviews = [newReview, ...(freelancer.reviews || [])];
            return { ...freelancer, reviews: updatedReviews, reviewCount: updatedReviews.length } as unknown as T;
          } catch {}
        }
        return freelancer as unknown as T;
      }

      return freelancer as unknown as T;
    }

    if (path.startsWith('/api/projects')) {
      const url = new URL(`http://localhost${path}`);
      const cleanPath = url.pathname.replace(/\/$/, '');
      const parts = cleanPath.split('/').filter(Boolean);

      if (parts.length <= 2) {
        const category = url.searchParams.get('category');
        const rawQ = (url.searchParams.get('q') || '').trim().toLowerCase();
        
        let list = [...MOCK_PROJECTS];
        if (category && category !== 'Todas') list = list.filter(p => p.category === category);
        if (rawQ) {
          const words = rawQ.split(/\s+/).filter(w => w.length > 1);
          list = list.filter(p => {
            const haystack = [p.title, p.clientName, p.category, p.description, ...p.tags].join(' ').toLowerCase();
            return words.length > 0 ? words.some(w => haystack.includes(w)) : haystack.includes(rawQ);
          });
        }
        return list as unknown as T;
      }

      const id = parts[2];
      const project = MOCK_PROJECTS.find(p => String(p.id) === String(id)) || MOCK_PROJECTS[0];
      return project as unknown as T;
    }

    if (path.startsWith('/api/me')) {
      const state = (() => { try { return JSON.parse(localStorage.getItem('sm-state') || '{}'); } catch { return {}; } })();
      if (state?.user?.name && state?.user?.role) {
        return state.user as unknown as T;
      }
      return {
        name: 'Usuario Demo',
        email: 'demo@stellarwork.app',
        role: 'client',
        prefs: []
      } as unknown as T;
    }

    if (path.startsWith('/api/payments/confirm')) {
      return {
        success: true,
        hash: 'mock-tx-hash-' + Date.now(),
        from: 'G...GUEST',
        to: 'G...FREELANCER',
        amount: 10,
        fee: 0.00001,
        ledger: 12345678,
        network: 'Stellar Testnet',
        explorerUrl: 'https://stellar.expert/explorer/testnet'
      } as unknown as T;
    }

    return [] as unknown as T;
  }
}
