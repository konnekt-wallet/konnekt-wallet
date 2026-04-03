interface Props {
  accent?: string;
}

export function Footer({ accent }: Props) {
  const color = accent && accent !== 'transparent' ? accent : '#22C55E';

  return (
    <div className="kkt-footer">
      <div className="kkt-footer-logo" style={{ background: color }}>
        <span className="kkt-footer-logo-text">K</span>
      </div>
      <span className="kkt-footer-text">Powered by Konnekt</span>
    </div>
  );
}
