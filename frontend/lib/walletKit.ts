import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit';
import { Networks } from '@creit-tech/stellar-wallets-kit/types';
import { FreighterModule } from '@creit-tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit-tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit-tech/stellar-wallets-kit/modules/xbull';
import { HanaModule } from '@creit-tech/stellar-wallets-kit/modules/hana';
import { RabetModule } from '@creit-tech/stellar-wallets-kit/modules/rabet';
import { LobstrModule } from '@creit-tech/stellar-wallets-kit/modules/lobstr';

export function initWalletKit() {
  if (typeof window === 'undefined') return;
  try {
    StellarWalletsKit.init({
      modules: [
        new FreighterModule(),
        new AlbedoModule(),
        new xBullModule(),
        new HanaModule(),
        new RabetModule(),
        new LobstrModule()
      ],
      network: Networks.TESTNET,
    });
  } catch {}
}

export { StellarWalletsKit };
