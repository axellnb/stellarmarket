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
import LiquidGlassWrapper from '@/components/LiquidGlassWrapper';

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
    <LiquidGlassWrapper className="space-y-8">
      {/* Dashboard Header & Tabs */}
      <div className="card liquid-glass p-6 border-white/15 bg-[#1B1B39]/80 shadow-2xl backdrop-blur-2xl"
           data-config={JSON.stringify({ refraction: 0.7, blurAmount: 0.2, cornerRadius: 24 })}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3965FA] animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase text-[#99B7FC] tracking-wider">Dashboard Freelance · Red Stellar</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">Marketplace Profesional</h1>
            <p className="mt-1 text-sm text-[#99B7FC]/80 max-w-xl leading-relaxed">
              Explora talento verificado y solicitudes de proyectos con contratos y liquidación instantánea en XLM.
            </p>
          </div>

          <div className="flex rounded-2xl border border-white/15 bg-[#1B1B39]/90 p-1.5 backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setTab('freelancers')}
              className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${tab === 'freelancers' ? 'bg-[#3965FA] text-white shadow-lg shadow-[#3965FA]/30' : 'text-[#99B7FC] hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Freelancers
            </button>
            <button
              onClick={() => setTab('projects')}
              className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${tab === 'projects' ? 'bg-[#3965FA] text-white shadow-lg shadow-[#3965FA]/30' : 'text-[#99B7FC] hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Proyectos Abiertos
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Panel de Filtros */}
        <aside className="card liquid-glass space-y-6 p-6 h-fit border-white/15 bg-[#1B1B39]/70 backdrop-blur-xl"
               data-config={JSON.stringify({ refraction: 0.6, blurAmount: 0.15, cornerRadius: 20 })}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <svg className="w-4 h-4 text-[#3965FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros de Búsqueda
            </h2>
            {(category !== 'Todas' || q || min > 0 || max < 100 || onlyAvail) && (
              <button
                onClick={() => { setCategory('Todas'); setQ(''); setMin(0); setMax(100); setOnlyAvail(false); }}
                className="text-xs text-[#3965FA] hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Búsqueda por palabra clave */}
          <div>
            <label className="text-xs font-semibold text-[#99B7FC] mb-1.5 block">Palabra clave</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. UX, Next.js, Branding"
                value={q}
                onChange={e => setQ(e.target.value)}
                className="input pr-8"
              />
              {q && (
                <button onClick={() => setQ('')} className="absolute right-2.5 top-2.5 text-[#99B7FC] hover:text-white">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs font-semibold text-[#99B7FC] mb-1.5 block">Categorías</label>
            <div className="flex flex-wrap gap-1.5">
              {['Todas', ...CATEGORIES].map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`chip ${category === c ? '!border-[#3965FA] !bg-[#3965FA]/20 !text-white' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de Tarifa (XLM) */}
          {tab === 'freelancers' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[#99B7FC]">Tarifa Máxima</label>
                <span className="font-mono text-xs font-bold text-[#3965FA]">{max} XLM</span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={max}
                onChange={e => setMax(+e.target.value)}
                className="w-full accent-[#3965FA] cursor-pointer"
              />
            </div>
          )}

          {/* Solo Disponibles */}
          {tab === 'freelancers' && (
            <label className="flex items-center gap-2.5 text-xs font-semibold text-[#E9EBFF] cursor-pointer pt-2 border-t border-white/10">
              <input
                type="checkbox"
                checked={onlyAvail}
                onChange={e => setOnlyAvail(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#3965FA] focus:ring-[#3965FA]"
              />
              <span>Mostrar solo disponibles</span>
            </label>
          )}
        </aside>

        {/* Listado Principal */}
        <section>
          {tab === 'freelancers' ? (
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Freelancers Verificados
                  <span className="rounded-full bg-[#3965FA]/20 border border-[#3965FA]/40 px-2.5 py-0.5 font-mono text-xs font-bold text-[#3965FA]">
                    {freelancerList.length}
                  </span>
                </h2>
              </div>
              {loading ? (
                <div className="card p-12 text-center text-[#99B7FC] font-medium">Cargando perfiles profesionales…</div>
              ) : freelancerList.length === 0 ? (
                <div className="card p-12 text-center text-[#99B7FC] space-y-2">
                  <p className="text-base font-bold text-white">No se encontraron freelancers con esos filtros.</p>
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
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Proyectos en Búsqueda de Talento
                  <span className="rounded-full bg-[#3965FA]/20 border border-[#3965FA]/40 px-2.5 py-0.5 font-mono text-xs font-bold text-[#3965FA]">
                    {projectList.length}
                  </span>
                </h2>
              </div>
              {loading ? (
                <div className="card p-12 text-center text-[#99B7FC] font-medium">Cargando ofertas de trabajo…</div>
              ) : projectList.length === 0 ? (
                <div className="card p-12 text-center text-[#99B7FC] space-y-2">
                  <p className="text-base font-bold text-white">No hay ofertas de proyectos abiertas con esos filtros.</p>
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
    </LiquidGlassWrapper>
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
