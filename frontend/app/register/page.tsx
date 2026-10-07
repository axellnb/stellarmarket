'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Role, useApp, User } from '@/lib/AppContext';
import Cosmos, { Side } from '@/components/Cosmos';

const ROLES: Record<Role, { title: string; line: string; detail: string; accent: string }> = {
  client: { title: 'Soy cliente', line: 'Busco talento para mi proyecto', detail: 'Explora perfiles, elige un servicio y paga desde tu wallet.', accent: '#3965FA' },
  freelancer: { title: 'Soy freelancer', line: 'Ofrezco mis servicios', detail: 'Publica tu perfil y cobra en XLM directo a tu wallet.', accent: '#99B7FC' }
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
    if (next && next !== '/profile/create') return next;
    return u.role === 'freelancer' ? '/profile/create' : '/marketplace';
  };
  
  useEffect(() => {
    if (ready && user && !warp && !sp.get('mode') && !sp.get('role')) {
      router.replace(dest(user));
    }
  }, [ready, user]); // eslint-disable-line

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
    const rawNext = safeNext(sp.get('next'));
    const next = (rawNext && rawNext !== '/profile/create') ? rawNext : '/marketplace';
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
      const cleanEmail = email.trim().toLowerCase() || (role === 'client' ? 'cliente@stellarwork.app' : 'freelancer@stellarwork.app');
      const derivedName = name.trim() || cleanEmail.split('@')[0] || (role === 'client' ? 'Cliente Demo' : 'Freelancer Demo');
      u = {
        name: derivedName,
        email: cleanEmail,
        role,
        prefs: []
      };
      sessionToken = 'test-token-' + Date.now();
    }
    setWarp(true);
    setTimeout(() => { setUser({ ...u!, token: sessionToken }); router.push(dest(u!)); }, 800);
  };

  const focus: Side = role || hover;
  const A = role ? ROLES[role].accent : '#3965FA';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1B1B39] font-sans text-[#E9EBFF]">
      <Cosmos focus={focus} locked={!!role} warp={warp} />
      <Link href="/" className="absolute left-6 top-6 z-20 flex items-center gap-2.5 group">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3965FA] text-white shadow-lg shadow-[#3965FA]/30 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-white">Stellar<span className="text-[#99B7FC]">Market</span></span>
      </Link>

      {!role ? (
        <div className="relative z-10 flex min-h-screen flex-col">
          <h1 className="px-6 pt-28 text-center font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            ¿Cómo vas a usar <span className="bg-gradient-to-r from-[#99B7FC] via-white to-[#3965FA] bg-clip-text text-transparent">StellarMarket</span>?
          </h1>
          <div className="mt-8 flex flex-1 flex-col md:mt-10">
            <div className="grid flex-1 md:[grid-template-columns:var(--cols)] [grid-template-rows:var(--rows)] md:[grid-template-rows:none] transition-all duration-700"
              style={{ ['--cols' as any]: hover === 'client' ? '1.3fr 0.7fr' : hover === 'freelancer' ? '0.7fr 1.3fr' : '1fr 1fr', ['--rows' as any]: hover === 'client' ? '1.3fr 0.7fr' : hover === 'freelancer' ? '0.7fr 1.3fr' : '1fr 1fr' }}>
              {(['client', 'freelancer'] as const).map((r, i) => (
                <button key={r} onClick={() => setRole(r)} onMouseEnter={() => setHover(r)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(r)} onBlur={() => setHover(null)}
                  className={`group relative flex flex-col justify-end p-8 text-left outline-none md:p-14 ${i === 1 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}>
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ background: `radial-gradient(60% 60% at ${i === 0 ? '30%' : '70%'} 60%, ${ROLES[r].accent}22, transparent)` }} />
                  <span className="relative font-display text-4xl font-extrabold tracking-tight text-white transition-transform duration-500 group-hover:-translate-y-1 md:text-6xl">{ROLES[r].title}</span>
                  <span className="relative mt-2 text-lg font-semibold" style={{ color: ROLES[r].accent }}>{ROLES[r].line}</span>
                  <span className="relative mt-3 max-w-sm text-sm text-[#99B7FC]/80 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">{ROLES[r].detail}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center pb-8 gap-3">
            <p className="text-sm text-[#99B7FC]/70">¿Ya tienes cuenta? Elige tu rol y pulsa «Iniciar sesión».</p>
            <button type="button" onClick={enterAsGuest} className="btn-ghost flex items-center gap-2 rounded-full border border-[#3965FA]/40 bg-[#1B1B39]/80 px-6 py-2.5 text-sm font-medium text-[#99B7FC] hover:bg-[#3965FA] hover:text-white transition backdrop-blur-md">
              <svg className="w-4 h-4 text-[#3965FA] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Entrar como invitado (Explorar Marketplace)
            </button>
          </div>
        </div>
      ) : (
        <div className={`relative z-10 grid min-h-screen place-items-center px-4 transition-opacity duration-500 ${warp ? 'opacity-0' : 'opacity-100'}`}>
          <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl border border-white/15 bg-[#1B1B39]/80 p-8 shadow-2xl backdrop-blur-2xl" style={{ boxShadow: `0 0 80px -20px ${A}44` }}>
            <div>
              <p className="font-display text-2xl font-bold text-white">{ROLES[role].title}</p>
              <button type="button" onClick={() => { setRole(null); setErr(''); }} className="mt-1 text-xs text-[#99B7FC] hover:underline">Cambiar de rol</button>
            </div>
            <div className="flex gap-2" role="tablist">
              {(['register', 'login'] as const).map(m => (
                <button type="button" role="tab" aria-selected={mode === m} key={m} onClick={() => { setMode(m); setErr(''); }}
                  className={`chip ${mode === m ? '!border-[#3965FA] !bg-[#3965FA]/20 !text-white' : ''}`}>{m === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</button>
              ))}
            </div>
            {mode === 'register' && <input className="input" autoFocus placeholder="Nombre (ej. María González)" value={name} onChange={e => setName(e.target.value)} />}
            <input className="input" type="text" autoFocus={mode === 'login'} placeholder="Correo o usuario (ej. maria@stellarwork.app)" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Contraseña (opcional para prueba)" value={password} onChange={e => setPassword(e.target.value)} />
            {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
            <button className="btn w-full py-3.5 text-sm font-bold shadow-lg shadow-[#3965FA]/30" style={{ background: A, color: '#FFFFFF' }} disabled={busy}>
              {busy ? 'Entrando…' : mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
            <div className="pt-3 border-t border-white/10 text-center">
              <button type="button" onClick={enterAsGuest} className="text-xs font-medium text-[#99B7FC] hover:underline">
                Entrar como invitado (sin crear perfil)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Register() { return <Suspense fallback={<div className="min-h-screen bg-[#1B1B39]" />}><Access /></Suspense>; }
