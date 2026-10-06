// Integración real con Stellar: Freighter (firma) + Horizon (consulta y envío).
// Los SDK se importan dinámicamente: solo existen en el navegador.

export const NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET').toUpperCase() === 'PUBLIC' ? 'PUBLIC' : 'TESTNET';
export const HORIZON = NETWORK === 'PUBLIC' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';
export const PASSPHRASE = NETWORK === 'PUBLIC' ? 'Public Global Stellar Network ; September 2015' : 'Test SDF Network ; September 2015';
export const NETWORK_LABEL = NETWORK === 'PUBLIC' ? 'Mainnet' : 'Testnet';

export class WalletError extends Error {}

const freighter = () => import('@stellar/freighter-api');

export interface AccountInfo { balance: number; spendable: number; funded: boolean }

/** Saldo real desde Horizon. Si la cuenta no existe en la red, funded=false. */
export async function fetchAccount(address: string): Promise<AccountInfo> {
  const r = await fetch(`${HORIZON}/accounts/${address}`);
  if (r.status === 404) return { balance: 0, spendable: 0, funded: false };
  if (!r.ok) throw new WalletError('No se pudo consultar el saldo en la red Stellar.');
  const a = await r.json();
  const balance = Number(a.balances.find((b: any) => b.asset_type === 'native')?.balance || 0);
  const reserve = (2 + a.subentry_count + a.num_sponsoring - a.num_sponsored) * 0.5;
  return { balance, spendable: Math.max(0, +(balance - reserve).toFixed(7)), funded: true };
}

/** Pide permiso a Freighter y devuelve la dirección pública. */
export async function connectFreighter(): Promise<string> {
  const fr = await freighter();
  const conn = await fr.isConnected();
  if (!conn.isConnected) throw new WalletError('No encontramos Freighter. Instálala desde freighter.app y recarga la página.');
  const res = await fr.requestAccess();
  if (res.error || !res.address) throw new WalletError('Rechazaste la conexión en Freighter. Inténtalo de nuevo y acepta el permiso.');
  await assertNetwork();
  return res.address;
}

/** Reconecta sin abrir ventanas si el usuario ya autorizó este sitio antes. */
export async function silentAddress(): Promise<string | null> {
  try {
    const fr = await freighter();
    if (!(await fr.isConnected()).isConnected) return null;
    if (!(await fr.isAllowed()).isAllowed) return null;
    const a = await fr.getAddress();
    return a.error ? null : a.address || null;
  } catch { return null; }
}

/** Verifica que Freighter esté en la misma red que la app. */
export async function assertNetwork() {
  const fr = await freighter();
  const n = await fr.getNetworkDetails();
  if (!n.error && n.networkPassphrase !== PASSPHRASE)
    throw new WalletError(`Freighter está en ${n.network}. Cámbiala a ${NETWORK_LABEL} desde su menú de redes.`);
}

/** Solo Testnet: pide 10 000 XLM de prueba al friendbot. */
export async function fundWithFriendbot(address: string) {
  if (NETWORK !== 'TESTNET') throw new WalletError('El friendbot solo existe en Testnet.');
  const r = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`);
  if (!r.ok) throw new WalletError('El friendbot no pudo fondear la cuenta. Intenta de nuevo en un momento.');
}

/**
 * Construye, firma con Freighter y envía un pago en XLM.
 * Si la cuenta destino aún no existe en la red, usa createAccount (requiere ≥ 1 XLM).
 */
export async function sendXLM(opts: { from: string; to: string; amount: number; memo?: string }): Promise<{ hash: string; ledger: number }> {
  const sdk = await import('@stellar/stellar-sdk');
  const fr = await freighter();
  await assertNetwork();
  const server = new sdk.Horizon.Server(HORIZON);
  const amount = opts.amount.toFixed(7);

  let source;
  try { source = await server.loadAccount(opts.from); }
  catch { throw new WalletError('Tu cuenta aún no existe en la red. Fóndala primero (en Testnet, usa el botón «Fondear con friendbot»).'); }

  let destExists = true;
  try { await server.loadAccount(opts.to); } catch { destExists = false; }
  if (!destExists && opts.amount < 1) throw new WalletError('La wallet del freelancer aún no está activa en la red; el primer pago debe ser de al menos 1 XLM.');

  const builder = new sdk.TransactionBuilder(source, { fee: sdk.BASE_FEE, networkPassphrase: PASSPHRASE })
    .addOperation(destExists
      ? sdk.Operation.payment({ destination: opts.to, asset: sdk.Asset.native(), amount })
      : sdk.Operation.createAccount({ destination: opts.to, startingBalance: amount }))
    .setTimeout(120);
  if (opts.memo) builder.addMemo(sdk.Memo.text(opts.memo.slice(0, 28)));
  const tx = builder.build();

  const signed = await fr.signTransaction(tx.toXDR(), { networkPassphrase: PASSPHRASE, address: opts.from });
  if (signed.error || !signed.signedTxXdr) throw new WalletError('Cancelaste la firma en Freighter. No se envió ningún pago.');

  try {
    const res = await server.submitTransaction(sdk.TransactionBuilder.fromXDR(signed.signedTxXdr, PASSPHRASE));
    return { hash: res.hash, ledger: res.ledger };
  } catch (e: any) {
    const codes = e?.response?.data?.extras?.result_codes;
    if (codes?.transaction === 'tx_insufficient_balance' || codes?.operations?.includes('op_underfunded'))
      throw new WalletError('Saldo insuficiente: recuerda que Stellar reserva 1 XLM mínimo en la cuenta.');
    throw new WalletError('La red rechazó la transacción' + (codes ? ` (${codes.transaction}${codes.operations ? ': ' + codes.operations.join(', ') : ''})` : '.'));
  }
}
