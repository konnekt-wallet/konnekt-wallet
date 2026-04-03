import type { KonnektState, WalletInfo, ConnectionStatus } from '../types';

type Listener = (state: KonnektState) => void;

const initialState: KonnektState = {
  status: 'disconnected',
  address: null,
  chainId: null,
  walletId: null,
  error: null,
  availableWallets: [],
  isModalOpen: false,
};

export function createStore() {
  let state: KonnektState = { ...initialState };
  const listeners = new Set<Listener>();

  function getState(): KonnektState {
    return state;
  }

  function setState(partial: Partial<KonnektState>) {
    state = { ...state, ...partial };
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function reset() {
    setState({ ...initialState, availableWallets: state.availableWallets });
  }

  function setWallets(wallets: WalletInfo[]) {
    setState({ availableWallets: wallets });
  }

  function setStatus(status: ConnectionStatus, error?: string) {
    setState({ status, error: error ?? null });
  }

  function setConnected(address: string, chainId: number, walletId: string) {
    setState({
      status: 'connected',
      address,
      chainId,
      walletId,
      error: null,
    });
  }

  function openModal() {
    setState({ isModalOpen: true });
  }

  function closeModal() {
    setState({ isModalOpen: false });
  }

  return {
    getState,
    setState,
    subscribe,
    reset,
    setWallets,
    setStatus,
    setConnected,
    openModal,
    closeModal,
  };
}

export type Store = ReturnType<typeof createStore>;
