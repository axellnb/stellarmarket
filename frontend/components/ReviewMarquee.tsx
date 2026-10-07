import { Review } from '@/lib/types';
import Stars from './Stars';

// Carrusel horizontal infinito; se pausa al pasar el mouse
export default function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  if (!reviews || !reviews.length) return <p className="text-sm text-muted">Todavía no hay opiniones. ¡Sé el primero!</p>;
  let base = reviews.slice();
  while (base.length < 6) base = [...base, ...reviews];
  const mask = 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)';
  return (
    <div className="marquee overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
      <div className="marquee-track" style={{ animationDuration: `${base.length * 7}s` }}>
        {[...base, ...base].map((r, i) => (
          <div key={i} className="card w-72 shrink-0 space-y-2 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-line font-mono text-sm text-brand">{r.client[0]}</span>
              <div><p className="text-sm font-medium">{r.client}</p><Stars value={r.rating} size="text-sm" /></div>
            </div>
            <p className="text-sm text-slate-300">{r.comment}</p>
            <p className="font-mono text-xs text-muted">{r.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
