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
  if (!f) return <p className="text-muted">{err || 'Cargando…'}</p>;

  const amount = f.priceType === 'hour' ? f.priceXLM * hours : f.priceXLM;
  const total = +(amount + FEE).toFixed(5);
  const insufficient = !!wallet && wallet.funded && wallet.spendable < total;

  const pay = async () => {
    if (!wallet) return;
    setErr(''); setStep('signing');
    try {
      // 1) Firma en Freighter y envío a la red Stellar
      const { hash } = await sendXLM({ from: wallet.address, to: f.stellarWallet, amount, memo: `sw-${f.id}` });
      // 2) El servidor verifica el pago en Horizon (con reintentos por si la red tarda en indexar)
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
    <div className="card mx-auto max-w-lg space-y-5 p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-2xl text-bg">✓</div>
      <h1 className="text-2xl font-semibold">Pago confirmado</h1>
      <p className="text-sm text-muted">{result.network}</p>
      <div className="space-y-2 rounded-lg border border-line p-4 text-left font-mono text-xs">
        <p className="text-muted">Hash de la transacción</p>
        <p className="break-all text-brand">{result.hash}</p>
        <p className="pt-2 text-muted">De → Para</p>
        <p>{short(result.from)} → {short(result.to)}</p>
        <p className="pt-2">Monto: {result.amount} XLM · Comisión: {result.fee} XLM</p>
        <p>Ledger: #{result.ledger}</p>
      </div>
      <a href={result.explorerUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">Ver en el explorador ↗</a>
      <Link href="/marketplace" className="btn w-full">Volver al marketplace</Link>
    </div>
  );

  const busy = step === 'signing' || step === 'confirming';
  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
      <div className="card space-y-4 p-6">
        <h1 className="text-xl font-semibold">Resumen del servicio</h1>
        <div className="flex items-center gap-3"><img src={f.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /><div><p className="font-medium">{f.name}</p><p className="text-xs text-muted">{f.profession}</p></div></div>
        <p className="font-mono text-sm text-muted">Tarifa: {priceLabel(f)}</p>
        {f.priceType === 'hour' && (<div><label className="text-xs text-muted">Horas a contratar</label><input type="number" min={1} value={hours} onChange={e => setHours(Math.max(1, +e.target.value || 1))} className="input mt-1" /></div>)}
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="text-xl font-semibold">Pago con Stellar <span className="ml-1 rounded-full border border-line px-2 py-0.5 align-middle font-mono text-[11px] text-muted">{NETWORK_LABEL}</span></h2>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between"><span className="text-muted">Servicio</span><span>{amount} XLM</span></div>
          <div className="flex justify-between"><span className="text-muted">Comisión de red</span><span>{FEE} XLM</span></div>
          <div className="flex justify-between border-t border-line pt-2 text-base text-brand"><span>Total</span><span>{total} XLM</span></div>
        </div>
        <p className="text-xs text-muted">La comisión de Stellar es de 100 stroops (0.00001 XLM). El pago sale directo de tu wallet a la del freelancer.</p>
        {wallet && <p className="font-mono text-xs text-muted">Wallet {short(wallet.address)} · Saldo {wallet.balance.toFixed(2)} XLM</p>}
        {wallet && !wallet.funded && <p className="text-sm text-amber-400">Tu cuenta aún no existe en {NETWORK_LABEL}.</p>}
        {insufficient && <p className="text-sm text-red-400">Saldo insuficiente: Stellar reserva 1 XLM mínimo en tu cuenta.</p>}
        {err && <p role="alert" className="break-words text-sm text-red-400">{err}</p>}
        {!wallet ? <button className="btn w-full" disabled={walletBusy} onClick={connectWallet}>{walletBusy ? 'Conectando…' : 'Conectar wallet'}</button>
          : !wallet.funded ? (NETWORK === 'TESTNET' ? <button className="btn w-full" disabled={walletBusy} onClick={fundWallet}>{walletBusy ? 'Fondeando…' : 'Fondear con friendbot'}</button> : null)
          : <button className="btn w-full" disabled={insufficient || busy} onClick={pay}>{step === 'signing' ? 'Confirma en Freighter…' : step === 'confirming' ? 'Verificando en la red…' : `Pagar ${total} XLM`}</button>}
      </div>
    </div>
  );
}

export default function Checkout() {
  return <RequireAuth role="client" wrongRole={<p className="py-24 text-center text-muted">Solo las cuentas de cliente pueden contratar servicios.</p>}><CheckoutInner /></RequireAuth>;
}
