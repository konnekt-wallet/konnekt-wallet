import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

type Tab = 'customize' | 'connect' | 'animations';
type ModalView = 'list' | 'connecting' | 'connected' | 'error';
type ThemeKey = 'none' | 'emerald' | 'violet' | 'amber' | 'cyan' | 'rose';

interface DetectedWallet {
  uuid: string; name: string; icon: string; rdns: string; provider: any; chain: 'evm' | 'solana';
}

const THEMES: Record<ThemeKey, { accent: string; label: string }> = {
  none:    { accent: 'transparent', label: 'No Theme' },
  emerald: { accent: '#22C55E', label: 'Emerald' },
  violet:  { accent: '#8B5CF6', label: 'Violet' },
  amber:   { accent: '#F59E0B', label: 'Amber' },
  cyan:    { accent: '#06B6D4', label: 'Cyan' },
  rose:    { accent: '#F43F5E', label: 'Rose' },
};

const CHAINS: Record<number, { name: string; color: string }> = {
  1: { name: 'Ethereum', color: '#627EEA' }, 10: { name: 'Optimism', color: '#FF0420' },
  56: { name: 'BNB Chain', color: '#F0B90B' }, 137: { name: 'Polygon', color: '#8247E5' },
  42161: { name: 'Arbitrum', color: '#28A0F0' }, 8453: { name: 'Base', color: '#0052FF' },
  11155111: { name: 'Sepolia', color: '#CFB5F0' },
};
function getChain(id: number | null) { return id ? CHAINS[id] || { name: `Chain ${id}`, color: '#888' } : { name: 'Unknown', color: '#888' }; }

// ─── SVG Icons (same as SDK konnekt/src/ui/icons.tsx) ───
function IconClose() { return (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function IconBack() { return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function IconArrow() { return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function IconCheck({ color = '#4ADE80' }: { color?: string }) { return (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 14.5L11.5 19L21 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function IconAlert() { return (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4L3 23H25L14 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 10V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="14" cy="19.5" r="1" fill="currentColor"/></svg>); }
function IconEmpty() { return (<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 14H28" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="20" r="1.5" fill="currentColor" opacity="0.4"/></svg>); }

// ─── Inject SDK-identical CSS ───
function injectKktCSS(accent: string) {
  const id = 'kkt-playground-styles';
  const existing = document.getElementById(id);

  const isNone = accent === 'transparent';
  const dotColor = isNone ? 'rgba(255,255,255,0.3)' : accent;
  const btnBg = isNone ? 'rgba(255,255,255,0.1)' : accent;
  const successBg = isNone ? 'rgba(255,255,255,0.06)' : `${accent}1A`;

  // Always update CSS variables on the root
  document.documentElement.style.setProperty('--kkt-accent', dotColor);
  document.documentElement.style.setProperty('--kkt-btn-bg', btnBg);
  document.documentElement.style.setProperty('--kkt-success-bg', successBg);

  // Only inject the stylesheet once
  if (existing) return;

  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
.kkt-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:kkt-fi .2s ease-out;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.kkt-modal{background:rgba(255,255,255,0.05);backdrop-filter:blur(40px) saturate(1.4);-webkit-backdrop-filter:blur(40px) saturate(1.4);border:1px solid rgba(255,255,255,0.08);border-radius:16px;width:400px;max-height:540px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.15);animation:kkt-su .3s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column}
.kkt-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 8px}
.kkt-title{font-size:17px;font-weight:600;color:#F5F0EB;letter-spacing:-0.3px;margin:0}
.kkt-close{width:32px;height:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.4);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.kkt-close:hover{background:rgba(255,255,255,0.06);color:#F5F0EB}
.kkt-subtitle{font-size:13px;color:#8A8680;padding:0 24px 12px;margin:0;line-height:1.5}
.kkt-divider{height:1px;background:rgba(255,255,255,0.06);margin:0 24px}
.kkt-section-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:rgba(255,255,255,0.3);padding:12px 24px 6px;margin:0}
.kkt-wallet-list{list-style:none;margin:0;padding:4px 12px 12px;overflow-y:auto;flex:1}
.kkt-wallet-item{display:flex;align-items:center;gap:14px;padding:12px;border-radius:12px;cursor:pointer;transition:all .15s;border:1px solid transparent;position:relative}
.kkt-wallet-item:hover{background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.05)}
.kkt-wallet-item:active{transform:scale(0.98)}
.kkt-wallet-icon{width:42px;height:42px;border-radius:12px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center}
.kkt-wallet-icon img{width:100%;height:100%;object-fit:cover}
.kkt-wallet-info{flex:1;min-width:0}
.kkt-wallet-name{font-size:15px;font-weight:500;color:#F5F0EB;margin:0;line-height:1.3}
.kkt-wallet-tag{font-size:11px;color:rgba(255,255,255,0.3);margin:2px 0 0}
.kkt-installed-dot{width:7px;height:7px;border-radius:50%;background:var(--kkt-accent)}
.kkt-arrow{color:rgba(255,255,255,0.2);transition:all .15s}
.kkt-wallet-item:hover .kkt-arrow{transform:translateX(3px);color:rgba(255,255,255,0.6)}
.kkt-state-container{display:flex;flex-direction:column;align-items:center;padding:32px 24px;gap:16px;text-align:center}
.kkt-spinner-ring{width:40px;height:40px;border-radius:50%;border:3px solid rgba(255,255,255,0.08);border-top-color:var(--kkt-accent);animation:kkt-sp .8s linear infinite}
.kkt-state-title{font-size:15px;font-weight:600;color:#F5F0EB;margin:0}
.kkt-state-desc{font-size:13px;color:#8A8680;margin:0;line-height:1.5;max-width:260px}
.kkt-success-icon{width:48px;height:48px;border-radius:50%;background:var(--kkt-success-bg);display:flex;align-items:center;justify-content:center;animation:kkt-pop .4s cubic-bezier(.16,1,.3,1)}
.kkt-address{font-size:14px;font-weight:500;color:#F5F0EB;background:rgba(255,255,255,0.04);padding:8px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.06);font-family:'SF Mono','JetBrains Mono',monospace;letter-spacing:0.5px}
.kkt-error-icon{width:48px;height:48px;border-radius:50%;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center}
.kkt-btn{padding:8px 20px;border-radius:12px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;border:none;font-family:inherit}
.kkt-btn-primary{background:var(--kkt-btn-bg);color:#fff}
.kkt-btn-primary:hover{filter:brightness(1.15)}
.kkt-btn-secondary{background:rgba(255,255,255,0.04);color:#F5F0EB;border:1px solid rgba(255,255,255,0.06)}
.kkt-btn-secondary:hover{background:rgba(255,255,255,0.06)}
.kkt-btn-row{display:flex;gap:8px}
.kkt-wallet-preview{width:56px;height:56px;border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06)}
.kkt-wallet-preview img{width:100%;height:100%;object-fit:cover}
.kkt-chain-badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;padding:3px 10px;border-radius:8px}
.kkt-footer{padding:8px 24px 12px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.15)}
.kkt-footer-logo{width:16px;height:16px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.kkt-footer-logo-text{color:#fff;font-size:9px;font-weight:800;line-height:1}
.kkt-footer-text{font-size:11px;color:rgba(255,255,255,0.25)}
.kkt-glow{position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(100px);opacity:0.2;pointer-events:none;z-index:0}
@keyframes kkt-fi{from{opacity:0}to{opacity:1}}
@keyframes kkt-su{from{opacity:0;transform:translateY(16px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes kkt-sp{to{transform:rotate(360deg)}}
@keyframes kkt-pop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
`;
  document.head.appendChild(s);
}

export function Playground() {
  const [tab, setTab] = useState<Tab>('customize');
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="playground" className="py-28 px-10 max-w-[1200px] mx-auto" ref={ref}>
      <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <span className="text-[11px] font-bold tracking-[1.5px] text-emerald-500 block mb-4">PLAYGROUND</span>
        <h2 className="text-5xl font-extrabold leading-[1.1] tracking-[-2px] mb-4">Try it yourself</h2>
        <p className="text-[17px] leading-relaxed text-text-secondary max-w-[560px] mx-auto">
          This is exactly what you get out of the box. Same modal, same animations, same glass style.
        </p>
      </div>

      <div className={`flex justify-center gap-2 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {([['customize', 'Customize'], ['connect', 'Connect Wallet'], ['animations', 'Animations']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`text-[13px] font-medium px-5 py-2.5 rounded-xl transition-all ${
              tab === key ? 'glass text-emerald-400' : 'text-text-secondary hover:text-text-primary border border-transparent hover:border-white/5'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {tab === 'customize' && <CustomizeTab />}
        {tab === 'connect' && <ConnectTab />}
        {tab === 'animations' && <AnimationsTab />}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CUSTOMIZE — renders SDK modal with kkt-* classes
// ═══════════════════════════════════════════
function CustomizeTab() {
  const [theme, setTheme] = useState<ThemeKey>('emerald');
  const [realWallets, setRealWallets] = useState<DetectedWallet[]>([]);
  const [bgImage, setBgImage] = useState('');
  const t = THEMES[theme];
  const isNone = theme === 'none';

  useEffect(() => { injectKktCSS(t.accent); }, [t.accent]);

  // Detect real wallets for their icons
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const detected = new Map<string, DetectedWallet>();
    function handle(event: Event) {
      const e = event as CustomEvent<{ info: { uuid: string; name: string; icon: string; rdns: string }; provider: any }>;
      const { info, provider } = e.detail;
      detected.set(info.rdns, { ...info, provider, chain: 'evm' as const });
      setRealWallets(Array.from(detected.values()));
    }
    window.addEventListener('eip6963:announceProvider', handle);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    return () => window.removeEventListener('eip6963:announceProvider', handle);
  }, []);

  const displayWallets = realWallets.length > 0
    ? realWallets.slice(0, 5)
    : [
        { name: 'MetaMask', rdns: 'io.metamask', icon: '', uuid: '', provider: null, chain: 'evm' as const },
        { name: 'Coinbase Wallet', rdns: 'com.coinbase.wallet', icon: '', uuid: '', provider: null, chain: 'evm' as const },
      ];

  const codeSnippet = isNone
    ? (bgImage
      ? `<KonnektProvider config={{
  theme: {
    backgroundImage: '${bgImage}',
  },
}}>
  <App />
</KonnektProvider>`
      : `<KonnektProvider config={{}}>
  <App />
</KonnektProvider>`)
    : `<KonnektProvider config={{
  theme: {
    accent: '${t.accent}',${bgImage ? `\n    backgroundImage: '${bgImage}',` : ''}
  },
}}>
  <App />
</KonnektProvider>`;

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <div className="flex flex-col gap-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-[11px] font-bold tracking-[0.8px] text-text-muted mb-3">THEME</p>
          <div className="flex flex-col gap-1">
            {(Object.entries(THEMES) as [ThemeKey, typeof t][]).map(([key, preset]) => (
              <button key={key} onClick={() => setTheme(key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${theme === key ? 'glass-subtle' : 'hover:bg-white/[0.02]'}`}>
                {key === 'none' ? (
                  <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 7L7 1" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full" style={{ background: preset.accent, boxShadow: `0 0 12px ${preset.accent}40` }} />
                )}
                <span className={`text-[13px] font-medium ${theme === key ? 'text-text-primary' : 'text-text-secondary'}`}>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[11px] font-bold tracking-[0.8px] text-text-muted mb-3">BACKGROUND IMAGE</p>
          <input
            type="text"
            placeholder="Paste image URL..."
            value={bgImage}
            onChange={(e) => setBgImage(e.target.value)}
            className="w-full text-[12px] font-mono bg-black/20 border border-white/[0.06] rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-white/[0.12] transition-colors"
          />
          {bgImage && (
            <button onClick={() => setBgImage('')} className="text-[11px] text-text-muted hover:text-text-secondary mt-2 transition-colors">Clear</button>
          )}
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[11px] font-bold tracking-[0.8px] text-text-muted mb-3">WHAT YOU WRITE</p>
          <pre className="text-[11px] font-mono text-text-secondary leading-relaxed bg-black/20 p-3 rounded-lg border border-white/[0.04] overflow-x-auto">
{codeSnippet}
          </pre>
        </div>
      </div>

      {/* SDK modal preview */}
      <div className="glass rounded-2xl flex items-center justify-center p-10 relative overflow-hidden min-h-[520px]">
        {!isNone && <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-20" style={{ background: t.accent }} />}

        <div className="kkt-modal" style={{ position: 'relative', animation: 'none' }}>
          {bgImage && (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12, borderRadius: 'inherit', pointerEvents: 'none' }} />
          )}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="kkt-header">
            <p className="kkt-title">Connect Wallet</p>
            <button className="kkt-close"><IconClose /></button>
          </div>
          <p className="kkt-subtitle">Choose from your installed wallets</p>
          <div className="kkt-divider" />
          <p className="kkt-section-label">Detected</p>
          <ul className="kkt-wallet-list">
            {displayWallets.map((w) => (
              <li key={w.rdns} className="kkt-wallet-item">
                <div className="kkt-wallet-icon">
                  {w.icon ? (
                    <img src={w.icon} alt={w.name} />
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>{w.name[0]}</span>
                  )}
                </div>
                <div className="kkt-wallet-info">
                  <p className="kkt-wallet-name">{w.name}</p>
                  <p className="kkt-wallet-tag">{w.rdns}</p>
                </div>
                <span className="kkt-installed-dot" />
                <span className="kkt-arrow"><IconArrow /></span>
              </li>
            ))}
          </ul>
          <div className="kkt-footer">
            <div className="kkt-footer-logo" style={{ background: isNone ? '#22C55E' : t.accent }}>
              <span className="kkt-footer-logo-text">K</span>
            </div>
            <span className="kkt-footer-text">Powered by Konnekt</span>
          </div>
          </div>{/* close inner z-index wrapper */}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// CONNECT — real EIP-6963, uses kkt-* classes
// ═══════════════════════════════════════════
function ConnectTab() {
  const [wallets, setWallets] = useState<DetectedWallet[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<ModalView>('list');
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [selected, setSelected] = useState<DetectedWallet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { injectKktCSS('#22C55E'); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const detected = new Map<string, DetectedWallet>();

    // EIP-6963 for EVM wallets
    function handleEVM(event: Event) {
      const e = event as CustomEvent<{ info: { uuid: string; name: string; icon: string; rdns: string }; provider: any }>;
      const { info, provider } = e.detail;
      detected.set(info.rdns, { ...info, provider, chain: 'evm' });
      setWallets(Array.from(detected.values()));
    }
    window.addEventListener('eip6963:announceProvider', handleEVM);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    // Solana wallets — hardcoded brand icons as fallback
    const SOL_ICONS = {
      phantom: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24'%3E%3Cpath fill='%23AB9FF2' d='M5.13 19.2c2.297 0 4.023-1.92 5.053-3.436a2.9 2.9 0 0 0-.195.994c0 .885.53 1.516 1.574 1.516c1.433 0 2.965-1.208 3.758-2.51a2 2 0 0 0-.083.524c0 .617.362 1.006 1.1 1.006c2.324 0 4.663-3.959 4.663-7.421C21 7.175 19.58 4.8 16.016 4.8C9.752 4.8 3 12.154 3 16.905C3 18.771 4.044 19.2 5.13 19.2m8.729-9.622c0-.671.39-1.141.96-1.141c.557 0 .947.47.947 1.14c0 .672-.39 1.155-.947 1.155c-.57 0-.96-.483-.96-1.154m2.979 0c0-.671.39-1.141.96-1.141c.557 0 .947.47.947 1.14c0 .672-.39 1.155-.947 1.155c-.57 0-.96-.483-.96-1.154'/%3E%3C/svg%3E",
      solflare: "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFEF46' d='m12.063 12.715l1.245-1.199l2.32.757c1.518.505 2.278 1.43 2.278 2.734c0 .988-.38 1.64-1.14 2.481l-.231.253l.084-.59c.337-2.144-.295-3.07-2.383-3.742zM8.942 5.376l6.327 2.103l-1.37 1.304l-3.291-1.094c-1.139-.378-1.519-.988-1.666-2.27zm-.38 10.682l1.434-1.367l2.7.884c1.413.462 1.898 1.072 1.75 2.607zM6.748 9.96c0-.4.211-.778.57-1.093c.38.547 1.033 1.03 2.067 1.367l2.235.736l-1.244 1.198l-2.194-.715c-1.012-.336-1.434-.84-1.434-1.493M13.371 21c4.64-3.07 7.129-5.152 7.129-7.717c0-1.704-1.012-2.65-3.248-3.386l-1.687-.568l4.619-4.415l-.928-.989l-1.371 1.199L11.409 3c-2.003.652-4.534 2.565-4.534 4.479c0 .21.02.42.084.652c-1.666.946-2.341 1.83-2.341 2.923c0 1.03.548 2.06 2.299 2.628l1.392.463L3.5 18.75l.928.988l1.498-1.366z'/%3E%3C/svg%3E",
      backpack: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24'%3E%3Cpath fill='%23E33E3F' fill-rule='evenodd' d='M13.194 4.415c.666 0 1.29.088 1.87.25C14.496 3.37 13.32 3 12.011 3c-1.312 0-2.49.37-3.055 1.673a6.6 6.6 0 0 1 1.86-.258zm-2.529 1.302c-3.163 0-4.965 2.444-4.965 5.459v3.097c0 .301.256.54.573.54h11.454c.317 0 .573-.239.573-.54v-3.097c0-3.015-2.096-5.459-5.259-5.459zm1.33 5.486c1.108 0 2.005-.882 2.005-1.97c0-1.087-.897-1.968-2.005-1.968c-1.106 0-2.004.881-2.004 1.969c0 1.087.898 1.969 2.005 1.969M5.7 16.633a.56.56 0 0 1 .573-.546h11.454a.56.56 0 0 1 .573.546v3.275c0 .603-.513 1.092-1.145 1.092H6.845c-.632 0-1.145-.489-1.145-1.092z' clip-rule='evenodd'/%3E%3C/svg%3E",
    };
    const w = window as any;
    let solAttempts = 0;
    const solInterval = setInterval(() => {
      if (w.phantom?.solana && !detected.has('solana:phantom')) {
        const ps = w.phantom.solana;
        detected.set('solana:phantom', { uuid: 'sol-phantom', name: 'Phantom', icon: ps.icon || SOL_ICONS.phantom, rdns: 'solana:phantom', provider: ps, chain: 'solana' });
        setWallets(Array.from(detected.values()));
      }
      if (w.solflare?.isSolflare && !detected.has('solana:solflare')) {
        detected.set('solana:solflare', { uuid: 'sol-solflare', name: 'Solflare', icon: w.solflare.icon || SOL_ICONS.solflare, rdns: 'solana:solflare', provider: w.solflare, chain: 'solana' });
        setWallets(Array.from(detected.values()));
      }
      if (w.backpack && !detected.has('solana:backpack')) {
        detected.set('solana:backpack', { uuid: 'sol-backpack', name: 'Backpack', icon: w.backpack.icon || SOL_ICONS.backpack, rdns: 'solana:backpack', provider: w.backpack, chain: 'solana' });
        setWallets(Array.from(detected.values()));
      }
      solAttempts++;
      if (solAttempts >= 20) clearInterval(solInterval);
    }, 100);

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleEVM);
      clearInterval(solInterval);
    };
  }, []);

  const connect = useCallback(async (w: DetectedWallet) => {
    setSelected(w); setView('connecting'); setError(null);
    try {
      if (w.chain === 'solana') {
        const resp = await w.provider.connect();
        const pubkey = resp?.publicKey || w.provider.publicKey;
        if (!pubkey) throw new Error('No public key');
        setAddress(pubkey.toString()); setChainId(0); setView('connected');
      } else {
        const accounts = (await w.provider.request({ method: 'eth_requestAccounts' })) as string[];
        const hex = (await w.provider.request({ method: 'eth_chainId' })) as string;
        setAddress(accounts[0]); setChainId(parseInt(hex, 16)); setView('connected');
        w.provider.on?.('accountsChanged', (a: string[]) => { if (!a.length) disconnect(); else setAddress(a[0]); });
        w.provider.on?.('chainChanged', (id: string) => setChainId(parseInt(id, 16)));
      }
    } catch (err: any) { setError(err?.message || 'Rejected'); setView('error'); }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null); setChainId(null); setSelected(null); setView('list'); setModalOpen(false);
  }, []);

  const chain = getChain(chainId);
  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="flex flex-col items-center gap-6">
      {address ? (
        <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4 animate-scale-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-sm font-medium">{short}</span>
          <span className="kkt-chain-badge" style={{ color: chain.color, background: `${chain.color}15` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: chain.color }} />{chain.name}
          </span>
          <button onClick={disconnect} className="text-xs text-text-muted hover:text-red-400 transition-colors ml-2">Disconnect</button>
        </div>
      ) : (
        <button onClick={() => { setModalOpen(true); setView('list'); }}
          className="text-base font-semibold text-white bg-emerald-500 px-8 py-4 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          Open Connect Modal
        </button>
      )}
      <p className="text-sm text-text-secondary">
        {wallets.length > 0 ? `${wallets.length} wallet${wallets.length > 1 ? 's' : ''} detected via EIP-6963` : 'No wallets detected — install a browser extension'}
      </p>

      {/* Real modal — portal to body so position:fixed works */}
      {modalOpen && createPortal(
        <div className="kkt-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setModalOpen(false); setView('list'); setError(null); } }}>
          <div className="kkt-modal">

            {view === 'list' && (
              <>
                <div className="kkt-header">
                  <p className="kkt-title">Connect Wallet</p>
                  <button className="kkt-close" onClick={() => setModalOpen(false)}><IconClose /></button>
                </div>
                <p className="kkt-subtitle">{wallets.length > 0 ? 'Choose from your installed wallets' : 'No wallets found'}</p>
                <div className="kkt-divider" />
                {wallets.length > 0 ? (
                  <WalletSections wallets={wallets} onSelect={connect} />
                ) : (
                  <div className="kkt-state-container">
                    <span className="text-text-muted"><IconEmpty /></span>
                    <p className="kkt-state-desc">Install a wallet extension to connect.</p>
                  </div>
                )}
              </>
            )}

            {view === 'connecting' && selected && (
              <>
                <div className="kkt-header">
                  <button className="kkt-close" onClick={() => setView('list')}><IconBack /></button>
                  <p className="kkt-title">Connecting</p>
                  <div style={{ width: 32 }} />
                </div>
                <div className="kkt-state-container">
                  <div className="kkt-wallet-preview"><img src={selected.icon} alt="" /></div>
                  <div className="kkt-spinner-ring" />
                  <p className="kkt-state-title">Opening {selected.name}</p>
                  <p className="kkt-state-desc">Confirm in your wallet</p>
                </div>
              </>
            )}

            {view === 'connected' && (
              <>
                <div className="kkt-header">
                  <p className="kkt-title">Connected</p>
                  <span className="kkt-chain-badge" style={{ color: chain.color, background: `${chain.color}15` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: chain.color }} />{chain.name}
                  </span>
                </div>
                <div className="kkt-state-container">
                  <div className="kkt-success-icon"><IconCheck /></div>
                  <p className="kkt-state-title">Connected</p>
                  <p className="kkt-address">{short}</p>
                  <button className="kkt-btn kkt-btn-secondary" onClick={disconnect}>Disconnect</button>
                </div>
              </>
            )}

            {view === 'error' && (
              <>
                <div className="kkt-header">
                  <button className="kkt-close" onClick={() => { setView('list'); setError(null); }}><IconBack /></button>
                  <p className="kkt-title">Error</p>
                  <div style={{ width: 32 }} />
                </div>
                <div className="kkt-state-container">
                  <div className="kkt-error-icon" style={{ color: '#EF4444' }}><IconAlert /></div>
                  <p className="kkt-state-title">Connection failed</p>
                  <p className="kkt-state-desc">{error}</p>
                  <div className="kkt-btn-row">
                    <button className="kkt-btn kkt-btn-secondary" onClick={() => { setView('list'); setError(null); }}>Back</button>
                    <button className="kkt-btn kkt-btn-primary" onClick={() => selected && connect(selected)}>Try again</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Shared wallet list with EVM/Solana sections ───
function WalletSections({ wallets, onSelect }: { wallets: DetectedWallet[]; onSelect: (w: DetectedWallet) => void }) {
  const evm = wallets.filter(w => w.chain === 'evm');
  const sol = wallets.filter(w => w.chain === 'solana');

  return (
    <>
      {evm.length > 0 && (
        <>
          <p className="kkt-section-label">EVM Wallets</p>
          <ul className="kkt-wallet-list">
            {evm.map(w => (
              <WalletRow key={w.rdns} wallet={w} onClick={() => onSelect(w)} />
            ))}
          </ul>
        </>
      )}
      {sol.length > 0 && (
        <>
          {evm.length > 0 && <div className="kkt-divider" />}
          <p className="kkt-section-label">Solana Wallets</p>
          <ul className="kkt-wallet-list">
            {sol.map(w => (
              <WalletRow key={w.rdns} wallet={w} onClick={() => onSelect(w)} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function WalletRow({ wallet, onClick }: { wallet: DetectedWallet; onClick: () => void }) {
  return (
    <li className="kkt-wallet-item" onClick={onClick} role="button" tabIndex={0}>
      <div className="kkt-wallet-icon">
        {wallet.icon ? (
          <img src={wallet.icon} alt={wallet.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>{wallet.name[0]}</span>
        )}
      </div>
      <div className="kkt-wallet-info">
        <p className="kkt-wallet-name">{wallet.name}</p>
        <p className="kkt-wallet-tag">{wallet.chain === 'solana' ? 'Solana' : wallet.rdns}</p>
      </div>
      <span className="kkt-installed-dot" />
      <span className="kkt-arrow"><IconArrow /></span>
    </li>
  );
}

// ═══════════════════════════════════════════
// ANIMATIONS — hover previews
// ═══════════════════════════════════════════
function AnimationsTab() {
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => { injectKktCSS('#22C55E'); }, []);

  const anims = [
    {
      id: 'modal-open', name: 'Modal Open', desc: 'Glass scale + fade entrance',
      preview: (on: boolean) => (
        <div className={`kkt-modal transition-all duration-300 !w-44 !max-h-28 ${on ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.92]'}`} style={{ animation: 'none' }}>
          <div className="p-3 space-y-2"><div className="h-2 w-20 bg-white/10 rounded" /><div className="h-2 w-14 bg-white/5 rounded" /></div>
        </div>
      ),
    },
    {
      id: 'spinner', name: 'Connection Spinner', desc: 'Smooth ring rotation',
      preview: (on: boolean) => <div className={`kkt-spinner-ring ${on ? '' : '!border-t-transparent'}`} style={on ? {} : { animation: 'none' }} />,
    },
    {
      id: 'success', name: 'Success Pop', desc: 'Scale bounce on connect',
      preview: (on: boolean) => (
        <div className={`kkt-success-icon transition-all duration-300 ${on ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} style={on ? {} : { animation: 'none' }}>
          <IconCheck />
        </div>
      ),
    },
    {
      id: 'error', name: 'Error Shake', desc: 'Horizontal shake on failure',
      preview: (on: boolean) => (
        <div className={`kkt-error-icon ${on ? 'animate-[shake_0.4s_ease-in-out]' : ''}`} style={{ color: '#EF4444' }}>
          <IconAlert />
        </div>
      ),
    },
    {
      id: 'hover', name: 'Wallet Hover', desc: 'Glass highlight + arrow shift',
      preview: (on: boolean) => (
        <div className={`kkt-wallet-item !p-2.5 ${on ? '!bg-white/[0.03] !border-white/[0.05]' : ''}`} style={{ cursor: 'default' }}>
          <div className="kkt-wallet-icon !w-9 !h-9">
            <svg width="36" height="36" viewBox="0 0 36 36"><rect width="36" height="36" rx="10" fill="#F6851B" fillOpacity="0.12"/><text x="18" y="23" textAnchor="middle" fill="#F6851B" fontSize="15" fontWeight="600" fontFamily="system-ui">M</text></svg>
          </div>
          <div className="kkt-wallet-info"><p className="kkt-wallet-name !text-sm">MetaMask</p></div>
          <span className={`kkt-arrow transition-all ${on ? '!translate-x-[3px] !text-white/60' : ''}`}><IconArrow /></span>
        </div>
      ),
    },
    {
      id: 'pulse', name: 'Connected Pulse', desc: 'Breathing dot indicator',
      preview: (on: boolean) => (
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${on ? 'animate-pulse' : ''}`} />
          <span className="kkt-address !text-xs !py-1 !px-3">0x1a2B...9f4E</span>
        </div>
      ),
    },
    {
      id: 'reveal', name: 'Scroll Reveal', desc: 'Slide up + fade on viewport entry',
      preview: (on: boolean) => (
        <div className={`flex flex-col gap-2 transition-all duration-500 ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="h-2.5 w-20 bg-emerald-500/15 rounded" />
          <div className="h-4 w-36 bg-white/10 rounded" />
          <div className="h-2 w-28 bg-white/5 rounded" />
        </div>
      ),
    },
    {
      id: 'blur', name: 'Backdrop Blur', desc: 'Frosted glass overlay',
      preview: (on: boolean) => (
        <div className="relative w-44 h-20 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 flex items-center justify-center text-[11px] text-text-muted">Content</div>
          <div className={`absolute inset-0 transition-all duration-300 ${on ? 'bg-black/40 backdrop-blur-sm' : ''}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {anims.map((a) => {
        const on = playing === a.id;
        return (
          <div key={a.id} className="glass rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all hover:border-white/[0.08]"
            onMouseEnter={() => setPlaying(a.id)} onMouseLeave={() => setPlaying(null)}>
            <div>
              <p className="text-[15px] font-semibold mb-1">{a.name}</p>
              <p className="text-[13px] text-text-secondary">{a.desc}</p>
            </div>
            <div className="flex items-center justify-center h-20">{a.preview(on)}</div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full transition-colors ${on ? 'bg-emerald-500' : 'bg-white/10'}`} />
              <span className="text-[11px] text-text-muted">{on ? 'Playing' : 'Hover to preview'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
