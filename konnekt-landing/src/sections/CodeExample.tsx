import { useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const EXAMPLES = [
  {
    label: 'Basic Setup', file: 'App.tsx',
    code: `import { KonnektProvider, useKonnekt } from 'konnekt';

function App() {
  return (
    <KonnektProvider
      config={{
        projectId: 'your-walletconnect-project-id',
        chains: [1, 137, 42161],
      }}
    >
      <MyDApp />
    </KonnektProvider>
  );
}

function MyDApp() {
  const { isConnected, address, openModal, disconnect } = useKonnekt();

  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={openModal}>Connect Wallet</button>
      )}
    </div>
  );
}`,
  },
  {
    label: 'Custom Theme', file: 'themed.tsx',
    code: `import { KonnektProvider } from 'konnekt';

const theme = {
  accent: '#15803d',
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: '#F5F0EB',
  border: '#2A2A2A',
  radius: '16px',
};

function App() {
  return (
    <KonnektProvider
      config={{
        projectId: 'your-project-id',
        chains: [1],
        theme,
      }}
    >
      <YourApp />
    </KonnektProvider>
  );
}`,
  },
  {
    label: 'Advanced', file: 'advanced.tsx',
    code: `import { useKonnekt } from 'konnekt';

function Dashboard() {
  const {
    isConnected, isConnecting,
    address, chainId, walletId, error,
    availableWallets,
    connect, disconnect, openModal,
  } = useKonnekt();

  const connectMetaMask = () => connect('io.metamask');

  const hasMetaMask = availableWallets.some(
    w => w.id === 'io.metamask' && w.installed
  );

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {isConnected && (
        <div>
          <p>Address: {address}</p>
          <p>Chain: {chainId}</p>
          <p>Wallet: {walletId}</p>
        </div>
      )}
      {hasMetaMask && !isConnected && (
        <button onClick={connectMetaMask}>
          Quick Connect (MetaMask)
        </button>
      )}
    </div>
  );
}`,
  },
  {
    label: 'Vanilla JS', file: 'vanilla.ts',
    code: `import { createKonnekt } from 'konnekt';

const konnekt = createKonnekt({
  projectId: 'your-project-id',
  chains: [1, 137],
});

konnekt.store.subscribe((state) => {
  console.log('Status:', state.status);
  console.log('Address:', state.address);
  updateUI(state);
});

await konnekt.connect('io.metamask');
konnekt.disconnect();
konnekt.destroy();`,
  },
];

export function CodeExample() {
  const [active, setActive] = useState(0);
  const ex = EXAMPLES[active];
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="code" className="py-28 px-10 max-w-[900px] mx-auto" ref={ref}>
      <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <span className="text-[11px] font-bold tracking-[1.5px] text-blue-400 block mb-4">CODE</span>
        <h2 className="text-5xl font-extrabold leading-[1.1] tracking-[-2px] mb-4">Simple API,<br />powerful results</h2>
        <p className="text-[17px] leading-relaxed text-text-secondary max-w-[520px] mx-auto">
          Get started in under a minute. If you've used React hooks, you already know how it works.
        </p>
      </div>

      <div className={`glass rounded-2xl overflow-hidden transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex border-b border-white/[0.06] px-2">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.label}
              onClick={() => setActive(i)}
              className={`text-[13px] font-medium px-4 py-3.5 border-b-2 -mb-px transition-colors ${
                i === active ? 'text-text-primary border-emerald-700' : 'text-text-muted border-transparent hover:text-text-secondary'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-black/20">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <span className="text-xs text-text-muted font-mono flex-1">{ex.file}</span>
          <button
            onClick={() => navigator.clipboard?.writeText(ex.code)}
            className="text-[11px] font-medium text-text-secondary bg-surface border border-border px-3 py-1 rounded-md hover:bg-border-light transition-colors"
          >
            Copy
          </button>
        </div>

        <pre className="p-5 text-[13px] leading-[1.7] font-mono text-text-secondary overflow-auto max-h-[440px]">
          <code>{ex.code}</code>
        </pre>

        <div className="flex items-center gap-3 px-5 py-3.5 border-t border-border bg-black/20">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Install</span>
          <code className="text-sm font-mono text-emerald-700 font-medium">npm install konnekt</code>
          <span className="text-[11px] text-text-muted ml-auto">coming to npm soon</span>
        </div>
      </div>
    </section>
  );
}
