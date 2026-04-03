import type { KonnektTheme } from '../types';

export const defaultTheme: Required<KonnektTheme> = {
  accent: '#15803d',
  background: 'rgba(255, 255, 255, 0.05)',
  surface: 'rgba(255, 255, 255, 0.04)',
  text: '#F5F0EB',
  textSecondary: '#8A8680',
  border: 'rgba(255, 255, 255, 0.08)',
  radius: '16px',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  backgroundImage: '',
};

export function resolveTheme(custom?: KonnektTheme): Required<KonnektTheme> {
  return { ...defaultTheme, ...custom };
}

export function injectStyles(theme: Required<KonnektTheme>) {
  const id = 'konnekt-styles';
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css(theme);
  document.head.appendChild(style);
}

function css(t: Required<KonnektTheme>): string {
  return `
.kkt-overlay {
  position:fixed;inset:0;z-index:99999;
  display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.5);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  animation:kkt-fi .2s ease-out;
  font-family:${t.fontFamily};
}
.kkt-modal {
  background:${t.background};
  backdrop-filter:blur(40px) saturate(1.4);-webkit-backdrop-filter:blur(40px) saturate(1.4);
  border:1px solid ${t.border};border-radius:${t.radius};
  width:400px;max-height:540px;overflow:hidden;
  box-shadow:0 24px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.15);
  animation:kkt-su .3s cubic-bezier(.16,1,.3,1);
  display:flex;flex-direction:column;position:relative;
}
.kkt-modal-bg {
  position:absolute;inset:0;background-size:cover;background-position:center;
  opacity:0.12;pointer-events:none;border-radius:inherit;
}
.kkt-modal > *:not(.kkt-modal-bg){position:relative;z-index:1}
.kkt-header {display:flex;align-items:center;justify-content:space-between;padding:20px 24px 8px}
.kkt-title {font-size:17px;font-weight:600;color:${t.text};letter-spacing:-0.3px;margin:0}
.kkt-close {
  width:32px;height:32px;border-radius:12px;
  border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);
  color:rgba(255,255,255,0.4);cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .15s;
}
.kkt-close:hover{background:rgba(255,255,255,0.06);color:${t.text}}
.kkt-subtitle {font-size:13px;color:${t.textSecondary};padding:0 24px 12px;margin:0;line-height:1.5}
.kkt-divider {height:1px;background:rgba(255,255,255,0.06);margin:0 24px}
.kkt-section-label {
  font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;
  color:rgba(255,255,255,0.3);padding:12px 24px 6px;margin:0;
}
.kkt-wallet-list {list-style:none;margin:0;padding:4px 12px 12px;overflow-y:auto;flex:1}
.kkt-wallet-item {
  display:flex;align-items:center;gap:14px;padding:12px;border-radius:12px;
  cursor:pointer;transition:all .15s;border:1px solid transparent;position:relative;
}
.kkt-wallet-item:hover{background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.05)}
.kkt-wallet-item:active{transform:scale(0.98)}
.kkt-wallet-icon {
  width:42px;height:42px;border-radius:12px;overflow:hidden;flex-shrink:0;
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);
  display:flex;align-items:center;justify-content:center;
}
.kkt-wallet-icon img{width:100%;height:100%;object-fit:cover}
.kkt-wallet-info{flex:1;min-width:0}
.kkt-wallet-name{font-size:15px;font-weight:500;color:${t.text};margin:0;line-height:1.3}
.kkt-wallet-tag{font-size:11px;color:rgba(255,255,255,0.3);margin:2px 0 0}
.kkt-installed-dot{width:7px;height:7px;border-radius:50%;background:${t.accent};position:absolute;top:50%;right:36px;transform:translateY(-50%)}
.kkt-arrow{color:rgba(255,255,255,0.2);transition:all .15s}
.kkt-wallet-item:hover .kkt-arrow{transform:translateX(3px);color:rgba(255,255,255,0.6)}
.kkt-state-container{display:flex;flex-direction:column;align-items:center;padding:32px 24px;gap:16px;text-align:center}
.kkt-spinner-ring{width:40px;height:40px;border-radius:50%;border:3px solid rgba(255,255,255,0.08);border-top-color:${t.accent};animation:kkt-sp .8s linear infinite}
.kkt-state-title{font-size:15px;font-weight:600;color:${t.text};margin:0}
.kkt-state-desc{font-size:13px;color:${t.textSecondary};margin:0;line-height:1.5;max-width:260px}
.kkt-success-icon{width:48px;height:48px;border-radius:50%;background:rgba(21,128,61,0.1);display:flex;align-items:center;justify-content:center;animation:kkt-pop .4s cubic-bezier(.16,1,.3,1)}
.kkt-address{font-size:14px;font-weight:500;color:${t.text};background:rgba(255,255,255,0.04);padding:8px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.06);font-family:'SF Mono','JetBrains Mono',monospace;letter-spacing:0.5px}
.kkt-error-icon{width:48px;height:48px;border-radius:50%;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center}
.kkt-btn{padding:8px 20px;border-radius:12px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;border:none;font-family:inherit}
.kkt-btn-primary{background:${t.accent};color:#fff}
.kkt-btn-primary:hover{filter:brightness(1.15)}
.kkt-btn-secondary{background:rgba(255,255,255,0.04);color:${t.text};border:1px solid rgba(255,255,255,0.06)}
.kkt-btn-secondary:hover{background:rgba(255,255,255,0.06)}
.kkt-btn-row{display:flex;gap:8px}
.kkt-chain-badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;padding:3px 10px;border-radius:8px}
.kkt-chain-dot{width:6px;height:6px;border-radius:50%}
.kkt-wallet-preview{width:56px;height:56px;border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06)}
.kkt-wallet-preview img{width:100%;height:100%;object-fit:cover}
.kkt-connect-btn{
  padding:12px 28px;border-radius:14px;border:none;background:${t.accent};color:#fff;
  font-size:15px;font-weight:600;font-family:${t.fontFamily};cursor:pointer;transition:all .15s;
}
.kkt-connect-btn:hover{filter:brightness(1.15)}
.kkt-connect-btn:active{transform:scale(0.98)}
.kkt-connect-btn:disabled{opacity:0.6;cursor:not-allowed}
.kkt-connected-pill{
  display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:16px;
  background:rgba(255,255,255,0.03);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,0.06);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.04);
  font-family:${t.fontFamily};animation:kkt-fi .3s ease-out;
}
.kkt-connected-wallet-icon{width:20px;height:20px;border-radius:6px;object-fit:cover}
.kkt-connected-dot{width:7px;height:7px;border-radius:50%;background:${t.accent};animation:kkt-pu 2s ease-in-out infinite}
.kkt-connected-address{font-size:14px;font-weight:500;font-family:'SF Mono','JetBrains Mono',monospace;color:${t.text};letter-spacing:0.3px}
.kkt-connected-chain{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;padding:3px 10px;border-radius:8px}
.kkt-connected-chain-dot{width:6px;height:6px;border-radius:50%}
.kkt-connected-disconnect{font-size:12px;color:${t.textSecondary};background:none;border:none;cursor:pointer;font-family:${t.fontFamily};padding:2px 4px;transition:color .15s}
.kkt-connected-disconnect:hover{color:#ef4444}
@keyframes kkt-fi{from{opacity:0}to{opacity:1}}
@keyframes kkt-su{from{opacity:0;transform:translateY(16px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes kkt-sp{to{transform:rotate(360deg)}}
@keyframes kkt-pop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes kkt-pu{0%,100%{opacity:1}50%{opacity:0.4}}
.kkt-glow{position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(100px);opacity:0.2;pointer-events:none;z-index:0}
.kkt-footer{padding:8px 24px 12px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.15);text-decoration:none;cursor:pointer;transition:opacity .15s}
.kkt-footer:hover{opacity:0.8}
.kkt-footer-logo{width:16px;height:16px;border-radius:4px;flex-shrink:0}
.kkt-footer-text{font-size:11px;color:rgba(255,255,255,0.25)}
`;
}
