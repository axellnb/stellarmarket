# StellarWork · Marketplace freelance con pagos en XLM (MVP)
## Tecnologías y requisitos

- **Frontend:** Next.js 14, React 18, Tailwind CSS y TypeScript
- **Backend:** Node.js, Express y TypeScript
- **Blockchain:** Stellar SDK, Freighter API y Horizon
## Estructura
```
stellar-market/
├─ backend/   Express + TypeScript (datos en memoria)  → http://localhost:4000
└─ frontend/  Next.js 14 + Tailwind + TypeScript       → http://localhost:3000
```

## Ejecución (2 terminales)
```bash
cd backend  && npm install && npm run dev
cd frontend && npm install && npm run dev
```
Si cambias el puerto del backend, edita `frontend/.env.local` (`NEXT_PUBLIC_API_URL`).

## Wallet y pagos (Stellar real)
- Requiere la extensión **Freighter** (freighter.app) puesta en **Testnet**.
- La wallet solo se puede conectar con sesión iniciada. El saldo se lee de Horizon.
- Cuenta nueva en Testnet: botón «Fondear con friendbot» (en el menú de la wallet).
- El pago lo construye y firma el navegador con Freighter y se envía a Horizon. El backend **no mueve dinero**: verifica el hash en Horizon (destino, monto, éxito) en `POST /api/payments/confirm`.
- Si la wallet del freelancer aún no existe en la red, el primer pago (≥ 1 XLM) la crea.
- Para Mainnet: `NEXT_PUBLIC_STELLAR_NETWORK=PUBLIC` (frontend) y `STELLAR_NETWORK=PUBLIC` (backend).

## Acceso
- `/` es pública (portada). Marketplace, perfiles, checkout y preferencias exigen sesión (el backend responde 401 sin token).
- Sesión simulada: solo correo, sin contraseña, datos en memoria (se pierden al reiniciar el backend).

## Endpoints (todos con `Authorization: Bearer <token>` salvo /api/auth y /api/network)
- `POST /api/auth` · `POST /api/logout` · `GET /api/me`
- `GET /api/freelancers?category=&minPrice=&maxPrice=&q=&available=&prefs=`
- `GET /api/freelancers/:id` · `POST /api/freelancers` (freelancer) · `POST /api/freelancers/:id/reviews` (cliente)
- `POST /api/preferences` (cliente) · `POST /api/payments/confirm` (cliente)
