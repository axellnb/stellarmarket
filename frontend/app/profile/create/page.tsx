'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CATEGORIES, Freelancer, INTERESTS } from '@/lib/types';
import { useApp } from '@/lib/AppContext';
import RequireAuth from '@/components/RequireAuth';

const toAvatar = (file: File) => new Promise<string>((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = 256;
    c.getContext('2d')!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256);
    resolve(c.toDataURL('image/jpeg', 0.85));
  };
  img.onerror = reject; img.src = URL.createObjectURL(file);
});

function CreateProfileInner() {
  const router = useRouter();
  const { user, setUser, wallet, connectWallet, walletBusy } = useApp();
  const [avatar, setAvatar] = useState('');
  const [f, setF] = useState({ name: user?.name || '', profession: '', category: '', description: '', portfolioUrl: '', stellarWallet: '', priceXLM: '', priceType: 'fixed', available: true });
  const [tags, setTags] = useState<string[]>([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    const validName = f.name.trim() || user?.name || 'Freelancer Creado';
    const validProfession = f.profession.trim() || 'Desarrollador / Diseñador Freelance';
    const validCategory = f.category || CATEGORIES[0] || 'Diseño';
    const validDesc = f.description.trim() || 'Servicio profesional disponible con pagos en Stellar XLM.';
    const validPrice = Number(f.priceXLM) || 45;
    const rawUrl = f.portfolioUrl.trim() || 'https://behance.net';
    const validUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`;
    const validWallet = f.stellarWallet.trim().toUpperCase() || 'GBMOCKWALLETRANDOM1234567890STELLARNET';
    const validAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

    try {
      const p = await api<Freelancer>('/api/freelancers', {
        method: 'POST',
        body: JSON.stringify({
          name: validName,
          profession: validProfession,
          category: validCategory,
          description: validDesc,
          priceXLM: validPrice,
          priceType: f.priceType || 'fixed',
          portfolioUrl: validUrl,
          stellarWallet: validWallet,
          tags: tags.length ? tags : ['diseño-ux', 'branding'],
          avatar: validAvatar,
          available: f.available
        })
      });
      if (user) setUser({ ...user, profileId: p.id });
      router.push(`/freelancer/${p.id}`);
    } catch (e: any) { setErr(e.message || 'Error al guardar'); } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="card space-y-4 p-6 md:p-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Crea tu perfil</h1>
            <p className="text-xs text-[#99B7FC] mt-0.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#3965FA]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Modo flexible: cualquier dato ingresado es válido
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Link href="/marketplace" className="text-xs font-semibold text-[#3965FA] hover:text-[#99B7FC] hover:underline transition">
              Ir al Marketplace
            </Link>
            <button type="button" onClick={() => { if (user) setUser({ ...user, role: 'client' }); router.push('/marketplace'); }} className="text-[11px] text-[#99B7FC]/70 hover:text-white">
              Cambiar a Cliente
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/20 p-4 hover:border-[#3965FA] transition group">
          {avatar ? (
            <img src={avatar} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-[#3965FA]" />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#3965FA]/20 text-[#3965FA] group-hover:bg-[#3965FA] group-hover:text-white transition">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          )}
          <span className="text-sm font-medium text-[#E9EBFF] group-hover:text-white">{avatar ? 'Cambiar foto de perfil' : 'Agregar foto de perfil'}</span>
          <input type="file" accept="image/*" hidden onChange={async e => { const file = e.target.files?.[0]; if (file) setAvatar(await toAvatar(file)); }} />
        </label>

        <input className="input" placeholder="Nombre completo / artístico" value={f.name} onChange={e => set('name', e.target.value)} />
        <input className="input" placeholder="¿A qué te dedicas? (ej. Diseñadora de marca)" value={f.profession} onChange={e => set('profession', e.target.value)} />
        <select className="input bg-[#1B1B39]" value={f.category} onChange={e => set('category', e.target.value)}>
          <option value="">Categoría (Opcional - por defecto Diseño)</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <div>
          <p className="mb-2 text-xs text-[#99B7FC]">Especialidades (hasta 3)</p>
          <div className="flex flex-wrap gap-2">{INTERESTS.map(i => (
            <button type="button" key={i.id} onClick={() => setTags(t => t.includes(i.id) ? t.filter(x => x !== i.id) : t.length < 3 ? [...t, i.id] : t)} className={`chip ${tags.includes(i.id) ? '!border-[#3965FA] !bg-[#3965FA]/20 !text-white' : ''}`}>{i.id}</button>))}
          </div>
        </div>

        <textarea className="input min-h-[100px]" rows={4} placeholder="Descripción de tu servicio profesional..." value={f.description} onChange={e => set('description', e.target.value)} />
        
        <div className="flex gap-3">
          <input className="input" type="text" placeholder="Precio en XLM (ej. 50)" value={f.priceXLM} onChange={e => set('priceXLM', e.target.value)} />
          <select className="input w-44 bg-[#1B1B39]" value={f.priceType} onChange={e => set('priceType', e.target.value)}>
            <option value="fixed">Precio fijo</option>
            <option value="hour">Por hora</option>
          </select>
        </div>

        <input className="input" type="text" placeholder="Portafolio (ej. behance.net/miperfil)" value={f.portfolioUrl} onChange={e => set('portfolioUrl', e.target.value)} />
        
        <div className="space-y-2">
          <input className="input font-mono text-xs" type="text" placeholder="Wallet Stellar (G… o cualquier dirección)" value={f.stellarWallet} onChange={e => set('stellarWallet', e.target.value.trim().toUpperCase())} />
          {wallet ? (
            <button type="button" className="chip !border-[#3965FA] text-xs text-[#99B7FC]" onClick={() => set('stellarWallet', wallet.address)}>Usar mi wallet conectada</button>
          ) : (
            <button type="button" className="chip text-xs text-[#99B7FC]" disabled={walletBusy} onClick={async () => { await connectWallet(); }}>
              {walletBusy ? 'Conectando…' : 'Conectar Wallet para usar mi dirección'}
            </button>
          )}
        </div>

        <label className="flex items-center gap-2.5 text-sm text-[#E9EBFF] cursor-pointer pt-1">
          <input type="checkbox" checked={f.available} onChange={e => set('available', e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#3965FA] focus:ring-[#3965FA]" />
          <span>Estoy disponible para nuevos trabajos</span>
        </label>

        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn w-full py-3.5 font-bold shadow-lg shadow-[#3965FA]/30" disabled={busy}>
          {busy ? 'Publicando…' : 'Publicar perfil profesional'}
        </button>
      </form>

      <div className="card hidden h-fit p-8 md:block space-y-6 border border-white/10 bg-[#1B1B39]/60 backdrop-blur-xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#99B7FC]/70">Vista previa del perfil</p>
        <div className="flex items-center gap-5">
          {avatar ? (
            <img src={avatar} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-[#3965FA]" />
          ) : (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-[#3965FA]/20 font-bold text-2xl text-[#99B7FC]">
              {(f.name[0] || '?').toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-2xl font-bold text-white">{f.name || 'Tu nombre'}</p>
            <p className="text-sm text-[#99B7FC]">{f.profession || 'Tu profesión'} <span className="font-mono text-xs text-[#99B7FC]/60">· {f.category || 'Categoría'}</span></p>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
              <span className={`h-2 w-2 rounded-full ${f.available ? 'bg-[#8CC63E]' : 'bg-[#6F3432]'}`} />
              <span className={f.available ? 'text-[#8CC63E]' : 'text-muted'}>{f.available ? 'Disponible para contratar' : 'Ocupado actualmente'}</span>
            </p>
          </div>
        </div>
        <p className="text-sm text-[#E9EBFF]/80 leading-relaxed">{f.description || 'La descripción de tus servicios profesionales aparecerá aquí.'}</p>
        <div className="flex items-baseline gap-2 pt-2 border-t border-white/10">
          <span className="font-mono text-4xl font-extrabold text-[#3965FA]">{f.priceXLM || '0'}</span>
          <span className="font-mono text-lg text-[#99B7FC]">XLM{f.priceType === 'hour' ? ' /h' : ''}</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#1B1B39]/80 p-4 font-mono text-xs space-y-1">
          <span className="text-[#99B7FC]/60 block">Dirección Stellar wallet</span>
          <span className="text-[#3965FA] font-medium break-all">{f.stellarWallet || '—'}</span>
        </div>
      </div>
    </div>
  );
}

export default function CreateProfile() { return <RequireAuth role="freelancer"><CreateProfileInner /></RequireAuth>; }
