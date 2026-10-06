'use client';
import { useState } from 'react';
import { ClientProject } from '@/lib/mockData';

export default function ProjectCard({ project }: { project: ClientProject }) {
  const [applied, setApplied] = useState(false);
  const [modal, setModal] = useState(false);
  const [proposal, setProposal] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setModal(false);
  };

  return (
    <div className="card flex flex-col justify-between p-5 space-y-4 transition hover:border-brand/50">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <img src={project.clientAvatar} alt={project.clientName} className="h-11 w-11 rounded-full object-cover border border-white/10" />
          <div>
            <p className="text-sm font-semibold text-slate-100">{project.clientName}</p>
            <p className="text-xs text-muted">{project.companyOrRole}</p>
          </div>
        </div>

        <div>
          <span className="rounded-full border border-line bg-panel px-2.5 py-0.5 font-mono text-[11px] text-brand">
            {project.category}
          </span>
          <h3 className="mt-2 text-base font-semibold leading-snug text-white">{project.title}</h3>
          <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map(t => (
            <span key={t} className="rounded-md border border-line bg-bg/50 px-2 py-0.5 text-[10px] text-slate-300">
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase text-muted tracking-wider">Presupuesto</p>
          <p className="font-mono text-lg font-bold text-brand">
            {project.budgetXLM} <span className="text-xs text-slate-300">XLM{project.budgetType === 'hour' ? '/h' : ''}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {applied ? (
            <span className="rounded-lg bg-brand/10 border border-brand/40 px-3 py-1.5 text-xs text-brand font-semibold">
              ✓ Postulado
            </span>
          ) : (
            <button onClick={() => setModal(true)} className="btn text-xs py-1.5 px-3">
              Postularme
            </button>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6 space-y-4 border-brand/40">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-semibold text-lg text-white">Enviar propuesta</h3>
              <button onClick={() => setModal(false)} className="text-muted hover:text-white text-lg">✕</button>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{project.title}</p>
              <p className="text-xs text-muted mt-0.5">Cliente: {project.clientName} · Presupuesto: {project.budgetXLM} XLM</p>
            </div>
            <form onSubmit={handleApply} className="space-y-3">
              <textarea
                required
                rows={4}
                className="input w-full text-sm"
                placeholder="Escribe brevemente por qué eres la persona ideal para este proyecto..."
                value={proposal}
                onChange={e => setProposal(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost text-xs">Cancelar</button>
                <button className="btn text-xs py-2 px-4">Enviar propuesta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
