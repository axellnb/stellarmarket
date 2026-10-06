'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { api } from './api';
import { connectFreighter, fetchAccount, fundWithFriendbot, silentAddress, WalletError } from './stellar';

export type Role = 'client' | 'freelancer';
export interface Wallet { address: string; balance: number; spendable: number; funded: boolean }
export interface User { name: string; email: string; role: Role; prefs?: string[]; profileId?: string; token?: string }
interface Ctx {
  ready: boolean;
  user: User | null; setUser: (u: User | null) => void; logout: () => Promise<void>;
  wallet: Wallet | null; walletBusy: boolean; walletError: string;
  connectWallet: () => Promise<boolean>; disconnectWallet: () => void; refreshWallet: () => Promise<void>; fundWallet: () => Promise<void>;
  clearWalletError: () => void;
}
const AppCtx = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(AppCtx);

const read = () => { try { return JSON.parse(localStorage.getItem('sm-state') || '{}'); } catch { return {}; } };
const persist = (patch: object) => { try { localStorage.setItem('sm-state', JSON.stringify({ ...read(), ...patch })); } catch {} };

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletBusy, setWalletBusy] = useState(false);
  const [walletError, setWalletError] = useState('');
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  const setUser = useCallback((u: User | null) => { setUserState(u); persist({ user: u }); }, []);

  const loadWallet = useCallback(async (address: string) => {
    const acc = await fetchAccount(address);
    setWallet({ address, ...acc });
  }, []);

  const clearSession = useCallback(() => { setUserState(null); setWallet(null); persist({ user: null, wallet: null }); }, []);

  // Al abrir la app: valida la sesión en el servidor y reconecta la wallet si ya fue autorizada.
  useEffect(() => {
    (async () => {
      const s = read();
      if (s.user?.token) {
        try {
          const me = await api<User>('/api/me');
          setUserState({ ...me, token: s.user.token });
          if (s.wallet) { const a = await silentAddress(); if (a) await loadWallet(a).catch(() => {}); else persist({ wallet: null }); }
        } catch {
          // En versión de prueba, mantener la sesión localmente sin desloguear
          setUserState(s.user);
        }
      }
      setReady(true);
    })();
    const onUnauth = () => clearSession();
    window.addEventListener('sm-unauthorized', onUnauth);
    return () => window.removeEventListener('sm-unauthorized', onUnauth);
  }, [loadWallet, clearSession]);

  const logout = useCallback(async () => { try { await api('/api/logout', { method: 'POST' }); } catch {} clearSession(); }, [clearSession]);

  const connectWallet = useCallback(async () => {
    if (!userRef.current) return false; // la wallet solo se conecta con sesión iniciada
    setWalletBusy(true); setWalletError('');
    try { const a = await connectFreighter(); await loadWallet(a); persist({ wallet: true }); return true; }
    catch (e: any) { setWalletError(e instanceof WalletError ? e.message : 'No se pudo conectar la wallet.'); return false; }
    finally { setWalletBusy(false); }
  }, [loadWallet]);

  const disconnectWallet = useCallback(() => { setWallet(null); persist({ wallet: null }); }, []);
  const refreshWallet = useCallback(async () => { if (wallet) await loadWallet(wallet.address).catch(() => {}); }, [wallet, loadWallet]);

  const fundWallet = useCallback(async () => {
    if (!wallet) return;
    setWalletBusy(true); setWalletError('');
    try { await fundWithFriendbot(wallet.address); await loadWallet(wallet.address); }
    catch (e: any) { setWalletError(e instanceof WalletError ? e.message : 'No se pudo fondear la cuenta.'); }
    finally { setWalletBusy(false); }
  }, [wallet, loadWallet]);

  return (
    <AppCtx.Provider value={{ ready, user, setUser, logout, wallet, walletBusy, walletError, connectWallet, disconnectWallet, refreshWallet, fundWallet, clearWalletError: () => setWalletError('') }}>
      {children}
    </AppCtx.Provider>
  );
}
