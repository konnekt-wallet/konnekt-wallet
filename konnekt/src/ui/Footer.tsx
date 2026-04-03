const NPM_URL = 'https://www.npmjs.com/package/konnekt-wallet';

// Konnekt logo as inline SVG data URI — matches the real logo
const LOGO_SVG = `data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='8' fill='%2322C55E'/%3E%3Cpath d='M9 23V9h3.5v5.5L17.5 9H22l-6 7 6.5 7h-4.8l-4.2-5v5H9z' fill='white'/%3E%3C/svg%3E`;

export function Footer() {
  return (
    <a className="kkt-footer" href={NPM_URL} target="_blank" rel="noopener noreferrer">
      <img className="kkt-footer-logo" src={LOGO_SVG} alt="Konnekt" />
      <span className="kkt-footer-text">Powered by Konnekt</span>
    </a>
  );
}
