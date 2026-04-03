import { useState, useEffect, useCallback } from 'react';

export interface DetectedWallet {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
  provider: any;
}

export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WalletState {
  wallets: DetectedWallet[];
  status: WalletStatus;
  address: string | null;
  chainId: number | null;
  selectedWallet: DetectedWallet | null;
  error: string | null;
}

export function useWalletConnect() {
  const [state, setState] = useState<WalletState>({
    wallets: [],
    status: 'disconnected',
    address: null,
    chainId: null,
    selectedWallet: null,
    error: null,
  });

  // EIP-6963 discovery
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detected = new Map<string, DetectedWallet>();

    function handleAnnounce(event: Event) {
      const e = event as CustomEvent<{
        info: { uuid: string; name: string; icon: string; rdns: string };
        provider: any;
      }>;
      const { info, provider } = e.detail;
      detected.set(info.rdns, {
        uuid: info.uuid,
        name: info.name,
        icon: info.icon,
        rdns: info.rdns,
        provider,
      });
      setState((prev) => ({
        ...prev,
        wallets: Array.from(detected.values()),
      }));
    }

    window.addEventListener('eip6963:announceProvider', handleAnnounce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnounce);
    };
  }, []);

  const connect = useCallback(async (wallet: DetectedWallet) => {
    setState((prev) => ({
      ...prev,
      status: 'connecting',
      selectedWallet: wallet,
      error: null,
    }));

    try {
      const accounts = (await wallet.provider.request({
        method: 'eth_requestAccounts',
      })) as string[];

      const chainIdHex = (await wallet.provider.request({
        method: 'eth_chainId',
      })) as string;

      const chainId = parseInt(chainIdHex, 16);

      setState((prev) => ({
        ...prev,
        status: 'connected',
        address: accounts[0],
        chainId,
      }));

      // Listen for changes
      wallet.provider.on?.('accountsChanged', (accs: string[]) => {
        if (accs.length === 0) {
          setState((prev) => ({
            ...prev,
            status: 'disconnected',
            address: null,
            chainId: null,
            selectedWallet: null,
          }));
        } else {
          setState((prev) => ({ ...prev, address: accs[0] }));
        }
      });

      wallet.provider.on?.('chainChanged', (id: string) => {
        setState((prev) => ({ ...prev, chainId: parseInt(id, 16) }));
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: err?.message || 'Connection rejected',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'disconnected',
      address: null,
      chainId: null,
      selectedWallet: null,
      error: null,
    }));
  }, []);

  const resetError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'disconnected',
      error: null,
    }));
  }, []);

  return { ...state, connect, disconnect, resetError };
}

// Chain name helper
const CHAINS: Record<number, { name: string; color: string }> = {
  1: { name: 'Ethereum', color: '#627EEA' },
  10: { name: 'Optimism', color: '#FF0420' },
  56: { name: 'BNB Chain', color: '#F0B90B' },
  137: { name: 'Polygon', color: '#8247E5' },
  42161: { name: 'Arbitrum', color: '#28A0F0' },
  43114: { name: 'Avalanche', color: '#E84142' },
  8453: { name: 'Base', color: '#0052FF' },
  324: { name: 'zkSync', color: '#8C8DFC' },
  59144: { name: 'Linea', color: '#61DFFF' },
  11155111: { name: 'Sepolia', color: '#CFB5F0' },
};

export function getChainInfo(chainId: number | null) {
  if (!chainId) return { name: 'Unknown', color: '#888' };
  return CHAINS[chainId] || { name: `Chain ${chainId}`, color: '#888' };
}
