import { useContext, useEffect, useState, useCallback } from 'react';
import type { KonnektTheme, WalletInfo } from '../types';
import { KonnektContext } from './KonnektProvider';
import { Modal } from '../ui/Modal';
import { WalletList } from '../ui/WalletList';
import { ConnectingState } from '../ui/ConnectingState';
import { SuccessState } from '../ui/SuccessState';
import { ErrorState } from '../ui/ErrorState';
import { NetworkSwitcher } from '../ui/NetworkSwitcher';
import { Footer } from '../ui/Footer';
import { CloseIcon } from '../ui/icons';
import { resolveTheme, injectStyles } from '../ui/styles';

interface Props {
  theme?: KonnektTheme;
}

type View = 'list' | 'connecting' | 'success' | 'error';

export function KonnektModal({ theme }: Props) {
  const ctx = useContext(KonnektContext);
  if (!ctx) return null;

  const { instance, state } = ctx;
  const resolved = resolveTheme(theme);
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);

  useEffect(() => {
    injectStyles(resolved);
  }, [resolved]);

  let view: View = 'list';
  if (state.status === 'connecting') view = 'connecting';
  else if (state.status === 'connected' && state.isModalOpen) view = 'success';
  else if (state.status === 'error') view = 'error';

  const handleSelect = useCallback(
    (wallet: WalletInfo) => {
      setSelectedWallet(wallet);
      instance.connect(wallet.id);
    },
    [instance]
  );

  const handleBack = useCallback(() => {
    setSelectedWallet(null);
    instance.store.setStatus('disconnected');
  }, [instance]);

  const handleRetry = useCallback(() => {
    if (selectedWallet) {
      instance.connect(selectedWallet.id);
    }
  }, [instance, selectedWallet]);

  const handleClose = useCallback(() => {
    instance.closeModal();
    if (state.status !== 'connected') {
      setSelectedWallet(null);
      instance.store.setStatus('disconnected');
    }
  }, [instance, state.status]);

  useEffect(() => {
    if (view === 'success') {
      const timer = setTimeout(() => {
        instance.closeModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [view, instance]);

  const injectedWallets = state.availableWallets.filter(
    (w) => w.type === 'injected' && w.installed
  );

  return (
    <Modal isOpen={state.isModalOpen} onClose={handleClose} accent={resolved.accent}>
      {resolved.backgroundImage && (
        <div
          className="kkt-modal-bg"
          style={{ backgroundImage: `url(${resolved.backgroundImage})` }}
        />
      )}
      {view === 'list' && (
        <>
          <div className="kkt-header">
            <p className="kkt-title">Connect Wallet</p>
            <button className="kkt-close" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>
          <p className="kkt-subtitle">
            {injectedWallets.length > 0
              ? 'Choose from your installed wallets'
              : 'No wallets detected'}
          </p>
          <div className="kkt-divider" />
          <WalletList
            wallets={state.availableWallets}
            onSelect={handleSelect}
          />
          <Footer />
        </>
      )}

      {view === 'connecting' && (
        <ConnectingState
          walletName={selectedWallet?.name ?? 'Wallet'}
          walletIcon={selectedWallet?.icon}
          onBack={handleBack}
        />
      )}

      {view === 'success' && state.address && (
        <>
          <div className="kkt-header">
            <p className="kkt-title">Connected</p>
            <NetworkSwitcher currentChainId={state.chainId} />
          </div>
          <SuccessState address={state.address} onDisconnect={() => { instance.disconnect(); instance.closeModal(); }} />
        </>
      )}

      {view === 'error' && (
        <ErrorState
          message={state.error ?? 'Something went wrong'}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </Modal>
  );
}
