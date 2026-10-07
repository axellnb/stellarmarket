import Link from 'next/link';
import { Freelancer, priceLabel } from '@/lib/types';
import Stars from './Stars';
import AvailDot from './AvailDot';

export default function FreelancerCard({ f }: { f: Freelancer }) {
  return (
    <div className="card-hover flex flex-col p-5 group">
      <Link href={`/freelancer/${f.id}`} className="flex items-center gap-3.5">
        <div className="relative">
          <img src={f.avatar} alt={f.name} className="h-13 w-13 rounded-xl border border-white/10 object-cover shadow-md group-hover:scale-105 transition-transform" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white group-hover:text-[#3965FA] transition-colors">{f.name}</p>
          <p className="truncate text-xs text-[#99B7FC] mt-0.5">{f.profession} <span className="opacity-50">·</span> {f.category}</p>
        </div>
      </Link>

      {!!f.match && (
        <span className="mt-3 inline-flex items-center gap-1.5 w-fit rounded-full border border-[#3965FA]/30 bg-[#3965FA]/10 px-3 py-1 font-mono text-[11px] font-medium text-[#99B7FC]">
          <svg className="w-3 h-3 text-[#3965FA]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          Recomendado para ti
        </span>
      )}

      <p className="mt-3 line-clamp-2 text-sm text-[#E9EBFF]/70 leading-relaxed">{f.description}</p>

      <div className="mt-3 flex items-center gap-2 text-xs text-[#99B7FC]">
        {f.reviewCount > 0 ? (
          <>
            <Stars value={f.rating} />
            <span className="font-mono font-medium text-white">{f.rating}</span>
            <span className="text-[#99B7FC]/60">({f.reviewCount})</span>
          </>
        ) : (
          <span className="text-[#99B7FC]/50 italic">Sin reseñas aún</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="font-mono text-sm font-semibold text-[#3965FA]">{priceLabel(f)}</span>
        <span className={`flex items-center gap-2 font-mono text-xs ${f.available ? 'text-[#8CC63E]' : 'text-[#99B7FC]/50'}`}>
          <AvailDot on={f.available} />
          {f.available ? 'Disponible' : 'Ocupado'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <a href={f.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-2">
          Portafolio
          <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
        <Link href={`/freelancer/${f.id}`} className="btn text-xs py-2">Ver perfil</Link>
      </div>
    </div>
  );
}
