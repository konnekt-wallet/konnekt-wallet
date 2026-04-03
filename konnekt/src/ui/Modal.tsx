import { useEffect, useCallback } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accent?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, accent, children }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="kkt-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Connect wallet"
    >
      {/* Glow behind modal */}
      {accent && accent !== 'transparent' && (
        <div className="kkt-glow" style={{ background: accent }} />
      )}
      <div className="kkt-modal">{children}</div>
    </div>
  );
}
