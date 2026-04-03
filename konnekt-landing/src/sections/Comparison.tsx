import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const ROWS = [
  { feature: 'Bundle size', k: '~40KB', r: '~200KB+', w: '~15KB' },
  { feature: 'Social logins', k: 'No (by design)', r: 'Yes', w: 'No' },
  { feature: 'EIP-6963', k: '✓', r: '✓', w: 'Partial' },
  { feature: 'WalletConnect v2', k: '✓', r: '✓', w: '✗' },
  { feature: 'Theming', k: '6 params', r: 'CSS vars (50+)', w: 'Manual CSS' },
  { feature: 'Smart defaults', k: '✓', r: '✗', w: '✗' },
  { feature: 'Multi-chain', k: '✓', r: '✓', w: 'Manual' },
  { feature: 'Setup', k: '3 lines', r: '10+ lines', w: '5+ lines' },
  { feature: 'Dependencies', k: '2', r: '15+', w: '3+' },
  { feature: 'Accessible', k: '✓', r: 'Partial', w: '✗' },
];

function Cell({ value, highlight }: { value: string; highlight?: boolean }) {
  const isCheck = value === '✓';
  const isCross = value === '✗';
  return (
    <span className={`text-[13px] font-mono ${
      isCheck ? 'text-emerald-700 font-sans' :
      isCross ? 'text-text-muted font-sans' :
      highlight ? 'text-text-primary font-medium' : 'text-text-secondary'
    }`}>
      {value}
    </span>
  );
}

export function Comparison() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-28 px-10 max-w-[1000px] mx-auto" ref={ref}>
      <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <span className="text-[11px] font-bold tracking-[1.5px] text-yellow-400 block mb-4">COMPARISON</span>
        <h2 className="text-5xl font-extrabold leading-[1.1] tracking-[-2px] mb-4">How Konnekt<br />stacks up</h2>
        <p className="text-[17px] leading-relaxed text-text-secondary max-w-[520px] mx-auto">
          Honest comparison. Konnekt isn't for enterprise — it's for devs who want something clean.
        </p>
      </div>

      <div className={`glass rounded-2xl overflow-hidden transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[13px] font-semibold text-text-secondary text-left px-5 py-4 border-b border-border" />
              <th className="text-[13px] font-semibold text-left px-5 py-4 border-b border-border">
                <span className="text-emerald-700 bg-accent-soft px-3 py-1 rounded-lg">Konnekt</span>
              </th>
              <th className="text-[13px] font-semibold text-text-secondary text-left px-5 py-4 border-b border-border">Reown</th>
              <th className="text-[13px] font-semibold text-text-secondary text-left px-5 py-4 border-b border-border">Web3 basic</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 border-b border-border text-sm font-medium">{row.feature}</td>
                <td className="px-5 py-3.5 border-b border-border bg-emerald-700/[0.03]"><Cell value={row.k} highlight /></td>
                <td className="px-5 py-3.5 border-b border-border"><Cell value={row.r} /></td>
                <td className="px-5 py-3.5 border-b border-border"><Cell value={row.w} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
