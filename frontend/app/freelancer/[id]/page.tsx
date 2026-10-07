'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Freelancer } from '@/lib/types';
import { useApp } from '@/lib/AppContext';
import Stars from '@/components/Stars';
import AvailDot from '@/components/AvailDot';
import ReviewMarquee from '@/components/ReviewMarquee';
import RequireAuth from '@/components/RequireAuth';

function ProfileInner() {
  const { id } = useParams<{ id: string }>();
  const { user } = useApp();
  const [f, setF] = useState<Freelancer | null>(null);
  const [err, setErr] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => { api<Freelancer>(`/api/freelancers/${id}`).then(setF).catch(e => setErr(e.message)); }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { setF(await api<Freelancer>(`/api/freelancers/${id}/reviews`, { method: 'POST', body: JSON.stringify({ rating, comment }) })); setComment(''); setRating(5); }
    catch (e: any) { alert(e.message); }
  };

  if (err) return <div className="card p-12 text-center text-red-400 font-medium">{err}</div>;
  if (!f) return <div className="card p-12 text-center text-[#99B7FC]">Cargando perfil...</div>;

  return (
    <div className="space-y-10">
      <Link href="/marketplace" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#3965FA] hover:underline">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Marketplace
      </Link>

      <div className="grid items-start gap-8 md:grid-cols-[1fr_380px]">
        <div className="card p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img src={f.avatar} alt={f.name} className="h-24 w-24 rounded-2xl border border-white/10 object-cover shadow-xl" />
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">{f.name}</h1>
              <p className="mt-1 text-base text-[#99B7FC] font-medium">{f.profession} <span className="text-[#99B7FC]/40 font-mono text-xs">· {f.category}</span></p>
              <p className={`mt-2.5 inline-flex items-center gap-2 font-mono text-xs font-semibold ${f.available ? 'text-[#8CC63E]' : 'text-[#99B7FC]/50'}`}>
                <AvailDot on={f.available} />
                {f.available ? 'Disponible para trabajos' : 'Ocupado actualmente'}
              </p>
            </div>
          </div>

          <p className="text-base text-[#E9EBFF]/80 leading-relaxed border-t border-white/10 pt-6">{f.description}</p>

          <div className="rounded-xl border border-white/10 bg-[#202020]/80 p-4 font-mono text-xs space-y-1">
            <p className="text-[#99B7FC]/70 uppercase tracking-wider text-[10px] font-semibold">Dirección de Wallet en Red Stellar</p>
            <p className="break-all font-bold text-[#3965FA]">{f.stellarWallet}</p>
          </div>

          <div className="pt-2">
            <a href={f.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs">
              Ver portafolio externo
              <svg className="w-3.5 h-3.5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>

        <aside className="card p-6 space-y-6 md:sticky md:top-24 border-[#3965FA]/30 shadow-2xl">
          <div>
            <p className="font-mono text-xs uppercase font-semibold text-[#99B7FC]/70 tracking-wider">Tarifa del Servicio</p>
            <p className="mt-2 font-mono text-5xl font-bold text-[#3965FA]">{f.priceXLM} <span className="text-xl text-[#99B7FC]">XLM{f.priceType === 'hour' ? '/h' : ''}</span></p>
            <p className="mt-2 font-mono text-xs text-[#99B7FC]/70">+ comisión de red <span className="text-[#FF6D47]">0.00001 XLM</span></p>
          </div>

          {user?.role !== 'client' ? (
            <p className="text-xs text-[#99B7FC]/70 bg-white/5 p-3 rounded-xl border border-white/10">Inicia sesión como cliente para contratar los servicios de {f.name}.</p>
          ) : f.available ? (
            <Link href={`/checkout/${f.id}`} className="btn w-full py-3 text-sm font-semibold">
              Contratar servicio
            </Link>
          ) : (
            <button disabled className="btn w-full py-3 text-sm">No disponible</button>
          )}
        </aside>
      </div>

      {/* Reseñas y calificaciones */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Opiniones de clientes</h2>
          {f.reviewCount > 0 && (
            <div className="flex items-center gap-2 font-mono text-xs text-[#99B7FC]">
              <Stars value={f.rating} />
              <span className="font-bold text-white text-sm">{f.rating}</span> / 5 · {f.reviewCount} reseñas
            </div>
          )}
        </div>

        <ReviewMarquee reviews={f.reviews} />

        {user?.role === 'client' && (
          <form onSubmit={submit} className="card max-w-xl mx-auto p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Deja tu opinión profesional</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button type="button" key={i} onClick={() => setRating(i)} className={`p-1 transition-transform hover:scale-110 ${i <= rating ? 'text-[#FFD16B]' : 'text-white/20'}`}>
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </button>
              ))}
              <span className="ml-2 font-mono text-xs font-bold text-[#FFD16B]">{rating} / 5</span>
            </div>
            <textarea className="input" rows={3} placeholder="Describe tu experiencia colaborando con esta persona..." value={comment} onChange={e => setComment(e.target.value)} required />
            <button className="btn text-xs py-2.5 px-5">Publicar reseña</button>
          </form>
        )}
      </section>
    </div>
  );
}

export default function Profile() { return <RequireAuth allowGuest><ProfileInner /></RequireAuth>; }
