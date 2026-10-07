// Módulo de integración de wallet kit basado en la plantilla oficial grupo-5-main
const freighter = () => import('@stellar/freighter-api');

export function initWalletKit() {
  if (typeof window === 'undefined') return;
}

export const StellarWalletsKit = {
  authModal: async () => {
    const fr = await freighter();
    const conn = await fr.isConnected();
    if (!conn.isConnected) {
      throw new Error('No encontramos Freighter. Instálala desde freighter.app');
    }
    const res = await fr.requestAccess();
    if (res.error || !res.address) {
      throw new Error('Conexión cancelada en la wallet');
    }
    return { address: res.address };
  },
  disconnect: async () => {
    return true;
  }
};
