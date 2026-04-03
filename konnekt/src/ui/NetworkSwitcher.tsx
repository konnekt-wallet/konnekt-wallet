const CHAIN_NAMES: Record<number, string> = {
  0: 'Solana',
  1: 'Ethereum',
  10: 'Optimism',
  56: 'BNB Chain',
  137: 'Polygon',
  42161: 'Arbitrum',
  43114: 'Avalanche',
  8453: 'Base',
  324: 'zkSync',
  59144: 'Linea',
  534352: 'Scroll',
};

const CHAIN_COLORS: Record<number, string> = {
  0: '#9945FF',
  1: '#627EEA',
  10: '#FF0420',
  56: '#F0B90B',
  137: '#8247E5',
  42161: '#28A0F0',
  43114: '#E84142',
  8453: '#0052FF',
  324: '#8C8DFC',
  59144: '#61DFFF',
  534352: '#FFEEDA',
};

interface Props {
  currentChainId: number | null;
}

export function NetworkSwitcher({ currentChainId }: Props) {
  if (currentChainId === null && currentChainId !== 0) return null;

  const name = CHAIN_NAMES[currentChainId] ?? `Chain ${currentChainId}`;
  const color = CHAIN_COLORS[currentChainId] ?? '#8A8680';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 500,
      color,
      background: `${color}15`,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
      }} />
      {name}
    </div>
  );
}
