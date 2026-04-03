import { useScrollReveal } from '@/hooks/use-scroll-reveal';

// Custom SVG icons for each feature — no generic/popular ones
function IconPureCrypto() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L2 7V15L11 20L20 15V7L11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 8V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 10L14 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 12L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>);
}
function IconDetect() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/><circle cx="11" cy="11" r="1.5" fill="currentColor"/></svg>);
}
function IconLight() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11H6M16 11H18M11 4V6M11 16V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="7" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10H12V12H10V10Z" fill="currentColor" opacity="0.5"/></svg>);
}
function IconSmart() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 11L8 6L12 10L18 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 4H18V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/><path d="M3 19H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15"/></svg>);
}
function IconTheme() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>);
}
function IconChain() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M9 7H6C4.34 7 3 8.34 3 10V12C3 13.66 4.34 15 6 15H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 7H16C17.66 7 19 8.34 19 10V12C19 13.66 17.66 15 16 15H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>);
}
function IconMobile() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="6" y="2" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 17H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 5H16" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/></svg>);
}
function IconA11y() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 9L11 10L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 10V14" stroke="currentColor" strokeWidth="1.5"/><path d="M8 20L11 14L14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}
function IconFramework() {
  return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6L11 2L19 6V16L11 20L3 16V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 6L11 10L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 10V20" stroke="currentColor" strokeWidth="1.5"/></svg>);
}

const FEATURES = [
  { Icon: IconPureCrypto, color: 'text-emerald-700 bg-emerald-700/10', title: 'Pure Crypto', desc: 'No Google, Discord, email, or social logins. Built exclusively for crypto wallets.' },
  { Icon: IconDetect, color: 'text-yellow-400 bg-yellow-400/10', title: 'EIP-6963 Native', desc: 'Auto-detection of all installed wallet extensions. No window.ethereum conflicts.' },
  { Icon: IconLight, color: 'text-cyan-400 bg-cyan-400/10', title: '~40KB Bundle', desc: 'Ships at a fraction of alternatives. No bloated deps, no unused features.' },
  { Icon: IconSmart, color: 'text-emerald-600 bg-emerald-600/10', title: 'Smart Defaults', desc: "One wallet installed? Skip the modal. Fewer clicks, faster connections." },
  { Icon: IconTheme, color: 'text-violet-400 bg-violet-400/10', title: '6-Param Theming', desc: 'Customize everything with 6 params: accent, background, surface, text, border, radius.' },
  { Icon: IconChain, color: 'text-orange-400 bg-orange-400/10', title: 'Multi-Chain', desc: 'Ethereum, Polygon, Arbitrum, Base, Optimism, and any EVM chain.' },
  { Icon: IconMobile, color: 'text-rose-400 bg-rose-400/10', title: 'WalletConnect v2', desc: 'Mobile wallet support through encrypted relay. QR code scanning built in.' },
  { Icon: IconA11y, color: 'text-cyan-400 bg-cyan-400/10', title: 'Accessible', desc: 'Full keyboard navigation, ARIA labels, focus management, screen reader support.' },
  { Icon: IconFramework, color: 'text-emerald-600 bg-emerald-600/10', title: 'Framework Ready', desc: 'React hooks today, Vue and Svelte adapters coming. Core is vanilla TS.' },
];

export function Features() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="features" className="py-28 px-10 max-w-[1200px] mx-auto" ref={ref}>
      <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <span className="text-[11px] font-bold tracking-[1.5px] text-violet-400 block mb-4">FEATURES</span>
        <h2 className="text-5xl font-extrabold leading-[1.1] tracking-[-2px] mb-4">Everything you need,<br />nothing you don't</h2>
        <p className="text-[17px] leading-relaxed text-text-secondary max-w-[520px] mx-auto">
          Built for developers who want clean, fast, beautiful wallet connection without the overhead.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`glass rounded-2xl p-7 hover:border-white/[0.08] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${150 + i * 60}ms` }}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
              <f.Icon />
            </div>
            <h3 className="text-[17px] font-semibold tracking-[-0.3px] mb-2">{f.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
