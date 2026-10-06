import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { StrKey } from '@stellar/stellar-sdk';
import { freelancers, Freelancer } from './data';

const app = express();
app.use(cors());
app.use(express.json({ limit: '3mb' })); // permite fotos en base64

// ── Red Stellar ────────────────────────────────────────────────
const NETWORK = (process.env.STELLAR_NETWORK || 'TESTNET').toUpperCase() === 'PUBLIC' ? 'PUBLIC' : 'TESTNET';
const HORIZON = NETWORK === 'PUBLIC' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';
const EXPLORER = NETWORK === 'PUBLIC' ? 'public' : 'testnet';
const isStellarKey = (k: unknown) => typeof k === 'string' && StrKey.isValidEd25519PublicKey(k);

const avg = (f: Freelancer) => f.reviews.length ? +(f.reviews.reduce((s, r) => s + r.rating, 0) / f.reviews.length).toFixed(1) : 0;
const view = (f: Freelancer) => { const { ownerEmail, ...rest } = f; return { ...rest, rating: avg(f), reviewCount: f.reviews.length }; };

// ── Usuarios y sesiones ────────────────────────────────────────
type Role = 'client' | 'freelancer';
interface User { name: string; email: string; role: Role; prefs: string[]; profileId?: string }
const users = new Map<string, User>();
const sessions = new Map<string, string>(); // token -> email

type AuthedRequest = Request & { user?: User };

// Todo lo que muestre perfiles o mueva dinero exige sesión.
const auth = (role?: Role) => (req: AuthedRequest, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const email = sessions.get(token);
  const u = email ? users.get(email) : undefined;
  if (!u) return res.status(401).json({ error: 'Inicia sesión para continuar' });
  if (role && u.role !== role) return res.status(403).json({ error: role === 'client' ? 'Solo los clientes pueden hacer esto' : 'Solo los freelancers pueden hacer esto' });
  req.user = u; next();
};

app.post('/api/auth', (req, res) => {
  const { name, email, role } = req.body || {};
  if (!email || !['client', 'freelancer'].includes(role)) return res.status(400).json({ error: 'Datos inválidos' });
  const key = String(email).trim().toLowerCase();
  let u = users.get(key);
  if (!u) {
    const derivedName = (name && String(name).trim()) || key.split('@')[0] || 'Usuario Test';
    u = { name: derivedName, email: key, role, prefs: [] };
    users.set(key, u);
  } else {
    if (name) u.name = String(name).trim();
    u.role = role;
  }
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, u.email);
  res.json({ token, user: u });
});

app.post('/api/logout', auth(), (req, res) => {
  sessions.delete((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  res.json({ ok: true });
});

// Devuelve el usuario de la sesión actual (para validar el token al recargar la página)
app.get('/api/me', auth(), (req: AuthedRequest, res) => res.json(req.user));

// ── Freelancers (solo con sesión) ──────────────────────────────
app.get('/api/freelancers', auth(), (req, res) => {
  const { category, minPrice, maxPrice, q, available, prefs } = req.query as Record<string, string>;
  let list = freelancers.slice();
  if (category && category !== 'Todas') list = list.filter(f => f.category === category);
  if (minPrice) list = list.filter(f => f.priceXLM >= Number(minPrice));
  if (maxPrice) list = list.filter(f => f.priceXLM <= Number(maxPrice));
  if (available === 'true') list = list.filter(f => f.available);
  if (q) { const s = q.toLowerCase(); list = list.filter(f => [f.name, f.profession, f.category, f.description, ...f.tags].some(t => t.toLowerCase().includes(s))); }
  const p = prefs ? prefs.split(',').filter(Boolean) : [];
  const out = list.map(f => ({ ...view(f), match: f.tags.filter(t => p.includes(t)).length }));
  if (p.length) out.sort((a, b) => b.match - a.match || b.rating - a.rating);
  res.json(out);
});

app.get('/api/freelancers/:id', auth(), (req, res) => {
  const f = freelancers.find(x => x.id === req.params.id);
  if (!f) return res.status(404).json({ error: 'Freelancer no encontrado' });
  res.json(view(f));
});

app.post('/api/freelancers', auth('freelancer'), (req: AuthedRequest, res) => {
  const b = req.body || {}; const me = req.user!;
  if (me.profileId) return res.status(409).json({ error: 'Ya tienes un perfil publicado' });
  const required = ['name', 'profession', 'category', 'description', 'portfolioUrl', 'stellarWallet', 'priceXLM'];
  const missing = required.filter(k => !b[k]);
  if (missing.length) return res.status(400).json({ error: `Campos obligatorios: ${missing.join(', ')}` });
  if (!isStellarKey(b.stellarWallet)) return res.status(400).json({ error: 'Wallet Stellar inválida. Debe empezar con G y tener 56 caracteres válidos.' });
  if (!/^https?:\/\//.test(b.portfolioUrl)) return res.status(400).json({ error: 'El portafolio debe ser una URL http(s)' });
  if (!(Number(b.priceXLM) > 0)) return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  const f: Freelancer = {
    id: String(Date.now()), name: b.name, profession: b.profession, category: b.category, description: b.description,
    tags: Array.isArray(b.tags) ? b.tags.slice(0, 3) : [], priceXLM: Number(b.priceXLM), priceType: b.priceType === 'hour' ? 'hour' : 'fixed',
    avatar: typeof b.avatar === 'string' && b.avatar.startsWith('data:image/') ? b.avatar : `https://i.pravatar.cc/200?u=${encodeURIComponent(b.name)}`,
    available: b.available !== false, portfolioUrl: b.portfolioUrl, stellarWallet: b.stellarWallet, reviews: [], ownerEmail: me.email
  };
  freelancers.unshift(f); me.profileId = f.id;
  res.status(201).json(view(f));
});

app.post('/api/freelancers/:id/reviews', auth('client'), (req: AuthedRequest, res) => {
  const f = freelancers.find(x => x.id === req.params.id);
  if (!f) return res.status(404).json({ error: 'Freelancer no encontrado' });
  const { rating, comment } = req.body || {};
  if (!comment || !(rating >= 1 && rating <= 5)) return res.status(400).json({ error: 'Datos de reseña inválidos' });
  f.reviews.unshift({ id: crypto.randomUUID(), client: req.user!.name, rating: Number(rating), comment, date: new Date().toISOString().slice(0, 10) });
  res.status(201).json(view(f));
});

app.post('/api/preferences', auth('client'), (req: AuthedRequest, res) => {
  const { prefs } = req.body || {};
  req.user!.prefs = Array.isArray(prefs) ? prefs : [];
  res.json(req.user);
});

// ── Pagos reales en Stellar ────────────────────────────────────
// El cliente firma y envía la transacción desde su wallet (Freighter).
// Aquí NO se mueve dinero: el servidor consulta Horizon y confirma que el pago existe,
// que llegó a la wallet del freelancer y que el monto es el correcto.
const usedHashes = new Set<string>();

app.get('/api/network', (_req, res) => res.json({ network: NETWORK, horizon: HORIZON }));

app.post('/api/payments/confirm', auth('client'), async (req, res) => {
  const { freelancerId, hash, hours } = req.body || {};
  const f = freelancers.find(x => x.id === freelancerId);
  if (!f) return res.status(404).json({ error: 'Freelancer no encontrado' });
  if (typeof hash !== 'string' || !/^[0-9a-f]{64}$/i.test(hash)) return res.status(400).json({ error: 'Hash de transacción inválido' });
  if (usedHashes.has(hash)) return res.status(409).json({ error: 'Esta transacción ya fue registrada' });

  const qty = f.priceType === 'hour' ? Math.max(1, Number(hours) || 1) : 1;
  const expected = f.priceXLM * qty;
  try {
    const txRes = await fetch(`${HORIZON}/transactions/${hash}`);
    if (txRes.status === 404) return res.status(404).json({ error: 'Horizon aún no ve esa transacción. Intenta de nuevo en unos segundos.' });
    const tx: any = await txRes.json();
    if (!tx.successful) return res.status(400).json({ error: 'La transacción no fue exitosa en la red' });

    const opsRes = await fetch(`${HORIZON}/transactions/${hash}/operations`);
    const ops: any = await opsRes.json();
    const op = (ops._embedded?.records || []).find((o: any) =>
      (o.type === 'payment' && o.asset_type === 'native' && o.to === f.stellarWallet && Number(o.amount) >= expected) ||
      (o.type === 'create_account' && o.account === f.stellarWallet && Number(o.starting_balance) >= expected));
    if (!op) return res.status(400).json({ error: 'La transacción no corresponde al pago de este servicio' });

    usedHashes.add(hash);
    res.json({
      success: true, hash, from: tx.source_account, to: f.stellarWallet, amount: expected,
      fee: Number(tx.fee_charged) / 1e7, ledger: tx.ledger, network: NETWORK === 'PUBLIC' ? 'Stellar Mainnet' : 'Stellar Testnet',
      timestamp: tx.created_at, explorerUrl: `https://stellar.expert/explorer/${EXPLORER}/tx/${hash}`
    });
  } catch {
    res.status(502).json({ error: 'No se pudo consultar la red Stellar. Intenta de nuevo.' });
  }
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API en http://localhost:${PORT} · Stellar ${NETWORK}`));
}

export default app;

