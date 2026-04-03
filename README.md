# Konnekt

Clean web3 wallet connector. No Google, no Discord, no email wallets — just crypto.

## What's inside

- `konnekt/` — the SDK (published as [`konnekt-wallet`](https://www.npmjs.com/package/konnekt-wallet) on npm)
- `konnekt-landing/` — the landing page & playground

## SDK

Liquid glass modal, EIP-6963 auto-detection, Solana wallet support, message signing, transactions, 6-param theming, ~48KB bundle.

### Install

```bash
npm install konnekt-wallet
```

### Quick start

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

### Sign & Send

```tsx
const { signMessage, sendTransaction } = useKonnekt();

// Sign (EVM + Solana)
const sig = await signMessage('Hello!');

// Send transaction (EVM)
const hash = await sendTransaction({ to: '0x...', value: '0x0' });

// Send transaction (Solana)
const hash = await sendTransaction(solanaTx);
```

### Supported wallets

**EVM** — any EIP-6963 wallet (MetaMask, Coinbase, Rabby, Phantom, Trust, OKX, Brave, etc.)

**Solana** — Phantom, Solflare, Backpack

## Landing

```bash
cd konnekt-landing
npm install
npm run dev
```

## Links

- [npm](https://www.npmjs.com/package/konnekt-wallet)
- [GitHub](https://github.com/konnekt-wallet/konnekt-wallet)

## License

MIT
