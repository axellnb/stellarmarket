'use client';
import { useState } from 'react';
import { ClientProject } from '@/lib/mockData';
import { useXlmPrice } from '@/lib/useXlmPrice';

export default function ProjectCard({ project }: { project: ClientProject }) {
  const [applied, setApplied] = useState(false);
  const [modal, setModal] = useState(false);
  const [proposal, setProposal] = useState('');
  const { convertXlmToUsd } = useXlmPrice();
  const usdText = convertXlmToUsd(project.budgetXLM);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setModal(false);
  };

  return (
    <div className="card-hover flex flex-col justify-between p-5 space-y-4 group border border-white/10 bg-[#1B1B39]/80 backdrop-blur-xl">
      <div className="space-y-3.5">
        <div className="flex items-center gap-3">
          <img src={project.clientAvatar} alt={project.clientName} className="h-11 w-11 rounded-xl object-cover border border-white/10 shadow-sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{project.clientName}</p>
            <p className="text-xs text-[#99B7FC] truncate">{project.companyOrRole}</p>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3 py-1 font-mono text-[11px] font-semibold text-[#3965FA]">
            {project.category}
          </span>
          <h3 className="mt-2.5 text-base font-bold leading-snug text-white group-hover:text-[#3965FA] transition-colors">{project.title}</h3>
          <p className="mt-2 text-xs text-[#E9EBFF]/70 line-clamp-3 leading-relaxed">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map(t => (
            <span key={t} className="rounded-lg border border-white/10 bg-[#1B1B39] px-2.5 py-1 font-mono text-[11px] text-[#99B7FC]">
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-3.5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase text-[#99B7FC]/60 tracking-wider">Presupuesto</p>
          <p className="font-mono text-base font-bold text-[#3965FA]">
            {project.budgetXLM} <span className="text-xs text-[#99B7FC]">XLM{project.budgetType === 'hour' ? '/h' : ''}</span>
            <span className="ml-1.5 font-mono text-xs text-[#99B7FC]">({usdText})</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {applied ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#8CC63E]/20 border border-[#8CC63E]/40 px-3.5 py-1.5 text-xs text-[#8CC63E] font-bold">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Postulado
            </span>
          ) : (
            <button onClick={() => setModal(true)} className="btn text-xs py-2 px-4 font-bold">
              Postularme
            </button>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md">
          <div className="card w-full max-w-md p-6 space-y-4 border-white/15 bg-[#1B1B39]/95 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white">Enviar propuesta</h3>
              <button onClick={() => setModal(false)} className="text-[#99B7FC] hover:text-white text-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{project.title}</p>
              <p className="text-xs text-[#99B7FC] mt-0.5">Cliente: {project.clientName} · Presupuesto: {project.budgetXLM} XLM ({usdText})</p>
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
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost text-xs">Cancelar</button>
                <button className="btn text-xs py-2.5 px-4 font-bold">Enviar propuesta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
