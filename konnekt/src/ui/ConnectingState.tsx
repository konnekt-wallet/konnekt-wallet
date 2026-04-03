import { BackIcon } from './icons';

interface Props {
  walletName: string;
  walletIcon?: string;
  onBack: () => void;
}

export function ConnectingState({ walletName, walletIcon, onBack }: Props) {
  return (
    <>
      <div className="kkt-header">
        <button className="kkt-close" onClick={onBack} aria-label="Go back">
          <BackIcon />
        </button>
        <p className="kkt-title">Connecting</p>
        <div style={{ width: 32 }} />
      </div>
      <div className="kkt-state-container">
        {walletIcon && (
          <div className="kkt-wallet-preview">
            <img src={walletIcon} alt={walletName} />
          </div>
        )}
        <div className="kkt-spinner-ring" />
        <p className="kkt-state-title">Opening {walletName}</p>
        <p className="kkt-state-desc">Confirm in your wallet</p>
      </div>
    </>
  );
}
