import { useContext } from 'react';
import { KonnektContext } from './KonnektProvider';

export function useKonnekt() {
  const ctx = useContext(KonnektContext);
  if (!ctx) {
    throw new Error('useKonnekt must be used within <KonnektProvider>');
  }

  const { instance, state } = ctx;

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
    connectedWallet,

    // Raw provider
    provider: instance.getProvider(),

    // Actions
    connect: instance.connect,
    disconnect: instance.disconnect,
    openModal: instance.openModal,
    closeModal: instance.closeModal,

    // Signing & transactions
    signMessage: instance.signMessage,
    sendTransaction: instance.sendTransaction,
  };
}
