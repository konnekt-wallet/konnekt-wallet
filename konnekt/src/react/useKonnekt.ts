import { useContext } from 'react';
import { KonnektContext } from './KonnektProvider';
import { getProviderByRdns } from '../core/eip6963';
import type { EIP1193Provider } from '../types';

export function useKonnekt() {
  const ctx = useContext(KonnektContext);
  if (!ctx) {
    throw new Error('useKonnekt must be used within <KonnektProvider>');
  }

  const { instance, state } = ctx;

  // Get the raw EIP-1193 provider for the connected wallet
  const provider: EIP1193Provider | null =
    state.walletId ? getProviderByRdns(state.walletId) : null;

  // Get info about the connected wallet
  const connectedWallet = state.walletId
    ? state.availableWallets.find((w) => w.id === state.walletId) ?? null
    : null;

  return {
    // State
    status: state.status,
    address: state.address,
    chainId: state.chainId,
    walletId: state.walletId,
    error: state.error,
    isConnected: state.status === 'connected',
    isConnecting: state.status === 'connecting',
    availableWallets: state.availableWallets,

    // Connected wallet info (name, icon, rdns)
    connectedWallet,

    // Raw provider — use for transactions, signing, etc.
    provider,

    // Actions
    connect: instance.connect,
    disconnect: instance.disconnect,
    openModal: instance.openModal,
    closeModal: instance.closeModal,
  };
}
