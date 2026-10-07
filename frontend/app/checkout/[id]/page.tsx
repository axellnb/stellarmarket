'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Freelancer, PaymentResult, priceLabel } from '@/lib/types';
import { useApp } from '@/lib/AppContext';
import { NETWORK, NETWORK_LABEL, sendXLM, WalletError } from '@/lib/stellar';
import RequireAuth from '@/components/RequireAuth';

const FEE = 0.00001;
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-6)}`;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
type Step = 'idle' | 'signing' | 'confirming' | 'done';

function CheckoutInner() {
  const { id } = useParams<{ id: string }>();
  const { wallet, walletBusy, connectWallet, fundWallet, refreshWallet } = useApp();
  const [f, setF] = useState<Freelancer | null>(null);
  const [hours, setHours] = useState(1);
  const [step, setStep] = useState<Step>('idle');
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => { api<Freelancer>(`/api/freelancers/${id}`).then(setF).catch(e => setErr(e.message)); }, [id]);
  if (!f) return <p className="text-[#99B7FC] text-center py-20">{err || 'Cargando resumen de la transacción…'}</p>;

  const amount = f.priceType === 'hour' ? f.priceXLM * hours : f.priceXLM;
  const total = +(amount + FEE).toFixed(5);
  const insufficient = !!wallet && wallet.funded && wallet.spendable < total;

  const pay = async () => {
    if (!wallet) return;
    setErr(''); setStep('signing');
    try {
      const { hash } = await sendXLM({ from: wallet.address, to: f.stellarWallet, amount, memo: `sw-${f.id}` });
      setStep('confirming');
      let last = '';
      for (let i = 0; i < 6; i++) {
        try { setResult(await api<PaymentResult>('/api/payments/confirm', { method: 'POST', body: JSON.stringify({ freelancerId: f.id, hash, hours }) })); setStep('done'); refreshWallet(); return; }
        catch (e: any) { last = e.message; if (!/aún no ve/.test(last)) break; await sleep(1500); }
      }
      throw new Error(`El pago se envió (hash ${hash}) pero no pudimos verificarlo: ${last}`);
    } catch (e: any) { setErr(e instanceof WalletError || e instanceof Error ? e.message : 'No se pudo completar el pago.'); setStep('idle'); }
  };

  if (step === 'done' && result) return (
    <div className="card mx-auto max-w-lg space-y-6 p-8 text-center border border-white/10 bg-[#1B1B39]/80 backdrop-blur-2xl shadow-2xl">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#8CC63E]/20 text-[#8CC63E] ring-2 ring-[#8CC63E]/30">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Pago verificado en la red</h1>
        <p className="text-xs text-[#99B7FC] mt-1 font-mono uppercase tracking-wider">{result.network}</p>
      </div>
      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#1B1B39]/90 p-5 text-left font-mono text-xs shadow-inner">
        <div>
          <p className="text-[#99B7FC]/60">Hash de la transacción</p>
          <p className="break-all text-[#3965FA] font-medium mt-0.5">{result.hash}</p>
        </div>
        <div className="border-t border-white/10 pt-2 grid grid-cols-2 gap-2">
          <div>
            <p className="text-[#99B7FC]/60">Origen</p>
            <p className="text-white">{short(result.from)}</p>
          </div>
          <div>
            <p className="text-[#99B7FC]/60">Destino</p>
            <p className="text-white">{short(result.to)}</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-2 flex justify-between">
          <span className="text-[#99B7FC]/60">Monto + Comisión</span>
          <span className="text-[#3965FA] font-bold">{result.amount} XLM (+{result.fee} XLM)</span>
        </div>
        <div className="flex justify-between text-[11px] text-[#99B7FC]/60">
          <span>Stellar Ledger</span>
          <span>#{result.ledger}</span>
        </div>
      </div>
      <a href={result.explorerUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-[#99B7FC]">
        Ver en el explorador Stellar
        <svg className="w-4 h-4 text-[#3965FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      <Link href="/marketplace" className="btn w-full py-3.5 font-bold shadow-lg shadow-[#3965FA]/30 block">
        Volver al Marketplace
      </Link>
    </div>
  );

  const busy = step === 'signing' || step === 'confirming';
  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      <div className="card space-y-5 p-6 md:p-8 border border-white/10 bg-[#1B1B39]/70 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-white border-b border-white/10 pb-3">Resumen del servicio</h1>
        <div className="flex items-center gap-4">
          <img src={f.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-[#3965FA]" />
          <div>
            <p className="font-bold text-lg text-white">{f.name}</p>
            <p className="text-xs text-[#99B7FC]">{f.profession}</p>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#1B1B39]/80 p-4 space-y-1">
          <p className="text-xs text-[#99B7FC]/60 font-mono">Tarifa del freelancer</p>
          <p className="font-mono text-base font-bold text-[#3965FA]">{priceLabel(f)}</p>
        </div>
        {f.priceType === 'hour' && (
          <div>
            <label className="text-xs font-medium text-[#99B7FC] mb-1.5 block">Horas a contratar</label>
            <input type="number" min={1} value={hours} onChange={e => setHours(Math.max(1, +e.target.value || 1))} className="input font-mono" />
          </div>
        )}
      </div>

      <div className="card space-y-5 p-6 md:p-8 border border-white/10 bg-[#1B1B39]/70 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl font-bold text-white">Pago con Stellar</h2>
          <span className="rounded-full border border-[#3965FA]/40 bg-[#3965FA]/10 px-3 py-1 font-mono text-xs font-semibold text-[#99B7FC]">
            {NETWORK_LABEL}
          </span>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between"><span className="text-[#99B7FC]/70">Servicio</span><span className="text-white">{amount} XLM</span></div>
          <div className="flex justify-between"><span className="text-[#99B7FC]/70">Comisión de red</span><span className="text-white">{FEE} XLM</span></div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-base text-[#3965FA] font-bold"><span>Total a transferir</span><span>{total} XLM</span></div>
        </div>
        <p className="text-xs text-[#99B7FC]/70 leading-relaxed">La comisión de la red Stellar es de 100 stroops (0.00001 XLM). El pago se transfiere directamente de tu wallet a la dirección del freelancer.</p>
        {wallet && <p className="font-mono text-xs text-[#99B7FC]">Wallet conectada: {short(wallet.address)} · Saldo: {wallet.balance.toFixed(2)} XLM</p>}
        {wallet && !wallet.funded && <p className="text-xs text-amber-400">Tu cuenta aún no está fondeada en la red {NETWORK_LABEL}.</p>}
        {insufficient && <p className="text-xs text-red-400">Saldo insuficiente: Stellar reserva 1 XLM mínimo de reserva base.</p>}
        {err && <p role="alert" className="break-words text-xs text-red-400">{err}</p>}
        {!wallet ? (
          <button className="btn w-full py-3.5 font-bold shadow-lg shadow-[#3965FA]/30" disabled={walletBusy} onClick={connectWallet}>
            {walletBusy ? 'Conectando wallet…' : 'Conectar Wallet'}
          </button>
        ) : !wallet.funded ? (
          NETWORK === 'TESTNET' ? (
            <button className="btn w-full py-3.5 font-bold shadow-lg shadow-[#3965FA]/30" disabled={walletBusy} onClick={fundWallet}>
              {walletBusy ? 'Fondeando…' : 'Fondear con Friendbot'}
            </button>
          ) : null
        ) : (
          <button className="btn w-full py-3.5 font-bold shadow-lg shadow-[#3965FA]/30" disabled={insufficient || busy} onClick={pay}>
            {step === 'signing' ? 'Confirma en tu Wallet…' : step === 'confirming' ? 'Verificando en Stellar…' : `Pagar ${total} XLM`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Checkout() {
  return <RequireAuth role="client" wrongRole={<p className="py-24 text-center text-[#99B7FC]">Solo las cuentas de cliente pueden contratar servicios.</p>}><CheckoutInner /></RequireAuth>;
}
