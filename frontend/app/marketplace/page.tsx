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
  const prefsKey = user?.role === 'client' && Array.isArray(user.prefs) ? user.prefs.join(',') : '';
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
    <div className="space-y-8">
      {/* Dashboard Header & Tabs */}
      <div className="card p-6 border-white/10 bg-gradient-to-r from-[#202020]/90 to-[#1B1B39]/90 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3965FA] animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase text-[#99B7FC] tracking-wider">Dashboard Freelance · Red Stellar</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">Marketplace Profesional</h1>
            <p className="mt-1 text-sm text-[#99B7FC]/80 max-w-xl leading-relaxed">
              Explora talento verificado y solicitudes de proyectos con contratos y liquidación instantánea en XLM.
            </p>
          </div>

          <div className="flex rounded-2xl border border-white/10 bg-[#1B1B39]/80 p-1.5 backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setTab('freelancers')}
              className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${tab === 'freelancers' ? 'bg-[#3965FA] text-white shadow-lg shadow-[#3965FA]/30' : 'text-[#99B7FC] hover:text-white'}`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Talento Freelance
            </button>
            <button
              onClick={() => setTab('projects')}
              className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${tab === 'projects' ? 'bg-[#3965FA] text-white shadow-lg shadow-[#3965FA]/30' : 'text-[#99B7FC] hover:text-white'}`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              Proyectos Abiertos ({projectList.length || MOCK_PROJECTS.length})
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Panel de Filtros Lateral */}
        <aside className="card h-fit space-y-6 p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-[#3965FA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filtros de búsqueda
            </h3>
            {(q || category !== 'Todas' || onlyAvail || min > 0 || max < 100) && (
              <button onClick={() => { setQ(''); setCategory('Todas'); setOnlyAvail(false); setMin(0); setMax(100); }} className="text-[11px] font-semibold text-[#3965FA] hover:underline">
                Limpiar
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-[#99B7FC] block mb-1.5">Búsqueda rápida</label>
            <div className="relative">
              <input
                className="input pr-8 text-xs"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={tab === 'freelancers' ? "Servicio, habilidad o nombre" : "Título de proyecto o tecnología"}
              />
              {q && (
                <button onClick={() => setQ('')} className="absolute right-2.5 top-3 text-[#99B7FC] hover:text-white text-xs">✕</button>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-xs font-medium text-[#99B7FC]">Categoría</p>
            <div className="flex flex-wrap gap-1.5">
              {['Todas', ...CATEGORIES].map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`chip text-xs ${category === c ? '!border-[#3965FA] !bg-[#3965FA]/20 !text-white font-semibold' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {tab === 'freelancers' && (
            <div className="space-y-5 pt-2 border-t border-white/10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-[#99B7FC]">Rango de precio</p>
                  <span className="font-mono text-xs font-bold text-white">{min} – {max} XLM</span>
                </div>
                <input type="range" min={0} max={100} value={min} onChange={e => setMin(Math.min(+e.target.value, max))} className="w-full accent-[#3965FA]" />
                <input type="range" min={0} max={100} value={max} onChange={e => setMax(Math.max(+e.target.value, min))} className="w-full accent-[#3965FA]" />
              </div>

              <label className="flex items-center gap-2.5 text-xs font-medium text-[#E9EBFF] cursor-pointer">
                <input type="checkbox" checked={onlyAvail} onChange={e => setOnlyAvail(e.target.checked)} className="accent-[#3965FA] h-4 w-4 rounded" />
                Solo profesionales disponibles
              </label>

              {prefsKey && (
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#3965FA] cursor-pointer">
                  <input type="checkbox" checked={forYou} onChange={e => setForYou(e.target.checked)} className="accent-[#3965FA] h-4 w-4 rounded" />
                  Priorizar recomendaciones para mí
                </label>
              )}
            </div>
          )}
        </aside>

        {/* Sección Principal de Contenido */}
        <section className="space-y-6">
          {tab === 'freelancers' ? (
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  Freelancers Verificados
                  <span className="rounded-full bg-[#3965FA]/15 border border-[#3965FA]/30 px-2.5 py-0.5 font-mono text-xs text-[#3965FA]">
                    {freelancerList.length}
                  </span>
                </h2>
              </div>
              {loading ? (
                <div className="card p-12 text-center text-[#99B7FC] font-medium">Cargando perfiles profesionales…</div>
              ) : freelancerList.length === 0 ? (
                <div className="card p-12 text-center text-[#99B7FC] space-y-2">
                  <p className="text-base font-medium text-white">No se encontraron freelancers con esos filtros.</p>
                  <p className="text-xs">Intenta ajustar los filtros de categoría o rango de precios.</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {freelancerList.map(f => <FreelancerCard key={f.id} f={f} />)}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  Proyectos en Búsqueda de Talento
                  <span className="rounded-full bg-[#3965FA]/15 border border-[#3965FA]/30 px-2.5 py-0.5 font-mono text-xs text-[#3965FA]">
                    {projectList.length}
                  </span>
                </h2>
              </div>
              {loading ? (
                <div className="card p-12 text-center text-[#99B7FC] font-medium">Cargando ofertas de trabajo…</div>
              ) : projectList.length === 0 ? (
                <div className="card p-12 text-center text-[#99B7FC] space-y-2">
                  <p className="text-base font-medium text-white">No hay ofertas de proyectos abiertas con esos filtros.</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
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
      <Suspense fallback={<div className="card p-12 text-center text-[#99B7FC]">Cargando Marketplace…</div>}>
        <Market />
      </Suspense>
    </RequireAuth>
  );
}
