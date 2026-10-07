'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import LiquidGlassWrapper from '@/components/LiquidGlassWrapper';

type Tile = { t: string; c: string; p: string };
const COLS: Tile[][] = [
  [{ t: 'Diseño de Marca & UX', c: 'Diseño', p: '45 XLM' }, { t: 'Frontend en Next.js', c: 'Desarrollo', p: '15 XLM / h' }, { t: '3D Motion Reel', c: 'Video', p: '80 XLM' }],
  [{ t: 'Copywriting Web3', c: 'Escritura', p: '30 XLM' }, { t: 'Campaña en Meta Ads', c: 'Marketing', p: '60 XLM' }, { t: 'Smart Contract Soroban', c: 'Desarrollo', p: '25 XLM / h' }],
  [{ t: 'Integración Stellar SDK', c: 'Desarrollo', p: '20 XLM / h' }, { t: 'Estrategia SEO Content', c: 'Marketing', p: '40 XLM' }, { t: 'Ilustración Vectorial', c: 'Diseño', p: '35 XLM' }]
];

const TileCard = ({ x }: { x: Tile }) => (
  <div className="w-full overflow-hidden rounded-2xl border border-white/15 bg-[#1B1B39]/80 backdrop-blur-md p-4 shadow-xl hover:border-[#3965FA]/40 transition-all">
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#3965FA]" />
      <span className="font-mono text-[11px] font-semibold text-[#99B7FC] uppercase">{x.c}</span>
    </div>
    <p className="mt-2 font-semibold text-white leading-snug">{x.t}</p>
    <p className="mt-2 text-xs text-[#99B7FC]">Desde <span className="font-mono font-bold text-[#3965FA]">{x.p}</span></p>
  </div>
);

const CATS = [
  { n: 'Diseño & Marca', d: 'Logos, branding, UI/UX e ilustración', span: 'md:col-span-2 md:row-span-2' },
  { n: 'Desarrollo Web3', d: 'Next.js, Soroban y Stellar SDK', span: '' },
  { n: 'Video & Motion', d: 'Edición 3D y piezas publicitarias', span: '' },
  { n: 'Marketing Digital', d: 'Campañas, redes y posicionamiento', span: 'md:col-span-2' },
  { n: 'Escritura & Copy', d: 'Redacción SEO, whitepapers y scripts', span: '' }
];

const POPULAR = ['Diseño de logo', 'Landing page', 'Edición de video', 'Artículo SEO', 'Contrato Soroban'];

export default function Home() {
  const router = useRouter();
  const { user } = useApp();
  const [q, setQ] = useState('');

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace?q=${encodeURIComponent(q)}`);
  };

  return (
    <LiquidGlassWrapper className="space-y-16">
      {/* Portada Hero */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="pointer-events-none absolute -right-32 top-0 h-[600px] w-[600px] rounded-full bg-[#3965FA]/20 blur-[140px]" />
        <div className="relative mx-auto grid min-h-[calc(85vh-4rem)] max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3965FA]/30 bg-[#3965FA]/10 px-3.5 py-1.5 backdrop-blur-md">
              <svg className="w-3.5 h-3.5 text-[#3965FA]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span className="font-mono text-xs font-semibold text-[#99B7FC]">Red Stellar · Pagos Directos P2P</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl">
              Contrata talento freelance con liquidación en <span className="bg-gradient-to-r from-[#3965FA] via-[#99B7FC] to-white bg-clip-text text-transparent">XLM</span>.
            </h1>

            <p className="max-w-lg text-base text-[#99B7FC]/80 leading-relaxed md:text-lg">
              Conecta profesionales verificados. El pago se liquida de wallet a wallet en la red Stellar en ~5 segundos y con 0.00001 XLM de comisión.
            </p>

            <div className="space-y-3 pt-2">
              <form onSubmit={search} className="flex max-w-xl flex-1 overflow-hidden rounded-2xl border border-white/15 bg-[#1B1B39]/90 backdrop-blur-2xl p-1.5 focus-within:border-[#3965FA] shadow-2xl">
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  aria-label="Buscar servicio"
                  placeholder="Ej. «diseño de logo», «desarrollo next.js»"
                  className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#99B7FC]/60 font-sans"
                />
                <button className="btn py-3 px-6 text-xs font-bold shrink-0">
                  Buscar
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#99B7FC]/70 pt-1">
                <span>Populares:</span>
                {POPULAR.map(p => (
                  <Link key={p} href={`/marketplace?q=${encodeURIComponent(p)}`} className="chip text-[11px]">
                    {p}
                  </Link>
                ))}
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
              <div>
                <dt className="text-[#99B7FC]/70">Comisión Red</dt>
                <dd className="font-mono text-base font-bold text-white mt-1">0.00001 XLM</dd>
              </div>
              <div>
                <dt className="text-[#99B7FC]/70">Finalidad Block</dt>
                <dd className="font-mono text-base font-bold text-[#3965FA] mt-1">~5 segundos</dd>
              </div>
              <div>
                <dt className="text-[#99B7FC]/70">Custodia</dt>
                <dd className="font-mono text-base font-bold text-[#8CC63E] mt-1">100% P2P</dd>
              </div>
            </dl>
          </div>

          <div className="relative hidden h-[580px] lg:block" aria-hidden>
            <div className="absolute inset-0 grid grid-cols-3 gap-4 overflow-hidden [transform:rotate(-6deg)_scale(1.05)]" style={{ maskImage: 'linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent)' }}>
              {COLS.map((col, i) => (
                <div key={i} className={i === 1 ? 'col-fall' : 'col-rise'} style={{ animationDuration: `${36 + i * 6}s` }}>
                  <div className="flex flex-col gap-4 pb-4">{[...col, ...col].map((x, j) => <TileCard key={j} x={x} />)}</div>
                  <div className="flex flex-col gap-4">{[...col, ...col].map((x, j) => <TileCard key={j} x={x} />)}</div>
                </div>
              ))}
            </div>

            <div className="pop-in liquid-glass absolute -left-4 bottom-12 flex items-center gap-3.5 rounded-2xl border border-white/15 bg-[#1B1B39]/90 px-5 py-4 shadow-2xl backdrop-blur-2xl"
                 data-config={JSON.stringify({ refraction: 0.7, blurAmount: 0.25, cornerRadius: 16 })}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#3965FA] text-white shadow-lg shadow-[#3965FA]/30">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <div>
                <p className="text-sm font-bold text-white">Pago Verificado en Stellar</p>
                <p className="font-mono text-xs text-[#99B7FC]">Ledger indexado · 4.8s · fee 0.00001 XLM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-xs font-semibold text-[#3965FA] uppercase tracking-wider">Explorar Especialidades</span>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">Categorías de Servicios</h2>
          </div>
          <Link href="/marketplace" className="btn-ghost text-xs w-fit">
            Ver todas las ofertas
            <svg className="w-3.5 h-3.5 text-[#3965FA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        <div className="grid gap-4 md:auto-rows-[160px] md:grid-cols-4">
          {CATS.map((c) => (
            <Link
              key={c.n}
              href={`/marketplace?category=${encodeURIComponent(c.n)}`}
              className={`card-hover liquid-glass group relative flex flex-col justify-end p-6 ${c.span}`}
              data-config={JSON.stringify({ refraction: 0.65, blurAmount: 0.2, cornerRadius: 20 })}
            >
              <div className="absolute top-4 right-4 h-8 w-8 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-[#3965FA] group-hover:bg-[#3965FA] group-hover:text-white transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
              <span className="font-display text-xl font-bold text-white group-hover:text-[#3965FA] transition-colors">{c.n}</span>
              <span className="mt-1 text-xs text-[#99B7FC]/80 leading-relaxed">{c.d}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="border-y border-white/10 bg-[#1B1B39]/50 py-16 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="font-mono text-xs font-semibold text-[#3965FA] uppercase tracking-wider">Flujo Transparente</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">Del clic al pago en tres pasos</h2>
            <p className="mt-4 text-sm text-[#99B7FC]/80 leading-relaxed">
              Los pagos se realizan en la blockchain sin retenciones arbitrarias de intermediarios.
            </p>
          </div>
          <ol className="space-y-6">
            {[
              ['Crea tu cuenta o explora como invitado', 'Elige si contratas talento o publicas proyectos. No requieres perfil bancario.'],
              ['Conecta tu wallet Stellar (Freighter, Albedo, etc.)', 'Conecta tu billetera a la Testnet oficial de Stellar para consultar saldos y autorizar pagos.'],
              ['Contrata y firma la transacción P2P', 'Confirma el monto con la comisión fija de 0.00001 XLM y obtén tu hash de verificación on-chain.']
            ].map(([t, d], i) => (
              <li key={t} className="card liquid-glass p-6 flex gap-4 items-start" data-config={JSON.stringify({ refraction: 0.5, blurAmount: 0.15, cornerRadius: 20 })}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#3965FA]/20 border border-[#3965FA]/40 font-mono text-sm font-bold text-[#3965FA]">{i + 1}</span>
                <div>
                  <p className="text-base font-bold text-white">{t}</p>
                  <p className="mt-1 text-xs text-[#99B7FC]/80 leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sección Pitch de Stellar en el MVP */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="card liquid-glass p-8 md:p-12 border-[#3965FA]/40 bg-[#1B1B39]/80 shadow-2xl backdrop-blur-2xl"
             data-config={JSON.stringify({ refraction: 0.75, blurAmount: 0.25, cornerRadius: 24 })}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3965FA]/20 border border-[#3965FA]/40 px-3 py-1 font-mono text-xs font-semibold text-[#3965FA]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                Stellar Blockchain Architecture
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white">¿Dónde entra la Red Stellar en este MVP?</h2>
            </div>
            <span className="font-mono text-xs text-[#99B7FC]">Testnet & Mainnet Ready</span>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-5 space-y-2 border-white/10 bg-[#1B1B39]/60">
              <span className="font-mono text-2xl font-extrabold text-[#3965FA]">01</span>
              <h3 className="font-bold text-white">Stellar Wallets Kit</h3>
              <p className="text-xs text-[#99B7FC]/80 leading-relaxed">Soporte multiconexión para Freighter, Albedo, xBull y Rabet sin custodiar claves privadas.</p>
            </div>
            <div className="card p-5 space-y-2 border-white/10 bg-[#1B1B39]/60">
              <span className="font-mono text-2xl font-extrabold text-[#3965FA]">02</span>
              <h3 className="font-bold text-white">Pagos P2P en XLM</h3>
              <p className="text-xs text-[#99B7FC]/80 leading-relaxed">Envío directo de fondos a la clave pública del freelancer (`G...`) con comisión de 0.00001 XLM.</p>
            </div>
            <div className="card p-5 space-y-2 border-white/10 bg-[#1B1B39]/60">
              <span className="font-mono text-2xl font-extrabold text-[#3965FA]">03</span>
              <h3 className="font-bold text-white">Friendbot Testnet</h3>
              <p className="text-xs text-[#99B7FC]/80 leading-relaxed">Integración con el Faucet oficial de Stellar para inyectar 10,000 XLM de prueba en 1 clic.</p>
            </div>
            <div className="card p-5 space-y-2 border-white/10 bg-[#1B1B39]/60">
              <span className="font-mono text-2xl font-extrabold text-[#3965FA]">04</span>
              <h3 className="font-bold text-white">Verificación Horizon</h3>
              <p className="text-xs text-[#99B7FC]/80 leading-relaxed">Auditoría on-chain en el explorador `stellar.expert` con hashes de transacción indexados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doble entrada */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-2">
        <Link href="/register?role=client" className="card-hover liquid-glass p-8 space-y-4" data-config={JSON.stringify({ refraction: 0.6, blurAmount: 0.2, cornerRadius: 20 })}>
          <div className="h-10 w-10 rounded-xl bg-[#3965FA]/20 border border-[#3965FA]/40 flex items-center justify-center text-[#3965FA]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Quiero contratar</h3>
            <p className="mt-1 text-sm text-[#99B7FC]/80 leading-relaxed">Explora talento verificado y contrata servicios con pagos en XLM.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3965FA] group-hover:underline">
            Crear cuenta de cliente →
          </span>
        </Link>

        <Link href="/register?role=freelancer" className="card-hover liquid-glass p-8 space-y-4" data-config={JSON.stringify({ refraction: 0.6, blurAmount: 0.2, cornerRadius: 20 })}>
          <div className="h-10 w-10 rounded-xl bg-[#8CC63E]/20 border border-[#8CC63E]/40 flex items-center justify-center text-[#8CC63E]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Quiero ofrecer mis servicios</h3>
            <p className="mt-1 text-sm text-[#99B7FC]/80 leading-relaxed">Publica tu perfil profesional y recibe pagos directo a tu wallet.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8CC63E] group-hover:underline">
            Crear cuenta de freelancer →
          </span>
        </Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#99B7FC]/60 font-sans">
        StellarWork · Marketplace Profesional sobre la Red Stellar
      </footer>
    </LiquidGlassWrapper>
  );
}
