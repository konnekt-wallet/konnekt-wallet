export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  rdns?: string;
  installed: boolean;
  type: 'injected';
  chain: 'evm' | 'solana';
}

export interface KonnektConfig {
  chains?: number[];
  theme?: KonnektTheme;
  autoConnect?: boolean;
}

export interface KonnektTheme {
  accent?: string;
  background?: string;
  surface?: string;
  text?: string;
  textSecondary?: string;
  border?: string;
  radius?: string;
  fontFamily?: string;
  backgroundImage?: string; // URL to a custom background image for the modal
}

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface KonnektState {
  status: ConnectionStatus;
  address: string | null;
  chainId: number | null;
  walletId: string | null;
  error: string | null;
  availableWallets: WalletInfo[];
  isModalOpen: boolean;
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

export interface EIP1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

export interface EIP6963AnnounceProviderEvent extends Event {
  detail: EIP6963ProviderDetail;
}

// Solana Wallet Standard types
export interface SolanaWalletAccount {
  address: string;
  publicKey: Uint8Array;
  chains: string[];
  features: string[];
}

export interface SolanaWallet {
  name: string;
  icon: string;
  accounts: SolanaWalletAccount[];
  chains: string[];
  features: Record<string, any>;
  connect?: () => Promise<void>;
}

export interface SolanaWalletRegisterEvent {
  register: (...wallets: SolanaWallet[]) => void;
  get: () => SolanaWallet[];
  on: (event: string, handler: (...args: any[]) => void) => () => void;
}
