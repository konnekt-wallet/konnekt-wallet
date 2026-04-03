# konnekt-wallet

Clean web3 wallet connector. No web2 noise, just crypto.

Liquid glass UI, EIP-6963 auto-detection, Solana support, signing, transactions, 6-param theming, ~48KB.

## Install

```bash
npm install konnekt-wallet
```

## Usage

```tsx
import { KonnektProvider, useKonnekt } from 'konnekt-wallet';

function App() {
  return (
    <KonnektProvider config={{
      theme: { accent: '#22C55E' }
    }}>
      <ConnectButton />
    </KonnektProvider>
  );
}

function ConnectButton() {
  const { isConnected, address, openModal, disconnect } = useKonnekt();

  if (isConnected) {
    return <button onClick={disconnect}>{address?.slice(0, 6)}...</button>;
  }
  return <button onClick={openModal}>Connect Wallet</button>;
}
```

## Sign Messages

```tsx
const { signMessage } = useKonnekt();

// Works with both EVM (personal_sign) and Solana wallets
const signature = await signMessage('Hello from Konnekt!');
```

## Send Transactions

```tsx
const { sendTransaction } = useKonnekt();

// EVM
const hash = await sendTransaction({
  to: '0x...',
  value: '0x0',
  data: '0x',
});

// Solana — pass a Transaction object
const sig = await sendTransaction(solanaTx);
```

## Raw Provider

```tsx
const { provider } = useKonnekt();

// EVM: EIP-1193 provider
// Solana: Phantom/Solflare/Backpack provider
// Use for anything not covered by the helpers above
```

## Wallets

**EVM** — MetaMask, Coinbase Wallet, Rabby, Phantom, Trust Wallet, OKX, Brave, and any EIP-6963 wallet.

**Solana** — Phantom, Solflare, Backpack.

## Theme

```tsx
<KonnektProvider config={{
  theme: {
    accent: '#8B5CF6',
    backgroundImage: 'https://example.com/bg.jpg',
  }
}}>
```

## API

```tsx
const {
  isConnected,       // boolean
  isConnecting,      // boolean
  address,           // string | null
  chainId,           // number | null
  walletId,          // string | null
  error,             // string | null
  availableWallets,  // WalletInfo[]
  connectedWallet,   // WalletInfo | null
  provider,          // raw EIP-1193 or Solana provider

  connect,           // (walletId: string) => Promise<void>
  disconnect,        // () => void
  openModal,         // () => void
  closeModal,        // () => void
  signMessage,       // (message: string) => Promise<string>
  sendTransaction,   // (tx: any) => Promise<string>
} = useKonnekt();
```

## License

MIT
