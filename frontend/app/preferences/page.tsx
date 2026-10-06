'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { INTERESTS } from '@/lib/types';
import { useApp, User } from '@/lib/AppContext';
import RequireAuth from '@/components/RequireAuth';

function PreferencesInner() {
  const router = useRouter();
  const { user, setUser } = useApp();
  const [sel, setSel] = useState<string[]>([]);
  useEffect(() => { if (user?.prefs) setSel(user.prefs); }, [user]);


  const toggle = (id: string) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const save = async () => {
    if (!user) return;
    try { const u = await api<User>('/api/preferences', { method: 'POST', body: JSON.stringify({ prefs: sel }) }); setUser({ ...user, prefs: u.prefs }); }
    catch { setUser({ ...user, prefs: sel }); }
    router.push('/marketplace');
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">¿Qué te interesa{user ? `, ${user.name.split(' ')[0]}` : ''}?</h1>
        <p className="mt-2 text-muted">Elige al menos 3 temas y personalizaremos tu marketplace.</p>
      </div>
      <div className="columns-2 gap-4 md:columns-4">
        {INTERESTS.map(i => {
          const on = sel.includes(i.id);
          return (
            <button key={i.id} onClick={() => toggle(i.id)} style={{ background: `linear-gradient(135deg, ${i.from}, ${i.to})` }}
              className={`relative mb-4 flex w-full break-inside-avoid flex-col justify-between rounded-2xl p-4 text-left text-white transition hover:scale-[1.02] ${i.h} ${on ? 'ring-4 ring-white' : 'opacity-80'}`}>
              <span className="text-3xl">{i.emoji}</span>
              <span className="font-semibold drop-shadow">{i.id}</span>
              {on && <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-white text-sm text-black">✓</span>}
            </button>
          );
        })}
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/90 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-mono text-sm text-muted">{sel.length} seleccionados</span>
          <button className="btn" disabled={sel.length < 3} onClick={save}>Guardar y ver mi marketplace</button>
        </div>
      </div>
    </div>
  );
}

export default function Preferences() { return <RequireAuth role="client"><PreferencesInner /></RequireAuth>; }
