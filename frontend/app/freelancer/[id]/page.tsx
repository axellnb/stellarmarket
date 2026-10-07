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
import { useXlmPrice } from '@/lib/useXlmPrice';

function ProfileInner() {
  const { id } = useParams<{ id: string }>();
  const { user } = useApp();
  const { convertXlmToUsd } = useXlmPrice();
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

  const usdText = convertXlmToUsd(f.priceXLM);

  return (
    <div className="space-y-10">
      <Link href="/marketplace" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#3965FA] hover:underline">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Marketplace
      </Link>

      <div className="grid items-start gap-8 md:grid-cols-[1fr_380px]">
        <div className="card p-8 space-y-6 border border-white/15 bg-[#1B1B39]/90 backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img src={f.avatar} alt={f.name} className="h-24 w-24 rounded-2xl border border-white/10 object-cover shadow-xl" />
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">{f.name}</h1>
              <p className="mt-1 text-base text-[#99B7FC] font-semibold">{f.profession} <span className="text-[#99B7FC]/40 font-mono text-xs">· {f.category}</span></p>
              <p className={`mt-2.5 inline-flex items-center gap-2 font-mono text-xs font-semibold ${f.available ? 'text-[#8CC63E]' : 'text-[#99B7FC]/50'}`}>
                <AvailDot on={f.available} />
                {f.available ? 'Disponible para trabajos' : 'Ocupado actualmente'}
              </p>
            </div>
          </div>

          <p className="text-base text-[#E9EBFF]/80 leading-relaxed border-t border-white/10 pt-6">{f.description}</p>

          <div className="rounded-xl border border-white/10 bg-[#1B1B39] p-4 font-mono text-xs space-y-1">
            <p className="text-[#99B7FC]/70 uppercase tracking-wider text-[10px] font-semibold">Dirección de Wallet en Red Stellar</p>
            <p className="break-all font-bold text-[#3965FA]">{f.stellarWallet}</p>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-white mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {f.tags.map(t => (
                <span key={t} className="chip font-semibold">#{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-8 space-y-6 border border-white/15 bg-[#1B1B39]/90 backdrop-blur-2xl">
          <div>
            <span className="font-mono text-xs text-[#99B7FC]/60 uppercase tracking-wider">Tarifa del servicio</span>
            <p className="mt-1 font-mono text-4xl font-extrabold text-[#3965FA]">
              {f.priceXLM} <span className="text-lg font-normal text-[#99B7FC]">XLM{f.priceType === 'hour' ? ' / h' : ''}</span>
            </p>
            <p className="mt-1 font-mono text-sm text-[#99B7FC] font-semibold">
              Conversión actual: <span className="text-white font-bold">{usdText}</span>{f.priceType === 'hour' ? '/h' : ''}
            </p>
          </div>

          {user?.role === 'client' ? (
            <Link href={`/checkout/${f.id}`} className="btn w-full py-3.5 text-sm font-bold shadow-lg shadow-[#3965FA]/30">
              Contratar Servicio
            </Link>
          ) : (
            <p className="text-xs text-[#99B7FC] bg-white/5 p-3 rounded-xl border border-white/10">
              Conéctate como cliente para enviar solicitudes de contratación en XLM.
            </p>
          )}

          <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-[#99B7FC]/80">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8CC63E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Liquidación instantánea P2P</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8CC63E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Comisión de red fija (0.00001 XLM)</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8CC63E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Verificable en Explorer Stellar</span>
            </div>
          </div>
        </div>
      </div>

      <ReviewMarquee reviews={f.reviews} />

      <div className="card p-8 border border-white/15 bg-[#1B1B39]/90 backdrop-blur-2xl max-w-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Dejar una calificación</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#99B7FC] mb-1.5 block">Puntuación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-xl border text-sm font-mono font-bold transition-all ${rating >= star ? 'border-[#FFD16B] bg-[#FFD16B]/10 text-[#FFD16B]' : 'border-white/10 text-white/40'}`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#99B7FC] mb-1.5 block">Comentario</label>
            <textarea
              required
              rows={3}
              className="input w-full"
              placeholder="Describe tu experiencia de trabajo con este freelancer..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <button className="btn py-3 px-6 text-xs font-bold">Publicar reseña</button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth allowGuest>
      <ProfileInner />
    </RequireAuth>
  );
}
