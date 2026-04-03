# Konnekt

Lightweight, no-bullshit wallet connector for EVM dApps. Pure injected wallet detection via EIP-6963. No WalletConnect, no social logins, no email wallets, no third-party services. Just your users' browser wallets.

**Zero dependencies. Zero API keys. Zero subscriptions.**

## Install

```bash
npm install konnekt
```

## Quick Start

```tsx
import { KonnektProvider, useKonnekt } from 'konnekt';

function App() {
  return (
    <KonnektProvider config={{}}>
      <ConnectButton />
    </KonnektProvider>
  );
}

function ConnectButton() {
  const { isConnected, address, chainId, openModal, disconnect } = useKonnekt();

  if (isConnected) {
    return (
      <div>
        <p>{address}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return <button onClick={openModal}>Connect Wallet</button>;
}
```

That's it. No project IDs, no config files, no dashboard signups.

## What it does

- Detects all installed browser wallets automatically via EIP-6963
- Shows a clean modal with detected wallets
- Connects with one click
- Tracks account and chain changes in real-time
- Provides React hooks for everything

## What it doesn't do

- No WalletConnect (no relay servers, no QR codes)
- No social logins (no Google, no Discord, no email)
- No embedded wallets
- No analytics, no tracking
- No external API calls whatsoever

## Supported Wallets

Any wallet that implements EIP-6963 (which is all modern wallets):

MetaMask, Coinbase Wallet, Rabby, Phantom, Trust Wallet, OKX Wallet, Brave Wallet, Rainbow, Zerion, and more.

## Theming

```tsx
<KonnektProvider config={{
  theme: {
    accent: '#15803d',
    background: '#0F0F0F',
    surface: '#1A1A1A',
    text: '#F5F0EB',
    border: '#2A2A2A',
    radius: '16px',
    backgroundImage: '/your-project-art.jpg', // optional bg for the modal
  }
}}>
```

## API

### `useKonnekt()`

```ts
const {
  status,        // 'disconnected' | 'connecting' | 'connected' | 'error'
  address,       // string | null
  chainId,       // number | null
  walletId,      // string | null (rdns of connected wallet)
  error,         // string | null
  isConnected,   // boolean
  isConnecting,  // boolean
  availableWallets, // WalletInfo[]
  connect,       // (walletId: string) => Promise<void>
  disconnect,    // () => void
  openModal,     // () => void
  closeModal,    // () => void
} = useKonnekt();
```

### `createKonnekt()` (vanilla JS)

```ts
import { createKonnekt } from 'konnekt';

const konnekt = createKonnekt();

konnekt.store.subscribe((state) => {
  console.log(state.address, state.chainId);
});

await konnekt.connect('io.metamask');
konnekt.disconnect();
konnekt.destroy();
```

## Size

~37KB ESM. Zero runtime dependencies. React 18+ as peer dep.

## License

MIT
