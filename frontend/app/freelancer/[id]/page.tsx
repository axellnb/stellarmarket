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

  if (err) return <p className="text-red-400">{err}</p>;
  if (!f) return <p className="text-muted">Cargando…</p>;

  return (
    <div className="space-y-10">
      <Link href="/marketplace" className="font-mono text-xs text-muted hover:text-brand">← marketplace</Link>

      <div className="grid items-start gap-6 md:grid-cols-[1fr_380px]">
        <div className="card space-y-6 p-8">
          <div className="flex items-center gap-6">
            <img src={f.avatar} alt={f.name} className="h-24 w-24 rounded-full border border-line object-cover" />
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">{f.name}</h1>
              <p className="mt-1 text-slate-400">{f.profession} <span className="font-mono text-sm text-muted">· {f.category}</span></p>
              <p className={`mt-2 flex items-center gap-2 font-mono text-xs ${f.available ? 'text-brand' : 'text-muted'}`}><AvailDot on={f.available} />{f.available ? 'Disponible' : 'Ocupado'}</p>
            </div>
          </div>
          <p className="text-lg text-slate-400">{f.description}</p>
          <div className="rounded-lg border border-line bg-bg px-4 py-3 font-mono text-xs">
            <span className="text-muted">wallet › </span><span className="break-all text-brand">{f.stellarWallet}</span>
          </div>
          <a href={f.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost w-fit">Ver portafolio ↗</a>
        </div>

        <aside className="card space-y-4 p-6 md:sticky md:top-24">
          <p className="font-mono text-xs text-muted">precio del servicio</p>
          <p className="font-mono text-5xl text-brand">{f.priceXLM} <span className="text-2xl">XLM{f.priceType === 'hour' ? ' /h' : ''}</span></p>
          <p className="font-mono text-xs text-muted">+ comisión de red <span className="text-orange-400">0.00001 XLM</span></p>
          {user?.role !== 'client' ? <p className="text-sm text-muted">Solo las cuentas de cliente pueden contratar.</p>
            : f.available ? <Link href={`/checkout/${f.id}`} className="btn w-full py-3">Contratar</Link> : <button disabled className="btn w-full py-3">No disponible</button>}
        </aside>
      </div>

      {/* Comentarios y calificaciones */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-semibold">Lo que dicen sus clientes</h2>
          {f.reviewCount > 0 && <div className="flex items-center gap-2 font-mono text-sm text-muted"><Stars value={f.rating} /> {f.rating} / 5 · {f.reviewCount} reseñas</div>}
        </div>
        <ReviewMarquee reviews={f.reviews} />

        {user?.role === 'client' && <form onSubmit={submit} className="card mx-auto max-w-xl space-y-3 p-5">
          <p className="text-sm font-medium">Deja tu opinión como {user.name}</p>
          <div className="flex items-center gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map(i => <button type="button" key={i} onClick={() => setRating(i)} className={i <= rating ? 'text-amber-400' : 'text-line'}>★</button>)}
            <span className="ml-2 font-mono text-xs text-muted">{rating} / 5</span>
          </div>
          <textarea className="input" rows={3} placeholder="¿Cómo fue tu experiencia?" value={comment} onChange={e => setComment(e.target.value)} required />
          <button className="btn">Publicar reseña</button>
        </form>}
      </section>
    </div>
  );
}

export default function Profile() { return <RequireAuth><ProfileInner /></RequireAuth>; }
