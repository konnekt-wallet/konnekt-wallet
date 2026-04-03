import type { WalletInfo } from '../types';

const detectedSolana = new Map<string, { name: string; icon: string; provider: any }>();

// Hardcoded icons for Solana wallets that don't provide icon via API
const SOLANA_ICONS: Record<string, string> = {
  phantom: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24'%3E%3Cpath fill='%23AB9FF2' d='M5.13 19.2c2.297 0 4.023-1.92 5.053-3.436a2.9 2.9 0 0 0-.195.994c0 .885.53 1.516 1.574 1.516c1.433 0 2.965-1.208 3.758-2.51a2 2 0 0 0-.083.524c0 .617.362 1.006 1.1 1.006c2.324 0 4.663-3.959 4.663-7.421C21 7.175 19.58 4.8 16.016 4.8C9.752 4.8 3 12.154 3 16.905C3 18.771 4.044 19.2 5.13 19.2m8.729-9.622c0-.671.39-1.141.96-1.141c.557 0 .947.47.947 1.14c0 .672-.39 1.155-.947 1.155c-.57 0-.96-.483-.96-1.154m2.979 0c0-.671.39-1.141.96-1.141c.557 0 .947.47.947 1.14c0 .672-.39 1.155-.947 1.155c-.57 0-.96-.483-.96-1.154'/%3E%3C/svg%3E",
  solflare: "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFEF46' d='m12.063 12.715l1.245-1.199l2.32.757c1.518.505 2.278 1.43 2.278 2.734c0 .988-.38 1.64-1.14 2.481l-.231.253l.084-.59c.337-2.144-.295-3.07-2.383-3.742zM8.942 5.376l6.327 2.103l-1.37 1.304l-3.291-1.094c-1.139-.378-1.519-.988-1.666-2.27zm-.38 10.682l1.434-1.367l2.7.884c1.413.462 1.898 1.072 1.75 2.607zM6.748 9.96c0-.4.211-.778.57-1.093c.38.547 1.033 1.03 2.067 1.367l2.235.736l-1.244 1.198l-2.194-.715c-1.012-.336-1.434-.84-1.434-1.493M13.371 21c4.64-3.07 7.129-5.152 7.129-7.717c0-1.704-1.012-2.65-3.248-3.386l-1.687-.568l4.619-4.415l-.928-.989l-1.371 1.199L11.409 3c-2.003.652-4.534 2.565-4.534 4.479c0 .21.02.42.084.652c-1.666.946-2.341 1.83-2.341 2.923c0 1.03.548 2.06 2.299 2.628l1.392.463L3.5 18.75l.928.988l1.498-1.366z'/%3E%3C/svg%3E",
  backpack: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24'%3E%3Cpath fill='%23E33E3F' fill-rule='evenodd' d='M13.194 4.415c.666 0 1.29.088 1.87.25C14.496 3.37 13.32 3 12.011 3c-1.312 0-2.49.37-3.055 1.673a6.6 6.6 0 0 1 1.86-.258zm-2.529 1.302c-3.163 0-4.965 2.444-4.965 5.459v3.097c0 .301.256.54.573.54h11.454c.317 0 .573-.239.573-.54v-3.097c0-3.015-2.096-5.459-5.259-5.459zm1.33 5.486c1.108 0 2.005-.882 2.005-1.97c0-1.087-.897-1.968-2.005-1.968c-1.106 0-2.004.881-2.004 1.969c0 1.087.898 1.969 2.005 1.969M5.7 16.633a.56.56 0 0 1 .573-.546h11.454a.56.56 0 0 1 .573.546v3.275c0 .603-.513 1.092-1.145 1.092H6.845c-.632 0-1.145-.489-1.145-1.092z' clip-rule='evenodd'/%3E%3C/svg%3E",
};

export function startSolanaDiscovery(
  onUpdate: (wallets: WalletInfo[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  // Clear previous detections (handles React StrictMode double-mount)
  detectedSolana.clear();

  const w = window as any;

  function check() {
    const phantomSol = w.phantom?.solana;
    const legacySol = w.solana;
    const sf = w.solflare;

    console.log('[konnekt:solana] check:', {
      'phantom.solana': !!phantomSol,
      'window.solana': !!legacySol,
      'solflare': !!sf?.isSolflare,
      'already': Array.from(detectedSolana.keys()),
    });

    // Phantom Solana
    if (phantomSol && !detectedSolana.has('solana:phantom')) {
      detectedSolana.set('solana:phantom', {
        name: 'Phantom',
        icon: phantomSol.icon || SOLANA_ICONS.phantom,
        provider: phantomSol,
      });
      onUpdate(getSolanaWallets());
    }
    // Legacy window.solana
    if (legacySol && !legacySol.isMetaMask && !detectedSolana.has('solana:phantom')) {
      detectedSolana.set('solana:phantom', {
        name: 'Phantom',
        icon: legacySol.icon || SOLANA_ICONS.phantom,
        provider: legacySol,
      });
      onUpdate(getSolanaWallets());
    }
    // Solflare
    if (w.solflare?.isSolflare && !detectedSolana.has('solana:solflare')) {
      // Solflare stores icon in multiple places
      const sfIcon = w.solflare.icon
        || w.solflare.logo
        || w.solflare._icon
        || (w.solflare.constructor?.icon)
        || SOLANA_ICONS.solflare;
      detectedSolana.set('solana:solflare', {
        name: 'Solflare',
        icon: typeof sfIcon === 'string' ? sfIcon : SOLANA_ICONS.solflare,
        provider: w.solflare,
      });
      onUpdate(getSolanaWallets());
    }
    // Backpack
    if (w.backpack && !detectedSolana.has('solana:backpack')) {
      detectedSolana.set('solana:backpack', {
        name: 'Backpack',
        icon: w.backpack.icon || w.backpack.logo || SOLANA_ICONS.backpack,
        provider: w.backpack,
      });
      onUpdate(getSolanaWallets());
    }
  }

  // Poll until wallets appear (they inject async)
  let attempts = 0;
  const maxAttempts = 30; // 30 * 100ms = 3 seconds
  const interval = setInterval(() => {
    check();
    attempts++;
    if (attempts >= maxAttempts) clearInterval(interval);
  }, 100);
  check();

  return () => clearInterval(interval);
}

export function getSolanaWallets(): WalletInfo[] {
  return Array.from(detectedSolana.entries()).map(([id, w]) => ({
    id,
    name: w.name,
    icon: w.icon,
    installed: true,
    type: 'injected' as const,
    chain: 'solana' as const,
  }));
}

export async function connectSolanaWallet(
  walletId: string
): Promise<{ address: string }> {
  const entry = detectedSolana.get(walletId);
  if (!entry) throw new Error(`Solana wallet ${walletId} not found`);

  const provider = entry.provider;

  if (provider.connect) {
    const resp = await provider.connect();
    const pubkey = resp?.publicKey || provider.publicKey;
    if (pubkey) return { address: pubkey.toString() };
  }

  if (provider.publicKey) {
    return { address: provider.publicKey.toString() };
  }

  throw new Error(`Cannot connect to ${entry.name}`);
}

export function getSolanaProvider(walletId: string) {
  return detectedSolana.get(walletId)?.provider ?? null;
}
