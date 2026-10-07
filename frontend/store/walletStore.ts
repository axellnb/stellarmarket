// Implementación compatible con la plantilla oficial grupo-5-main sin dependencias pesadas
export interface WalletState {
  address: string | null;
  isConnected: boolean;
  setAddress: (address: string) => void;
  reset: () => void;
}

let currentAddress: string | null = null;
const listeners: Array<() => void> = [];

export function useWalletStore(): WalletState {
  return {
    address: currentAddress,
    isConnected: !!currentAddress,
    setAddress: (addr: string) => {
      currentAddress = addr;
      listeners.forEach(l => l());
    },
    reset: () => {
      currentAddress = null;
      listeners.forEach(l => l());
    }
  };
}
