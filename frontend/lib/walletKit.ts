import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit';
import { Networks } from '@creit-tech/stellar-wallets-kit/types';
import { defaultModules } from '@creit-tech/stellar-wallets-kit/modules/utils';

export function initWalletKit() {
  if (typeof window === 'undefined') return;
  StellarWalletsKit.init({
    modules: defaultModules(),
    network: Networks.TESTNET,
  });
}

export { StellarWalletsKit };
