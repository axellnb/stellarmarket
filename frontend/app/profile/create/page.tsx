'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CATEGORIES, Freelancer, INTERESTS } from '@/lib/types';
import { useApp } from '@/lib/AppContext';
import RequireAuth from '@/components/RequireAuth';

// Recorta a cuadrado 256px y comprime a JPEG
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
    try {
      const p = await api<Freelancer>('/api/freelancers', { method: 'POST', body: JSON.stringify({ ...f, priceXLM: Number(f.priceXLM), tags, avatar, }) });
      if (user) setUser({ ...user, profileId: p.id }); router.push(`/freelancer/${p.id}`);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[400px_1fr]">
      <form onSubmit={submit} className="card space-y-3 p-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h1 className="text-xl font-semibold">Crea tu perfil</h1>
            <p className="text-xs text-muted">Ofrece tus servicios en el marketplace</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Link href="/marketplace" className="text-xs font-semibold text-brand hover:underline">
              ✦ Ir al Marketplace
            </Link>
            <button type="button" onClick={() => { if (user) setUser({ ...user, role: 'client' }); router.push('/marketplace'); }} className="text-[11px] text-muted hover:text-slate-200">
              Cambiar a Cliente
            </button>
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-line p-3 hover:border-brand">
          {avatar ? <img src={avatar} alt="" className="h-16 w-16 rounded-full object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-full bg-line text-2xl">📷</span>}
          <span className="text-sm">{avatar ? 'Cambiar foto' : 'Agregar foto de perfil'}</span>
          <input type="file" accept="image/*" hidden onChange={async e => { const file = e.target.files?.[0]; if (file) setAvatar(await toAvatar(file)); }} />
        </label>
        <input className="input" required placeholder="Nombre completo / artístico" value={f.name} onChange={e => set('name', e.target.value)} />
        <input className="input" required placeholder="¿A qué te dedicas? (ej. Diseñadora de marca)" value={f.profession} onChange={e => set('profession', e.target.value)} />
        <select className="input" required value={f.category} onChange={e => set('category', e.target.value)}>
          <option value="">Categoría</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div>
          <p className="mb-2 text-xs text-muted">Especialidades (hasta 3)</p>
          <div className="flex flex-wrap gap-2">{INTERESTS.map(i => (
            <button type="button" key={i.id} onClick={() => setTags(t => t.includes(i.id) ? t.filter(x => x !== i.id) : t.length < 3 ? [...t, i.id] : t)} className={`chip ${tags.includes(i.id) ? '!border-brand !text-brand' : ''}`}>{i.id}</button>))}
          </div>
        </div>
        <textarea className="input" required rows={4} placeholder="Descripción de tu servicio" value={f.description} onChange={e => set('description', e.target.value)} />
        <div className="flex gap-2">
          <input className="input" required type="number" min={1} placeholder="Precio en XLM" value={f.priceXLM} onChange={e => set('priceXLM', e.target.value)} />
          <select className="input w-40" value={f.priceType} onChange={e => set('priceType', e.target.value)}><option value="fixed">Precio fijo</option><option value="hour">Por hora</option></select>
        </div>
        <input className="input" required type="url" placeholder="Portafolio (Behance, GitHub, Drive…)" value={f.portfolioUrl} onChange={e => set('portfolioUrl', e.target.value)} />
        <div className="space-y-2">
          <input className="input font-mono" required placeholder="Wallet Stellar (G…, 56 caracteres)" value={f.stellarWallet} onChange={e => set('stellarWallet', e.target.value.trim().toUpperCase())} />
          {wallet ? <button type="button" className="chip" onClick={() => set('stellarWallet', wallet.address)}>Usar mi wallet conectada</button>
            : <button type="button" className="chip" disabled={walletBusy} onClick={async () => { await connectWallet(); }}>{walletBusy ? 'Conectando…' : 'Conectar Freighter para usar mi dirección'}</button>}
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.available} onChange={e => set('available', e.target.checked)} className="accent-[#3ee6a0]" /> Estoy disponible para nuevos trabajos</label>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? 'Publicando…' : 'Publicar perfil'}</button>
      </form>

      <div className="card hidden h-fit p-8 md:block">
        <p className="mb-5 font-mono text-xs text-muted">vista previa</p>
        <div className="flex items-center gap-5">
          {avatar ? <img src={avatar} alt="" className="h-24 w-24 rounded-full object-cover" /> : <span className="grid h-24 w-24 place-items-center rounded-full bg-line text-3xl text-muted">{(f.name[0] || '?').toUpperCase()}</span>}
          <div>
            <p className="text-3xl font-semibold">{f.name || 'Tu nombre'}</p>
            <p className="text-slate-400">{f.profession || 'Tu profesión'} <span className="font-mono text-sm text-muted">· {f.category || 'Categoría'}</span></p>
            <p className={`mt-2 font-mono text-xs ${f.available ? 'text-brand' : 'text-muted'}`}>● {f.available ? 'Disponible' : 'Ocupado'}</p>
          </div>
        </div>
        <p className="mt-6 text-slate-400">{f.description || 'La descripción aparecerá aquí.'}</p>
        <p className="mt-6 font-mono text-4xl text-brand">{f.priceXLM || '0'} <span className="text-xl">XLM{f.priceType === 'hour' ? ' /h' : ''}</span></p>
        <p className="mt-6 break-all rounded-lg border border-line bg-bg px-4 py-3 font-mono text-xs"><span className="text-muted">wallet › </span><span className="text-brand">{f.stellarWallet || '—'}</span></p>
      </div>
    </div>
  );
}

export default function CreateProfile() { return <RequireAuth role="freelancer"><CreateProfileInner /></RequireAuth>; }
