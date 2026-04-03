import type {
  EIP6963ProviderDetail,
  EIP6963AnnounceProviderEvent,
  WalletInfo,
  EIP1193Provider,
} from '../types';

const detectedProviders = new Map<string, EIP6963ProviderDetail>();

export function startEIP6963Discovery(
  onUpdate: (wallets: WalletInfo[]) => void
): () => void {
  function handleAnnounce(event: Event) {
    const e = event as EIP6963AnnounceProviderEvent;
    const { info, provider } = e.detail;
    detectedProviders.set(info.rdns, { info, provider });
    onUpdate(getDetectedWallets());
  }

  window.addEventListener('eip6963:announceProvider', handleAnnounce);
  window.dispatchEvent(new Event('eip6963:requestProvider'));

  return () => {
    window.removeEventListener('eip6963:announceProvider', handleAnnounce);
  };
}

export function getDetectedWallets(): WalletInfo[] {
  return Array.from(detectedProviders.entries()).map(([rdns, detail]) => ({
    id: rdns,
    name: detail.info.name,
    icon: detail.info.icon,
    rdns,
    installed: true,
    type: 'injected' as const,
    chain: 'evm' as const,
  }));
}

export function getProviderByRdns(rdns: string): EIP1193Provider | null {
  return detectedProviders.get(rdns)?.provider ?? null;
}
