import type { KonnektConfig, WalletInfo } from '../types';
import type { Store } from './store';
import { createStore } from './store';
import { startEIP6963Discovery, getProviderByRdns } from './eip6963';
import { startSolanaDiscovery, connectSolanaWallet } from './solana';

export interface KonnektInstance {
  store: Store;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  openModal: () => void;
  closeModal: () => void;
  destroy: () => void;
}

export function createKonnekt(config: KonnektConfig = {}): KonnektInstance {
  const store = createStore();
  const cleanups: (() => void)[] = [];

  // Separate lists merged on every update
  let evmWallets: WalletInfo[] = [];
  let solWallets: WalletInfo[] = [];

  function mergeAndUpdate() {
    const merged = [...evmWallets, ...solWallets.map((sw) => {
      // Always try to get better icon from EVM version of same wallet
      const baseName = sw.name.replace(/\s*\(.*\)\s*/g, '').toLowerCase().trim();
      const evmMatch = evmWallets.find((ew) => ew.name.toLowerCase().includes(baseName));
      if (evmMatch?.icon) return { ...sw, icon: evmMatch.icon };
      return sw;
    })];
    store.setWallets(merged);
  }

  if (typeof window !== 'undefined') {
    cleanups.push(
      startEIP6963Discovery((wallets) => {
        evmWallets = wallets;
        mergeAndUpdate();
      })
    );

    cleanups.push(
      startSolanaDiscovery((wallets) => {
        solWallets = wallets;
        mergeAndUpdate();
      })
    );
  }

  async function connect(walletId: string) {
    store.setStatus('connecting');
    store.setState({ walletId });

    try {
      const wallet = store.getState().availableWallets.find((w) => w.id === walletId);
      if (!wallet) throw new Error(`Wallet ${walletId} not found`);

      if (wallet.chain === 'solana') {
        const result = await connectSolanaWallet(walletId);
        store.setConnected(result.address, 0, walletId);
      } else {
        const provider = getProviderByRdns(walletId);
        if (!provider) throw new Error(`EVM wallet ${walletId} not found`);

        const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
        const chainIdHex = (await provider.request({ method: 'eth_chainId' })) as string;
        store.setConnected(accounts[0], parseInt(chainIdHex, 16), walletId);

        provider.on('accountsChanged', (accs: unknown) => {
          const a = accs as string[];
          if (a.length === 0) disconnect();
          else store.setState({ address: a[0] });
        });
        provider.on('chainChanged', (id: unknown) => {
          store.setState({ chainId: parseInt(id as string, 16) });
        });
      }

      store.closeModal();
    } catch (err) {
      store.setStatus('error', err instanceof Error ? err.message : 'Connection failed');
    }
  }

  function disconnect() { store.reset(); }
  function destroy() { cleanups.forEach((fn) => fn()); disconnect(); }

  return {
    store, connect, disconnect, destroy,
    openModal: () => store.openModal(),
    closeModal: () => store.closeModal(),
  };
}
