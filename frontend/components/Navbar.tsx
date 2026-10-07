'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { NETWORK, NETWORK_LABEL } from '@/lib/stellar';

const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

function useOutside(close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [close]);
  return ref;
}

export default function Navbar() {
  const path = usePathname();
  const { ready, user, logout, wallet, walletBusy, walletError, connectWallet, disconnectWallet, refreshWallet, fundWallet, clearWalletError } = useApp();
  const [menu, setMenu] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const menuRef = useOutside(() => setMenu(false));
  const walletRef = useOutside(() => { setWalletOpen(false); clearWalletError(); });

  if (path === '/register') return null; // el acceso es una escena a pantalla completa

  const acct = !user ? null : user.role === 'client' ? { href: '/preferences', label: 'Mis intereses' } : user.profileId ? { href: `/freelancer/${user.profileId}`, label: 'Mi perfil' } : { href: '/profile/create', label: 'Crear perfil' };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-mono text-lg font-bold text-bg">✦</span>
            <span className="font-display text-lg font-semibold tracking-tight">Stellar<span className="text-brand">Work</span></span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <Link href="/marketplace" className="hover:text-brand">Marketplace</Link>
            {user && !user.isGuest && acct && <Link href={acct.href} className="hover:text-brand">{acct.label}</Link>}
            <Link href="/#categorias" className="hover:text-brand">Categorías</Link>
            <Link href="/#como-funciona" className="hover:text-brand">Cómo funciona</Link>
          </nav>
        </div>

        {!ready ? <div className="h-9 w-40" /> : !user ? (
          <div className="flex items-center gap-2">
            <Link href="/marketplace" className="btn-ghost text-xs text-brand font-medium hidden sm:inline-flex">✦ Entrar como invitado</Link>
            <Link href="/register?mode=login" className="btn-ghost">Iniciar sesión</Link>
            <Link href="/register" className="btn">Registrarme</Link>
          </div>
        ) : user.isGuest ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs text-brand font-medium">✦ Modo Invitado</span>
            <Link href="/register" className="btn text-xs">Crear cuenta</Link>
            <button onClick={async () => await logout()} className="btn-ghost text-xs text-muted">Salir</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* La wallet solo existe para quien ya inició sesión */}
            <div className="relative" ref={walletRef}>
              {wallet ? (
                <button className="btn-ghost gap-2 font-mono" onClick={() => { setWalletOpen(o => !o); if (!walletOpen) refreshWallet(); }}>
                  <span className={`h-2 w-2 rounded-full ${wallet.funded ? 'bg-brand' : 'bg-amber-400'}`} />{wallet.balance.toFixed(2)} XLM
                </button>
              ) : (
                <button className="btn" disabled={walletBusy} onClick={async () => { if (!(await connectWallet())) setWalletOpen(true); }}>
                  {walletBusy ? 'Conectando…' : 'Conectar wallet'}
                </button>
              )}
              {walletOpen && (
                <div className="card absolute right-0 mt-2 w-72 space-y-3 p-4 text-sm shadow-xl">
                  {walletError && <p className="text-red-400">{walletError}{walletError.includes('freighter.app') && <> <a className="underline" href="https://www.freighter.app" target="_blank" rel="noopener noreferrer">Abrir sitio</a></>}</p>}
                  {wallet && (<>
                    <div className="flex items-center justify-between"><p className="text-xs text-muted">Wallet conectada</p><span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted">{NETWORK_LABEL}</span></div>
                    <button className="font-mono hover:text-brand" title="Copiar dirección" onClick={() => navigator.clipboard?.writeText(wallet.address)}>{short(wallet.address)}</button>
                    <p className="font-mono text-xs text-muted">Disponible para gastar: {wallet.spendable.toFixed(2)} XLM</p>
                    {!wallet.funded && <p className="text-xs text-amber-400">Esta cuenta aún no existe en {NETWORK_LABEL}. Necesita recibir XLM para activarse.</p>}
                    {!wallet.funded && NETWORK === 'TESTNET' && <button className="btn w-full" disabled={walletBusy} onClick={fundWallet}>{walletBusy ? 'Fondeando…' : 'Fondear con friendbot'}</button>}
                    <button className="btn-ghost w-full" onClick={() => { disconnectWallet(); setWalletOpen(false); }}>Desconectar</button>
                  </>)}
                </div>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel font-mono text-sm text-brand hover:border-brand/60" onClick={() => setMenu(o => !o)} aria-label="Menú de cuenta">{(user?.name?.[0] || 'U').toUpperCase()}</button>
              {menu && (
                <div className="card absolute right-0 mt-2 w-52 overflow-hidden p-1 shadow-xl">
                  <div className="px-3 py-2"><p className="truncate text-sm font-medium">{user?.name || 'Usuario'}</p><p className="text-xs text-muted">{user?.role === 'client' ? 'Cliente' : 'Freelancer'}</p></div>
                  <button onClick={async () => { setMenu(false); await logout(); }} className="block w-full rounded-md border-t border-line px-3 py-2 text-left text-sm text-slate-300 hover:bg-line hover:text-red-400">Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
