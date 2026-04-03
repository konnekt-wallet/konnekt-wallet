import type { WalletInfo } from '../types';
import { ArrowIcon } from './icons';

interface Props {
  wallet: WalletInfo;
  onClick: () => void;
}

export function WalletItem({ wallet, onClick }: Props) {
  return (
    <li className="kkt-wallet-item" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={`Connect with ${wallet.name}`}
    >
      <div className="kkt-wallet-icon">
        {wallet.icon ? (
          <img src={wallet.icon} alt={wallet.name} />
        ) : (
          <FallbackIcon name={wallet.name} />
        )}
      </div>
      <div className="kkt-wallet-info">
        <p className="kkt-wallet-name">{wallet.name}</p>
        <p className="kkt-wallet-tag">{wallet.chain === 'solana' ? 'Solana' : 'EVM'}</p>
      </div>
      {wallet.installed && (
        <span className="kkt-installed-dot" title="Installed" />
      )}
      <span className="kkt-arrow">
        <ArrowIcon />
      </span>
    </li>
  );
}

function FallbackIcon({ name }: { name: string }) {
  const colors = ['#15803d', '#6E9EF5', '#F5C542', '#C084FC', '#F97316', '#38BDF8'];
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="14" fill={colors[index]} fillOpacity="0.12" />
      <text x="22" y="27" textAnchor="middle" fill={colors[index]} fontSize="18" fontWeight="600" fontFamily="system-ui, sans-serif">
        {name.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}
