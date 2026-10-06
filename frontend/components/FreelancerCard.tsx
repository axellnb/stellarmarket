import Link from 'next/link';
import { Freelancer, priceLabel } from '@/lib/types';
import Stars from './Stars';
import AvailDot from './AvailDot';

export default function FreelancerCard({ f }: { f: Freelancer }) {
  return (
    <div className="card flex flex-col p-4 transition hover:border-brand/50">
      <Link href={`/freelancer/${f.id}`} className="flex items-center gap-3">
        <img src={f.avatar} alt={f.name} className="h-12 w-12 rounded-full border border-line object-cover" />
        <div className="min-w-0">
          <p className="truncate font-medium">{f.name}</p>
          <p className="truncate text-xs text-muted">{f.profession} · {f.category}</p>
        </div>
      </Link>
      {!!f.match && <span className="mt-3 w-fit rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[11px] text-brand">✦ Coincide con tus intereses</span>}
      <p className="mt-3 line-clamp-2 text-sm text-slate-400">{f.description}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
        {f.reviewCount > 0 ? <><Stars value={f.rating} size="text-sm" /> {f.rating} ({f.reviewCount})</> : 'Sin reseñas aún'}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-sm text-brand">{priceLabel(f)}</span>
        <span className={`flex items-center gap-2 font-mono text-xs ${f.available ? 'text-brand' : 'text-muted'}`}><AvailDot on={f.available} />{f.available ? 'Disponible' : 'Ocupado'}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a href={f.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Ver portafolio ↗</a>
        <Link href={`/freelancer/${f.id}`} className="btn">Ver perfil</Link>
      </div>
    </div>
  );
}
