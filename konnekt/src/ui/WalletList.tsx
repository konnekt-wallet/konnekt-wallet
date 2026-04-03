import type { WalletInfo } from '../types';
import { WalletItem } from './WalletItem';

interface Props {
  wallets: WalletInfo[];
  onSelect: (wallet: WalletInfo) => void;
}

export function WalletList({ wallets, onSelect }: Props) {
  const evm = wallets.filter((w) => w.chain === 'evm' && w.installed);
  const solana = wallets.filter((w) => w.chain === 'solana' && w.installed);

  return (
    <>
      {evm.length > 0 && (
        <>
          <p className="kkt-section-label">EVM Wallets</p>
          <ul className="kkt-wallet-list">
            {evm.map((w) => (
              <WalletItem key={w.id} wallet={w} onClick={() => onSelect(w)} />
            ))}
          </ul>
        </>
      )}

      {solana.length > 0 && (
        <>
          {evm.length > 0 && <div className="kkt-divider" />}
          <p className="kkt-section-label">Solana Wallets</p>
          <ul className="kkt-wallet-list">
            {solana.map((w) => (
              <WalletItem key={w.id} wallet={w} onClick={() => onSelect(w)} />
            ))}
          </ul>
        </>
      )}

      {wallets.length === 0 && (
        <div className="kkt-state-container">
          <p className="kkt-state-desc">
            No wallets detected. Install a browser wallet extension to connect.
          </p>
        </div>
      )}
    </>
  );
}
