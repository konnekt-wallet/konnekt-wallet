export function AnimatedBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base dark */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(21,128,61,1) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full top-[-10%] left-[15%] bg-emerald-700/[0.04] blur-[120px] animate-orb-1" />
      <div className="absolute w-[400px] h-[400px] rounded-full top-[30%] right-[10%] bg-emerald-600/[0.03] blur-[100px] animate-orb-2" />
      <div className="absolute w-[350px] h-[350px] rounded-full bottom-[10%] left-[30%] bg-teal-500/[0.03] blur-[100px] animate-orb-3" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_100%)]" />
    </div>
  );
}
