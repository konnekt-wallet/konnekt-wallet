import { CheckIcon } from './icons';

interface Props {
  address: string;
  onDisconnect?: () => void;
}

export function SuccessState({ address, onDisconnect }: Props) {
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="kkt-state-container">
      <div className="kkt-success-icon">
        <CheckIcon />
      </div>
      <p className="kkt-state-title">Connected</p>
      <p className="kkt-address">{short}</p>
      {onDisconnect && (
        <button className="kkt-btn kkt-btn-secondary" onClick={onDisconnect}>
          Disconnect
        </button>
      )}
    </div>
  );
}
