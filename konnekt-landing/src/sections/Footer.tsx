export function Footer() {
  return (
    <footer className="px-10 pb-10 max-w-[1200px] mx-auto">
      <div className="h-px bg-border mb-14" />
      <div className="flex justify-between gap-20 mb-14">
        <div className="max-w-[280px]">
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/logo.png" alt="Konnekt" className="w-8 h-8 object-contain" />
            <span className="text-xl font-semibold tracking-tight">Konnekt</span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            Clean web3 wallet connector.<br />Pure crypto. Zero noise.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1">Resources</p>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How it works</a>
            <a href="#playground" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Playground</a>
            <a href="#code" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Documentation</a>
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1">Community</p>
            <a href="https://github.com/konnekt-wallet/konnekt-wallet" className="text-sm text-text-secondary hover:text-text-primary transition-colors">GitHub</a>
            <a href="https://twitter.com" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Twitter</a>
            <a href="https://discord.com" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Discord</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1">Install</p>
            <code className="text-[13px] font-mono text-text-muted">npm i konnekt-wallet</code>
            <code className="text-[13px] font-mono text-text-muted">yarn add konnekt-wallet</code>
            <code className="text-[13px] font-mono text-text-muted">pnpm add konnekt-wallet</code>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-[13px] text-text-muted">Built with care. Open source under MIT.</p>
      </div>
    </footer>
  );
}
