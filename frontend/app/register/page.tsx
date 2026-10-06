'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Role, useApp, User } from '@/lib/AppContext';
import Cosmos, { Side } from '@/components/Cosmos';

const ROLES: Record<Role, { title: string; line: string; detail: string; accent: string }> = {
  client: { title: 'Soy cliente', line: 'Busco talento para mi proyecto', detail: 'Explora perfiles, elige un servicio y paga desde tu wallet.', accent: '#7dc4ff' },
  freelancer: { title: 'Soy freelancer', line: 'Ofrezco mis servicios', detail: 'Publica tu perfil y cobra en XLM directo a tu wallet.', accent: '#3ee6a0' }
};
const safeNext = (n: string | null) => (n && n.startsWith('/') && !n.startsWith('//') ? n : '');

function Access() {
  const router = useRouter();
  const sp = useSearchParams();
  const { ready, user, setUser } = useApp();
  const [role, setRole] = useState<Role | null>((['client', 'freelancer'] as const).find(r => r === sp.get('role')) || null);
  const [hover, setHover] = useState<Role | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>(sp.get('mode') === 'login' ? 'login' : 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [warp, setWarp] = useState(false);

  const dest = (u: User) => {
    const next = safeNext(sp.get('next'));
    if (next) return next;
    return u.role === 'client' ? (u.prefs?.length ? '/marketplace' : '/preferences') : u.profileId ? `/freelancer/${u.profileId}` : '/profile/create';
  };
  // Si ya hay sesión, no tiene sentido mostrar el acceso
  useEffect(() => { if (ready && user && !warp) router.replace(dest(user)); }, [ready, user]); // eslint-disable-line

  const enterAsGuest = () => {
    const guestUser: User = {
      name: 'Invitado',
      email: 'invitado@stellarwork.app',
      role: 'client',
      isGuest: true,
      token: 'guest-token-' + Date.now(),
      prefs: []
    };
    setUser(guestUser);
    const next = safeNext(sp.get('next')) || '/marketplace';
    router.push(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!role) return;
    setErr(''); setBusy(true);
    let sessionToken = '';
    let u: User | null = null;
    try {
      const res = await api<{ token: string; user: User }>('/api/auth', { method: 'POST', body: JSON.stringify({ name, email, password, role, mode }) });
      sessionToken = res.token;
      u = res.user;
    } catch {
      // Modo de prueba: si falla el servidor o es usuario nuevo, permitir ingresar con cualquier correo y contraseña
      const cleanEmail = email.trim().toLowerCase();
      const derivedName = name.trim() || cleanEmail.split('@')[0] || 'Usuario Test';
      u = {
        name: derivedName,
        email: cleanEmail,
        role,
        prefs: []
      };
      sessionToken = 'test-token-' + Date.now();
    }
    setWarp(true);                       // salto al hiperespacio antes de entrar
    setTimeout(() => { setUser({ ...u!, token: sessionToken }); router.push(dest(u!)); }, 800);
  };

  const focus: Side = role || hover;
  const A = role ? ROLES[role].accent : '#3ee6a0';

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <Cosmos focus={focus} locked={!!role} warp={warp} />
      <Link href="/" className="absolute left-5 top-5 z-20 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-mono text-lg font-bold text-bg">✦</span>
        <span className="font-display text-lg font-semibold tracking-tight">Stellar<span className="text-brand">Work</span></span>
      </Link>

      {!role ? (
        <div className="relative z-10 flex min-h-screen flex-col">
          <h1 className="px-6 pt-24 text-center font-display text-3xl font-semibold tracking-tight md:text-5xl">¿Cómo vas a usar StellarWork?</h1>
          <div className="mt-8 flex flex-1 flex-col md:mt-10">
            <div className="grid flex-1 md:[grid-template-columns:var(--cols)] [grid-template-rows:var(--rows)] md:[grid-template-rows:none] transition-all duration-700"
              style={{ ['--cols' as any]: hover === 'client' ? '1.3fr 0.7fr' : hover === 'freelancer' ? '0.7fr 1.3fr' : '1fr 1fr', ['--rows' as any]: hover === 'client' ? '1.3fr 0.7fr' : hover === 'freelancer' ? '0.7fr 1.3fr' : '1fr 1fr' }}>
              {(['client', 'freelancer'] as const).map((r, i) => (
                <button key={r} onClick={() => setRole(r)} onMouseEnter={() => setHover(r)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(r)} onBlur={() => setHover(null)}
                  className={`group relative flex flex-col justify-end p-8 text-left outline-none md:p-14 ${i === 1 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}>
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ background: `radial-gradient(60% 60% at ${i === 0 ? '30%' : '70%'} 60%, ${ROLES[r].accent}1f, transparent)` }} />
                  <span className="relative font-display text-4xl font-semibold tracking-tight transition-transform duration-500 group-hover:-translate-y-1 md:text-6xl">{ROLES[r].title}</span>
                  <span className="relative mt-2 text-lg" style={{ color: ROLES[r].accent }}>{ROLES[r].line}</span>
                  <span className="relative mt-3 max-w-sm text-sm text-slate-400 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">{ROLES[r].detail}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center pb-8 gap-2">
            <p className="text-sm text-muted">¿Ya tienes cuenta? Elige tu rol y pulsa «Iniciar sesión».</p>
            <button type="button" onClick={enterAsGuest} className="mt-1 rounded-full border border-brand/50 bg-panel/80 px-6 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-bg">
              ✦ Entrar como invitado (Explorar Marketplace)
            </button>
          </div>
        </div>
      ) : (
        <div className={`relative z-10 grid min-h-screen place-items-center px-4 transition-opacity duration-500 ${warp ? 'opacity-0' : 'opacity-100'}`}>
          <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border bg-bg/70 p-7 shadow-2xl backdrop-blur-xl" style={{ borderColor: `${A}55`, boxShadow: `0 0 80px -20px ${A}55` }}>
            <div>
              <p className="font-display text-2xl font-semibold">{ROLES[role].title}</p>
              <button type="button" onClick={() => { setRole(null); setErr(''); }} className="text-sm text-muted underline-offset-4 hover:underline">Cambiar de rol</button>
            </div>
            <div className="flex gap-2" role="tablist">
              {(['register', 'login'] as const).map(m => (
                <button type="button" role="tab" aria-selected={mode === m} key={m} onClick={() => { setMode(m); setErr(''); }}
                  className="chip" style={mode === m ? { borderColor: A, color: A } : undefined}>{m === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</button>
              ))}
            </div>
            {mode === 'register' && <input className="input" required autoFocus placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />}
            <input className="input" required type="email" autoFocus={mode === 'login'} placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Contraseña (opcional para prueba)" value={password} onChange={e => setPassword(e.target.value)} />
            {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
            <button className="w-full rounded-lg py-3 text-sm font-semibold text-bg transition hover:brightness-110 disabled:opacity-50" style={{ background: A }} disabled={busy}>
              {busy ? 'Entrando…' : mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
            <div className="pt-2 border-t border-line text-center">
              <button type="button" onClick={enterAsGuest} className="text-xs font-semibold text-brand hover:underline">
                ✦ Entrar como invitado (sin crear perfil)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Register() { return <Suspense fallback={<div className="min-h-screen" />}><Access /></Suspense>; }
