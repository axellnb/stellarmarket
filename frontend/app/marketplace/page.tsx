'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { CATEGORIES, Freelancer } from '@/lib/types';
import FreelancerCard from '@/components/FreelancerCard';
import { useApp } from '@/lib/AppContext';
import RequireAuth from '@/components/RequireAuth';

function Market() {
  const sp = useSearchParams();
  const [category, setCategory] = useState(sp.get('category') || 'Todas');
  const [q, setQ] = useState(sp.get('q') || '');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const { user } = useApp();
  const prefsKey = user?.role === 'client' ? (user.prefs || []).join(',') : '';
  const [forYou, setForYou] = useState(true);
  const [list, setList] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams({ category, minPrice: String(min), maxPrice: String(max), q, available: String(onlyAvail), prefs: forYou ? prefsKey : '' });
    const t = setTimeout(() => api<Freelancer[]>(`/api/freelancers?${p}`).then(setList).catch(() => setList([])).finally(() => setLoading(false)), 200);
    return () => clearTimeout(t);
  }, [category, min, max, q, onlyAvail, forYou, prefsKey]);

  return (
    <div className="grid gap-8 md:grid-cols-[260px_1fr]">
      <aside className="card h-fit space-y-6 p-5">
        <div>
          <label className="text-xs text-muted">Buscar</label>
          <input className="input mt-1" value={q} onChange={e => setQ(e.target.value)} placeholder="Servicio o nombre" />
        </div>
        <div>
          <p className="mb-2 text-xs text-muted">Categoría</p>
          <div className="flex flex-wrap gap-2">
            {['Todas', ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`chip ${category === c ? '!border-brand !text-brand' : ''}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-muted">Precio: <span className="font-mono text-slate-200">{min} – {max} XLM</span></p>
          <input type="range" min={0} max={100} value={min} onChange={e => setMin(Math.min(+e.target.value, max))} className="w-full accent-[#3ee6a0]" />
          <input type="range" min={0} max={100} value={max} onChange={e => setMax(Math.max(+e.target.value, min))} className="w-full accent-[#3ee6a0]" />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyAvail} onChange={e => setOnlyAvail(e.target.checked)} className="accent-[#3ee6a0]" /> Solo disponibles</label>
        {prefsKey && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={forYou} onChange={e => setForYou(e.target.checked)} className="accent-[#3ee6a0]" /> ✦ Ordenar para mí</label>}
      </aside>
      <section>
        <h1 className="mb-5 text-2xl font-semibold">Marketplace <span className="font-mono text-sm text-muted">{list.length} resultados</span></h1>
        {loading ? <p className="text-muted">Cargando…</p> : list.length === 0 ? <p className="text-muted">Sin resultados con esos filtros.</p> :
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map(f => <FreelancerCard key={f.id} f={f} />)}</div>}
      </section>
    </div>
  );
}
export default function Page() { return <RequireAuth><Suspense fallback={<p className="text-muted">Cargando…</p>}><Market /></Suspense></RequireAuth>; }
