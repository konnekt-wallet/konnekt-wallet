import { ErrorIcon, BackIcon } from './icons';

interface Props {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}

export function ErrorState({ message, onRetry, onBack }: Props) {
  return (
    <>
      <div className="kkt-header">
        <button className="kkt-close" onClick={onBack} aria-label="Go back">
          <BackIcon />
        </button>
        <p className="kkt-title">Error</p>
        <div style={{ width: 32 }} />
      </div>
      <div className="kkt-state-container">
        <div className="kkt-error-icon">
          <ErrorIcon />
        </div>
        <p className="kkt-state-title">Connection failed</p>
        <p className="kkt-state-desc">{message}</p>
        <div className="kkt-btn-row">
          <button className="kkt-btn kkt-btn-secondary" onClick={onBack}>
            Back
          </button>
          <button className="kkt-btn kkt-btn-primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      </div>
    </>
  );
}
