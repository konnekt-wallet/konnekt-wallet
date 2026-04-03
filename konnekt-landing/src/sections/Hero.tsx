export function Hero() {
  return (
    <section className="min-h-screen flex flex-col relative">
      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Konnekt" className="w-8 h-8 object-contain" />
          <span className="text-xl font-semibold tracking-tight">Konnekt</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#playground" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Playground</a>
          <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How it works</a>
          <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
          <a href="#code" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Code</a>
          <a href="https://github.com" className="text-[13px] font-medium text-text-primary glass px-4 py-2 rounded-xl hover:bg-white/[0.05] transition-colors">GitHub</a>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20 gap-7 relative z-10">
        <div className="flex items-center gap-2.5 animate-slide-up">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-700/10 px-2.5 py-1 rounded-full border border-emerald-700/20">v0.1.0</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="text-[13px] text-text-secondary font-medium">Pure crypto. Zero noise.</span>
        </div>

        <h1 className="text-[64px] font-extrabold leading-[1.05] tracking-[-2.5px] animate-slide-up">
          The wallet connector<br />
          <span className="text-emerald-700">that doesn't <span className="font-brand">suck</span></span>
        </h1>

        <p className="text-lg leading-relaxed text-text-secondary max-w-[520px] animate-slide-up">
          No Google login. No Discord. No email wallets. Just clean, fast,
          beautiful wallet connection for dApps that respect their users.
        </p>

        <div className="flex items-center gap-6 px-8 py-5 glass rounded-2xl animate-slide-up">
          {[
            { value: '~40KB', label: 'Bundle size' },
            { value: 'EIP-6963', label: 'Auto-detect' },
            { value: '6', label: 'Theme params' },
            { value: '0', label: 'Web2 bloat' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6">
              {i > 0 && <div className="w-px h-8 bg-white/[0.06]" />}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-bold font-mono tracking-tight">{stat.value}</span>
                <span className="text-[11px] text-text-secondary font-medium">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3.5 animate-slide-up">
          <a href="#playground" className="text-[15px] font-semibold text-white bg-emerald-700 px-7 py-3.5 rounded-xl hover:brightness-110 transition-all shadow-[0_0_30px_rgba(21,128,61,0.15)]">
            Try the modal
          </a>
          <a href="#code" className="text-[15px] font-medium font-mono text-text-primary glass px-7 py-3.5 rounded-xl hover:bg-white/[0.05] transition-all flex items-center gap-2">
            <span className="text-emerald-700 font-bold">{'>'}_</span>
            View code
          </a>
        </div>
      </div>
    </section>
  );
}
