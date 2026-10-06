'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { CATEGORIES, Freelancer } from '@/lib/types';
import { ClientProject, MOCK_PROJECTS } from '@/lib/mockData';
import FreelancerCard from '@/components/FreelancerCard';
import ProjectCard from '@/components/ProjectCard';
import { useApp } from '@/lib/AppContext';
import RequireAuth from '@/components/RequireAuth';

function Market() {
  const sp = useSearchParams();
  const [tab, setTab] = useState<'freelancers' | 'projects'>((sp.get('tab') as any) || 'freelancers');
  const [category, setCategory] = useState(sp.get('category') || 'Todas');
  const [q, setQ] = useState(sp.get('q') || '');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const { user } = useApp();
  const prefsKey = user?.role === 'client' ? (user.prefs || []).join(',') : '';
  const [forYou, setForYou] = useState(true);
  
  const [freelancerList, setFreelancerList] = useState<Freelancer[]>([]);
  const [projectList, setProjectList] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === 'freelancers') {
      const p = new URLSearchParams({ category, minPrice: String(min), maxPrice: String(max), q, available: String(onlyAvail), prefs: forYou ? prefsKey : '' });
      const t = setTimeout(() => api<Freelancer[]>(`/api/freelancers?${p}`).then(setFreelancerList).catch(() => setFreelancerList([])).finally(() => setLoading(false)), 150);
      return () => clearTimeout(t);
    } else {
      const p = new URLSearchParams({ category, q });
      const t = setTimeout(() => api<ClientProject[]>(`/api/projects?${p}`).then(res => setProjectList(res?.length ? res : MOCK_PROJECTS)).catch(() => setProjectList(MOCK_PROJECTS)).finally(() => setLoading(false)), 150);
      return () => clearTimeout(t);
    }
  }, [tab, category, min, max, q, onlyAvail, forYou, prefsKey]);

  return (
    <div className="space-y-6">
      {/* Selector de Sección (Tabs principales) */}
      <div className="flex flex-wrap items-center justify-between border-b border-line pb-4 gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Marketplace</h1>
          <p className="text-xs text-muted mt-1">Conecta talento freelance y proyectos pagados en XLM</p>
        </div>
        <div className="flex rounded-xl border border-line bg-panel p-1">
          <button
            onClick={() => setTab('freelancers')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === 'freelancers' ? 'bg-brand text-bg shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            🧑‍💻 Freelancers (Talento)
          </button>
          <button
            onClick={() => setTab('projects')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === 'projects' ? 'bg-brand text-bg shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            💼 Buscando Freelancers ({projectList.length || MOCK_PROJECTS.length})
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        {/* Filtros laterales */}
        <aside className="card h-fit space-y-6 p-5">
          <div>
            <label className="text-xs text-muted">Buscar</label>
            <input className="input mt-1" value={q} onChange={e => setQ(e.target.value)} placeholder={tab === 'freelancers' ? "Servicio o nombre" : "Proyecto o requisitos"} />
          </div>

          <div>
            <p className="mb-2 text-xs text-muted">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {['Todas', ...CATEGORIES].map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`chip ${category === c ? '!border-brand !text-brand' : ''}`}>{c}</button>
              ))}
            </div>
          </div>

          {tab === 'freelancers' && (
            <>
              <div>
                <p className="mb-2 text-xs text-muted">Precio: <span className="font-mono text-slate-200">{min} – {max} XLM</span></p>
                <input type="range" min={0} max={100} value={min} onChange={e => setMin(Math.min(+e.target.value, max))} className="w-full accent-[#3ee6a0]" />
                <input type="range" min={0} max={100} value={max} onChange={e => setMax(Math.max(+e.target.value, min))} className="w-full accent-[#3ee6a0]" />
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyAvail} onChange={e => setOnlyAvail(e.target.checked)} className="accent-[#3ee6a0]" /> Solo disponibles</label>
              {prefsKey && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={forYou} onChange={e => setForYou(e.target.checked)} className="accent-[#3ee6a0]" /> ✦ Ordenar para mí</label>}
            </>
          )}
        </aside>

        {/* Contenido principal de la sección activa */}
        <section>
          {tab === 'freelancers' ? (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Freelancers disponibles</h2>
                <span className="font-mono text-xs text-muted">{freelancerList.length} resultados</span>
              </div>
              {loading ? (
                <p className="text-muted">Cargando freelancers…</p>
              ) : freelancerList.length === 0 ? (
                <p className="text-muted">No se encontraron freelancers con esos filtros.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {freelancerList.map(f => <FreelancerCard key={f.id} f={f} />)}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Proyectos buscando talento</h2>
                <span className="font-mono text-xs text-muted">{projectList.length} ofertas abiertas</span>
              </div>
              {loading ? (
                <p className="text-muted">Cargando proyectos…</p>
              ) : projectList.length === 0 ? (
                <p className="text-muted">No hay ofertas de proyectos con esos filtros.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {projectList.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <RequireAuth allowGuest>
      <Suspense fallback={<p className="text-muted">Cargando Marketplace…</p>}>
        <Market />
      </Suspense>
    </RequireAuth>
  );
}
