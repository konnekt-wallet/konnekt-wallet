// Core
export { createKonnekt } from './core/connector';
export type { KonnektInstance } from './core/connector';
export type { Store } from './core/store';
export { getProviderByRdns } from './core/eip6963';
export { connectSolanaWallet, getSolanaProvider } from './core/solana';

// React
export { KonnektProvider } from './react/KonnektProvider';
export { useKonnekt } from './react/useKonnekt';
export { KonnektModal } from './react/KonnektModal';
export { KonnektButton } from './react/KonnektButton';

// UI
export { getWalletIcon, WALLET_ICON_MAP } from './ui/wallet-icons';
export {
  MetaMaskIcon,
  CoinbaseIcon,
  RabbyIcon,
  PhantomIcon,
  TrustWalletIcon,
  OKXIcon,
  BraveIcon,
} from './ui/wallet-icons';

// Types
export type {
  KonnektConfig,
  KonnektTheme,
  KonnektState,
  WalletInfo,
  ConnectionStatus,
  EIP1193Provider,
} from './types';
