'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { NETWORK, NETWORK_LABEL } from '@/lib/stellar';
import { useXlmPrice } from '@/lib/useXlmPrice';

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
  const { rate, convertXlmToUsd } = useXlmPrice();
  const [menu, setMenu] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const menuRef = useOutside(() => setMenu(false));
  const walletRef = useOutside(() => { setWalletOpen(false); clearWalletError(); });

  if (path === '/register') return null;

  const acct = !user ? null : user.role === 'client' ? { href: '/preferences', label: 'Mis intereses' } : user.profileId ? { href: `/freelancer/${user.profileId}`, label: 'Mi perfil' } : { href: '/profile/create', label: 'Crear perfil' };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1B1B39]/90 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3965FA] text-white shadow-lg shadow-[#3965FA]/30 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white">Stellar<span className="text-[#3965FA]">Work</span></span>
          </Link>

          {/* Live XLM to USD Ticker Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-mono backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#8CC63E] animate-pulse" />
            <span className="text-white font-bold">1 XLM</span>
            <span className="text-[#99B7FC]">= ${rate.toFixed(3)} USD</span>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#99B7FC] md:flex">
            <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            {user && !user.isGuest && acct && <Link href={acct.href} className="hover:text-white transition-colors">{acct.label}</Link>}
            <Link href="/#categorias" className="hover:text-white transition-colors">Categorías</Link>
            <Link href="/#como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link>
          </nav>
        </div>

        {!ready ? <div className="h-9 w-40" /> : !user ? (
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="btn-ghost text-xs text-[#99B7FC] font-medium hidden sm:inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#3965FA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              Entrar como invitado
            </Link>
            <Link href="/register?mode=login" className="btn-ghost">Iniciar sesión</Link>
            <Link href="/register" className="btn">Registrarme</Link>
          </div>
        ) : user.isGuest ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3965FA]/30 bg-[#3965FA]/10 px-3 py-1 text-xs font-semibold text-[#99B7FC]">
              <svg className="w-3.5 h-3.5 text-[#3965FA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Modo Invitado
            </span>
            <Link href="/register" className="btn text-xs py-2">Crear cuenta</Link>
            <button onClick={async () => await logout()} className="btn-ghost text-xs text-[#99B7FC] py-2">Salir</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative" ref={walletRef}>
              {wallet ? (
                <button className="btn-ghost gap-2 font-mono text-xs" onClick={() => { setWalletOpen(o => !o); if (!walletOpen) refreshWallet(); }}>
                  <span className={`h-2 w-2 rounded-full ${wallet.funded ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{wallet.balance.toFixed(2)} XLM</span>
                  <span className="text-[#99B7FC] font-normal">({convertXlmToUsd(wallet.balance)})</span>
                </button>
              ) : (
                <button className="btn" disabled={walletBusy} onClick={async () => { if (!(await connectWallet())) setWalletOpen(true); }}>
                  {walletBusy ? 'Conectando…' : 'Conectar wallet'}
                </button>
              )}
              {walletOpen && (
                <div className="card absolute right-0 mt-2 w-80 space-y-3 p-5 text-sm shadow-2xl z-50 border-white/15 bg-[#1B1B39]/95 backdrop-blur-2xl">
                  {walletError && <p className="text-red-400 text-xs">{walletError}{walletError.includes('freighter.app') && <> <a className="underline" href="https://www.freighter.app" target="_blank" rel="noopener noreferrer">Abrir sitio</a></>}</p>}
                  {wallet && (<>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <p className="text-xs text-[#99B7FC] font-semibold">Wallet conectada</p>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-[#99B7FC]">{NETWORK_LABEL}</span>
                    </div>
                    <button className="font-mono text-xs hover:text-[#3965FA] text-left break-all text-white" title="Copiar dirección" onClick={() => navigator.clipboard?.writeText(wallet.address)}>{short(wallet.address)}</button>
                    <div className="space-y-1 font-mono text-xs bg-[#1B1B39] p-3 rounded-xl border border-white/10">
                      <p className="text-[#99B7FC]/70">Saldo disponible</p>
                      <p className="text-white font-bold text-sm">{wallet.spendable.toFixed(2)} XLM</p>
                      <p className="text-[#3965FA] font-medium">{convertXlmToUsd(wallet.spendable)}</p>
                    </div>
                    {!wallet.funded && <p className="text-xs text-amber-400">Esta cuenta aún no existe en {NETWORK_LABEL}. Requiere fondos.</p>}
                    {!wallet.funded && NETWORK === 'TESTNET' && <button className="btn w-full text-xs py-2.5 font-bold" disabled={walletBusy} onClick={fundWallet}>{walletBusy ? 'Fondeando…' : 'Fondear con friendbot'}</button>}
                    <button className="btn-ghost w-full text-xs py-2" onClick={() => { disconnectWallet(); setWalletOpen(false); }}>Desconectar</button>
                  </>)}
                </div>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-[#1B1B39] font-mono text-sm font-bold text-[#3965FA] hover:border-[#3965FA]/50 transition-all shadow-md" onClick={() => setMenu(o => !o)} aria-label="Menú de cuenta">{(user?.name?.[0] || 'U').toUpperCase()}</button>
              {menu && (
                <div className="card absolute right-0 mt-2 w-52 overflow-hidden p-1.5 shadow-2xl z-50 border-white/15 bg-[#1B1B39]/95 backdrop-blur-2xl">
                  <div className="px-3 py-2.5 border-b border-white/10"><p className="truncate text-sm font-bold text-white">{user?.name || 'Usuario'}</p><p className="text-xs text-[#99B7FC]">{user?.role === 'client' ? 'Cliente' : 'Freelancer'}</p></div>
                  <button onClick={async () => { setMenu(false); await logout(); }} className="block w-full rounded-lg mt-1 px-3 py-2 text-left text-xs font-semibold text-[#99B7FC] hover:bg-white/5 hover:text-red-400 transition-colors">Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
