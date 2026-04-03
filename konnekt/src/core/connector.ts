import type { KonnektConfig, WalletInfo, EIP1193Provider } from '../types';
import type { Store } from './store';
import { createStore } from './store';
import { startEIP6963Discovery, getProviderByRdns } from './eip6963';
import { startSolanaDiscovery, connectSolanaWallet, getSolanaProvider } from './solana';

export interface KonnektInstance {
  store: Store;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  openModal: () => void;
  closeModal: () => void;
  destroy: () => void;
  /** Get the raw provider for the connected wallet */
  getProvider: () => EIP1193Provider | any | null;
  /** Sign a message with the connected wallet */
  signMessage: (message: string) => Promise<string>;
  /** Send a transaction (EVM: tx object, Solana: Transaction) */
  sendTransaction: (tx: any) => Promise<string>;
}

export function createKonnekt(config: KonnektConfig = {}): KonnektInstance {
  const store = createStore();
  const cleanups: (() => void)[] = [];

  let evmWallets: WalletInfo[] = [];
  let solWallets: WalletInfo[] = [];

  function mergeAndUpdate() {
    const merged = [...evmWallets, ...solWallets.map((sw) => {
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

  function getConnectedWallet(): WalletInfo | null {
    const { walletId, availableWallets } = store.getState();
    if (!walletId) return null;
    return availableWallets.find((w) => w.id === walletId) ?? null;
  }

  function getProvider(): EIP1193Provider | any | null {
    const wallet = getConnectedWallet();
    if (!wallet) return null;
    if (wallet.chain === 'solana') return getSolanaProvider(wallet.id);
    return getProviderByRdns(wallet.id);
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

  async function signMessage(message: string): Promise<string> {
    const { status, address } = store.getState();
    if (status !== 'connected' || !address) throw new Error('Not connected');

    const wallet = getConnectedWallet();
    if (!wallet) throw new Error('No wallet found');

    if (wallet.chain === 'solana') {
      const provider = getSolanaProvider(wallet.id);
      if (!provider) throw new Error('Solana provider not found');
      const encoded = new TextEncoder().encode(message);
      const { signature } = await provider.signMessage(encoded, 'utf8');
      // Convert Uint8Array to hex
      return Array.from(signature as Uint8Array).map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      const provider = getProviderByRdns(wallet.id);
      if (!provider) throw new Error('EVM provider not found');
      const sig = await provider.request({
        method: 'personal_sign',
        params: [
          `0x${Array.from(new TextEncoder().encode(message)).map(b => b.toString(16).padStart(2, '0')).join('')}`,
          address,
        ],
      });
      return sig as string;
    }
  }

  async function sendTransaction(tx: any): Promise<string> {
    const { status, address } = store.getState();
    if (status !== 'connected' || !address) throw new Error('Not connected');

    const wallet = getConnectedWallet();
    if (!wallet) throw new Error('No wallet found');

    if (wallet.chain === 'solana') {
      const provider = getSolanaProvider(wallet.id);
      if (!provider) throw new Error('Solana provider not found');
      const { signature } = await provider.signAndSendTransaction(tx);
      return signature as string;
    } else {
      const provider = getProviderByRdns(wallet.id);
      if (!provider) throw new Error('EVM provider not found');
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: address, ...tx }],
      });
      return hash as string;
    }
  }

  function disconnect() { store.reset(); }
  function destroy() { cleanups.forEach((fn) => fn()); disconnect(); }

  return {
    store, connect, disconnect, destroy,
    openModal: () => store.openModal(),
    closeModal: () => store.closeModal(),
    getProvider,
    signMessage,
    sendTransaction,
  };
}
