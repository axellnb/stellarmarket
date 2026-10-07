import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  setAddress: (address: string) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      setAddress: (address) => set({ address, isConnected: true }),
      reset: () => set({ address: null, isConnected: false }),
    }),
    {
      name: 'stellar-wallet',
      skipHydration: true,
    }
  )
);
