import { useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const STEPS = [
  {
    num: '01', title: 'EIP-6963 Discovery', color: 'text-blue-400',
    desc: 'When your dApp loads, Konnekt dispatches an eip6963:requestProvider event. Every installed wallet extension responds with its metadata and provider object.',
    details: [
      'Each wallet announces: uuid, name, icon, rdns, and the EIP-1193 provider',
      'Konnekt collects all responses into a Map keyed by rdns — no duplicates',
      'Unlike window.ethereum, EIP-6963 lets multiple wallets coexist',
      'Discovery happens in ~50ms — all wallets detected before modal opens',
    ],
    code: `window.addEventListener(
  'eip6963:announceProvider',
  (event) => {
    const { info, provider } = event.detail;
    detectedWallets.set(info.rdns, {
      info, provider
    });
  }
);
window.dispatchEvent(
  new Event('eip6963:requestProvider')
);`,
  },
  {
    num: '02', title: 'Smart Selection', color: 'text-emerald-600',
    desc: 'Konnekt shows only what matters. Installed wallets first with a green dot. No wall of 300 unknown wallets.',
    details: [
      'One wallet installed? Skip the modal — one click connect',
      'Wallets sorted: installed first, then WalletConnect',
      'Unique color-coded fallback icons from wallet name',
      'Keyboard-navigable and screen-reader friendly',
    ],
    code: `const injected = wallets.filter(
  w => w.type === 'injected' && w.installed
);

if (injected.length === 1) {
  await connect(injected[0].id);
} else {
  openModal();
}`,
  },
  {
    num: '03', title: 'Provider Connection', color: 'text-orange-400',
    desc: 'User picks a wallet → Konnekt calls eth_requestAccounts → wallet shows popup → user approves → connected.',
    details: [
      'Injected: direct RPC call, no relay, no latency',
      'WalletConnect: encrypted relay session via QR code',
      'Auto-subscribes to accountsChanged and chainChanged',
      'Clean error state with retry on rejection',
    ],
    code: `const provider = getProviderByRdns(walletId);

const accounts = await provider.request({
  method: 'eth_requestAccounts'
});

const chainId = await provider.request({
  method: 'eth_chainId'
});

provider.on('accountsChanged', (accs) => {
  if (accs.length === 0) disconnect();
  else updateAddress(accs[0]);
});`,
  },
  {
    num: '04', title: 'WalletConnect v2', color: 'text-purple-400',
    desc: 'For mobile wallets — encrypted session through a relay server. Your dApp and wallet never talk directly.',
    details: [
      'Generates symmetric key pair + pairing URI as QR code',
      'End-to-end encrypted — relay sees nothing',
      'Session persistence across page reloads',
      'Multi-chain sessions via CAIP-25',
    ],
    code: `const { uri, approval } = await signClient
  .connect({
    requiredNamespaces: {
      eip155: {
        chains: ['eip155:1', 'eip155:137'],
        methods: ['eth_sendTransaction',
                   'personal_sign'],
        events: ['chainChanged',
                  'accountsChanged']
      }
    }
  });

showQR(uri);
const session = await approval();`,
  },
  {
    num: '05', title: 'State Management', color: 'text-yellow-400',
    desc: 'Minimal vanilla store — no Redux, no Zustand. Syncs with React through subscribe pattern. ~60 lines total.',
    details: [
      'Framework-agnostic core — React, Vue, Svelte, or vanilla',
      'State: status, address, chainId, walletId, error, wallets, modal',
      'Subscribe/unsubscribe prevents memory leaks',
      'Only subscribed components re-render',
    ],
    code: `import { KonnektProvider, useKonnekt } from 'konnekt-wallet';

function App() {
  return (
    <KonnektProvider config={{
      projectId: 'wc-project-id',
      chains: [1, 137, 42161],
      theme: { accent: '#15803d' }
    }}>
      <YourApp />
    </KonnektProvider>
  );
}

function ConnectButton() {
  const { isConnected, address, openModal, disconnect } = useKonnekt();
  // ...
}`,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" className="py-28 px-10 max-w-[1200px] mx-auto" ref={ref}>
      <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <span className="text-[11px] font-bold tracking-[1.5px] text-emerald-700 block mb-4">HOW IT WORKS</span>
        <h2 className="text-5xl font-extrabold leading-[1.1] tracking-[-2px] mb-4">Under the hood,<br />step by step</h2>
        <p className="text-[17px] leading-relaxed text-text-secondary max-w-[560px] mx-auto">
          Every wallet connection follows the same flow. Here's exactly what Konnekt does at each stage.
        </p>
      </div>

      {/* Step tabs */}
      <div className={`flex gap-2 overflow-x-auto pb-1 mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {STEPS.map((s, i) => (
          <button
            key={s.num}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border whitespace-nowrap transition-all font-sans ${
              i === active
                ? 'border-emerald-700/40 bg-accent-soft text-text-primary'
                : 'border-border bg-transparent text-text-secondary hover:border-border-light'
            }`}
          >
            <span className={`text-[13px] font-bold font-mono ${i === active ? 'text-emerald-700' : 'text-text-muted'}`}>{s.num}</span>
            <span className="text-sm font-medium">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`grid grid-cols-2 gap-6 animate-fade-in transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} key={active}>
        <div className="flex flex-col gap-4">
          <span className={`text-[13px] font-bold ${step.color}`}>Step {step.num}</span>
          <h3 className="text-[28px] font-bold tracking-[-1px]">{step.title}</h3>
          <p className="text-[15px] leading-[1.7] text-text-secondary">{step.desc}</p>
          <div className="flex flex-col gap-3 mt-2">
            {step.details.map((d, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-[7px] flex-shrink-0" />
                <span className="text-sm leading-relaxed text-text-secondary">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-xs text-text-muted font-mono">{step.title.toLowerCase().replace(/\s+/g, '-')}.ts</span>
          </div>
          <pre className="p-5 text-[13px] leading-[1.7] font-mono text-text-secondary overflow-auto flex-1">
            <code>{step.code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
