import { useContext, useEffect } from 'react';
import { KonnektContext } from './KonnektProvider';
import { getProviderByRdns } from '../core/eip6963';
import { resolveTheme, injectStyles } from '../ui/styles';

const CHAINS: Record<number, { name: string; color: string }> = {
  1: { name: 'Ethereum', color: '#627EEA' },
  10: { name: 'Optimism', color: '#FF0420' },
  56: { name: 'BNB Chain', color: '#F0B90B' },
  137: { name: 'Polygon', color: '#8247E5' },
  42161: { name: 'Arbitrum', color: '#28A0F0' },
  43114: { name: 'Avalanche', color: '#E84142' },
  8453: { name: 'Base', color: '#0052FF' },
  324: { name: 'zkSync', color: '#8C8DFC' },
  59144: { name: 'Linea', color: '#61DFFF' },
  11155111: { name: 'Sepolia', color: '#CFB5F0' },
};

export function KonnektButton() {
  const ctx = useContext(KonnektContext);
  if (!ctx) throw new Error('KonnektButton must be used within <KonnektProvider>');

  const { instance, state } = ctx;
  const resolved = resolveTheme();

  useEffect(() => { injectStyles(resolved); }, []);

  const wallet = state.walletId
    ? state.availableWallets.find((w) => w.id === state.walletId)
    : null;

  const chain = state.chainId === 0
    ? { name: 'Solana', color: '#9945FF' }
    : state.chainId ? CHAINS[state.chainId] || { name: `${state.chainId}`, color: '#888' } : null;
  const short = state.address ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}` : '';

  if (state.status === 'connected' && state.address) {
    return (
      <div className="kkt-connected-pill">
        {wallet?.icon && (
          <img src={wallet.icon} alt={wallet.name} className="kkt-connected-wallet-icon" />
        )}
        <span className="kkt-connected-dot" />
        <span className="kkt-connected-address">{short}</span>
        {chain && (
          <span className="kkt-connected-chain" style={{ color: chain.color, background: `${chain.color}18` }}>
            <span className="kkt-connected-chain-dot" style={{ background: chain.color }} />
            {chain.name}
          </span>
        )}
        <button className="kkt-connected-disconnect" onClick={() => instance.disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      className="kkt-connect-btn"
      onClick={() => instance.openModal()}
      disabled={state.status === 'connecting'}
    >
      {state.status === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
