'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';

// Servicios de ejemplo (no son perfiles): muestran el tipo de trabajo que se contrata.
type Tile = { t: string; c: string; p: string; a: string; b: string; art: 0 | 1 | 2 | 3 };
const COLS: Tile[][] = [
  [{ t: 'Logo y manual de marca', c: 'Diseño', p: '45 XLM', a: '#3ee6a0', b: '#0b6b4a', art: 0 }, { t: 'Landing page en Next.js', c: 'Desarrollo', p: '12 XLM / h', a: '#60a5fa', b: '#1e3a8a', art: 2 }, { t: 'Reel de 30 segundos', c: 'Video', p: '80 XLM', a: '#c084fc', b: '#581c87', art: 1 }],
  [{ t: 'Artículo SEO de 1 500 palabras', c: 'Escritura', p: '30 XLM', a: '#f472b6', b: '#831843', art: 3 }, { t: 'Campaña en Meta Ads', c: 'Marketing', p: '60 XLM', a: '#fb923c', b: '#7c2d12', art: 0 }, { t: 'Interfaz móvil en Figma', c: 'Diseño', p: '15 XLM / h', a: '#38bdf8', b: '#075985', art: 2 }],
  [{ t: 'Integración con wallet Stellar', c: 'Desarrollo', p: '20 XLM / h', a: '#facc15', b: '#713f12', art: 1 }, { t: 'Calendario de contenido', c: 'Marketing', p: '40 XLM', a: '#2dd4bf', b: '#134e4a', art: 3 }, { t: 'Mascota ilustrada', c: 'Diseño', p: '35 XLM', a: '#fb7185', b: '#881337', art: 0 }]
];

function Art({ k }: { k: Tile['art'] }) {
  const s = { stroke: 'rgba(255,255,255,.55)', fill: 'none', strokeWidth: 1.5 };
  return (
    <svg viewBox="0 0 200 90" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {k === 0 && [18, 34, 50, 66].map(r => <circle key={r} cx="150" cy="60" r={r} {...s} />)}
      {k === 1 && [0, 1, 2, 3, 4, 5].map(i => <line key={i} x1={20 + i * 34} y1="95" x2={70 + i * 34} y2="-5" {...s} />)}
      {k === 2 && [0, 1, 2].map(i => <rect key={i} x={30 + i * 22} y={14 + i * 12} width="90" height="46" rx="8" {...s} />)}
      {k === 3 && [0, 1, 2, 3].map(i => <path key={i} d={`M0 ${30 + i * 14} Q50 ${i * 14} 100 ${40 + i * 12} T200 ${30 + i * 10}`} {...s} />)}
    </svg>
  );
}
const TileCard = ({ x }: { x: Tile }) => (
  <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-panel">
    <div className="relative h-28" style={{ background: `linear-gradient(135deg, ${x.a}, ${x.b})` }}><Art k={x.art} /></div>
    <div className="p-4"><p className="font-medium leading-snug">{x.t}</p><p className="mt-1 text-xs text-muted">{x.c} · desde <span className="font-mono text-slate-200">{x.p}</span></p></div>
  </div>
);

const CATS = [
  { n: 'Diseño', d: 'Logos, marca, ilustración e interfaces', a: '#3ee6a0', b: '#0b6b4a', span: 'md:col-span-2 md:row-span-2' },
  { n: 'Desarrollo', d: 'Web, apps y blockchain', a: '#60a5fa', b: '#1e3a8a', span: '' },
  { n: 'Video', d: 'Edición y motion graphics', a: '#c084fc', b: '#581c87', span: '' },
  { n: 'Marketing', d: 'Publicidad y redes sociales', a: '#fb923c', b: '#7c2d12', span: 'md:col-span-2' },
  { n: 'Escritura', d: 'SEO, copy y guiones', a: '#f472b6', b: '#831843', span: '' }
];
const POPULAR = ['Diseño de logo', 'Landing page', 'Edición de video', 'Artículo SEO', 'Contrato Soroban'];

export default function Home() {
  const router = useRouter();
  const { ready, user } = useApp();
  const [q, setQ] = useState('');

  // Portada libre: no fuerza redirección si el usuario entra manualmente o navega.

  // Búsqueda directa al Marketplace para explorar como invitado o cliente
  const search = (e: React.FormEvent) => { e.preventDefault(); router.push(`/marketplace?q=${encodeURIComponent(q)}`); };

  return (
    <div>
      {/* Portada */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 top-0 h-[700px] w-[700px] rounded-full bg-brand/10 blur-[120px]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">Contrata talento freelance y págale en XLM.</h1>
            <p className="mt-6 max-w-lg text-lg text-slate-400">Diseño, desarrollo, video y marketing. El pago sale de tu wallet y llega directo a la del freelancer, sin intermediarios.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <form onSubmit={search} className="flex max-w-xl flex-1 overflow-hidden rounded-xl border border-line bg-panel focus-within:border-brand">
                <input value={q} onChange={e => setQ(e.target.value)} aria-label="Buscar un servicio" placeholder="Busca un servicio, por ejemplo «diseño de logo»" className="w-full bg-transparent px-4 py-4 text-sm outline-none placeholder:text-muted" />
                <button className="bg-brand px-7 text-sm font-semibold text-bg hover:brightness-110">Buscar</button>
              </form>
              <Link href="/marketplace" className="flex items-center gap-2 rounded-xl border border-brand/50 bg-panel/60 px-5 py-4 text-sm font-semibold text-brand transition hover:bg-brand hover:text-bg">
                ✦ Entrar como invitado
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
              Populares:
              {POPULAR.map(p => <Link key={p} href={`/marketplace?q=${encodeURIComponent(p)}`} className="chip">{p}</Link>)}
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div><dt className="text-muted">Comisión de red</dt><dd className="font-mono text-lg">0.00001 XLM</dd></div>
              <div><dt className="text-muted">Confirmación</dt><dd className="font-mono text-lg">≈ 5 segundos</dd></div>
              <div><dt className="text-muted">Custodia</dt><dd className="font-mono text-lg">Ninguna, tú firmas</dd></div>
            </dl>
          </div>

          <div className="relative hidden h-[640px] lg:block" aria-hidden>
            <div className="absolute inset-0 grid grid-cols-3 gap-4 overflow-hidden [transform:rotate(-7deg)_scale(1.1)]" style={{ maskImage: 'linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent)' }}>
              {COLS.map((col, i) => (
                <div key={i} className={i === 1 ? 'col-fall' : 'col-rise'} style={{ animationDuration: `${36 + i * 6}s` }}>
                  <div className="flex flex-col gap-4 pb-4">{[...col, ...col].map((x, j) => <TileCard key={j} x={x} />)}</div>
                  <div className="flex flex-col gap-4">{[...col, ...col].map((x, j) => <TileCard key={j} x={x} />)}</div>
                </div>
              ))}
            </div>
            <div className="pop-in absolute -left-6 bottom-16 flex items-center gap-3 rounded-xl border border-brand/40 bg-bg/90 px-4 py-3 shadow-2xl backdrop-blur">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-bg">✓</span>
              <div><p className="text-sm font-medium">Pago confirmado</p><p className="font-mono text-xs text-muted">de wallet a wallet · 4.8 s · fee 0.00001 XLM</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight md:text-4xl">Encuentra el servicio que tu proyecto necesita</h2>
        <div className="mt-10 grid gap-4 md:auto-rows-[150px] md:grid-cols-4">
          {CATS.map(c => (
            <Link key={c.n} href={`/marketplace?category=${encodeURIComponent(c.n)}`} className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl p-6 ${c.span}`} style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})` }}>
              <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/0" />
              <span className="relative font-display text-2xl font-semibold text-white">{c.n}</span>
              <span className="relative text-sm text-white/80">{c.d}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo funciona: es un proceso en orden */}
      <section id="como-funciona" className="border-y border-line bg-panel/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Del clic al pago en tres pasos</h2>
            <p className="mt-4 text-slate-400">Los perfiles y portafolios solo se ven con una cuenta. Así cuidamos a quienes ofrecen su trabajo.</p>
          </div>
          <ol className="space-y-8">
            {[['Crea tu cuenta', 'Elige si contratas o si ofreces servicios. Solo necesitas tu correo.'], ['Conecta tu wallet Freighter', 'Se conecta a la red Stellar real. Ves tu saldo y firmas tú mismo cada pago.'], ['Contrata y firma', 'Revisas el total con la comisión de red, firmas en Freighter y recibes el hash de la transacción.']].map(([t, d], i) => (
              <li key={t} className="flex gap-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand/50 font-mono text-brand">{i + 1}</span>
                <div><p className="text-lg font-medium">{t}</p><p className="mt-1 text-slate-400">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sección Pitch de Stellar en el MVP */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-brand/40 bg-gradient-to-br from-panel via-bg to-panel p-8 md:p-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <div>
              <span className="rounded-full bg-brand/10 border border-brand/40 px-3 py-1 font-mono text-xs font-semibold text-brand">✦ Stellar Blockchain Pitch</span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">¿Dónde entra la Red Stellar en este MVP?</h2>
            </div>
            <span className="font-mono text-xs text-muted">Testnet & Mainnet Ready</span>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-5 space-y-2 border-line">
              <span className="font-mono text-2xl text-brand">01</span>
              <h3 className="font-semibold text-white">Wallet Freighter</h3>
              <p className="text-xs text-slate-400">Autenticación y firma nativa mediante la extensión oficial de Stellar sin guardar llaves privadas en servidores.</p>
            </div>
            <div className="card p-5 space-y-2 border-line">
              <span className="font-mono text-2xl text-brand">02</span>
              <h3 className="font-semibold text-white">Pagos P2P en XLM</h3>
              <p className="text-xs text-slate-400">Pagos directos de wallet a wallet a la clave pública del freelancer (`G...`) con comisión fija de 0.00001 XLM.</p>
            </div>
            <div className="card p-5 space-y-2 border-line">
              <span className="font-mono text-2xl text-brand">03</span>
              <h3 className="font-semibold text-white">Friendbot Faucet</h3>
              <p className="text-xs text-slate-400">Integración directa con el Friendbot de Stellar para fondear cuentas de prueba con 10,000 XLM en 1 clic.</p>
            </div>
            <div className="card p-5 space-y-2 border-line">
              <span className="font-mono text-2xl text-brand">04</span>
              <h3 className="font-semibold text-white">Verificación Horizon</h3>
              <p className="text-xs text-slate-400">Verificación inmediata on-chain en el explorador `stellar.expert` con hash de transacción y ledger indexado en ~5s.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doble entrada */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-20 md:grid-cols-2">
        <Link href="/register?role=client" className="group rounded-2xl border border-sky/30 p-8 transition hover:border-sky"><p className="font-display text-2xl font-semibold">Quiero contratar</p><p className="mt-2 text-slate-400">Crea tu cuenta de cliente y explora el marketplace.</p><p className="mt-6 text-sky">Crear cuenta de cliente</p></Link>
        <Link href="/register?role=freelancer" className="group rounded-2xl border border-brand/30 p-8 transition hover:border-brand"><p className="font-display text-2xl font-semibold">Quiero ofrecer mis servicios</p><p className="mt-2 text-slate-400">Publica tu perfil y cobra en XLM a tu propia wallet.</p><p className="mt-6 text-brand">Crear cuenta de freelancer</p></Link>
      </section>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">StellarWork · Pagos sobre la red Stellar</footer>
    </div>
  );
}
