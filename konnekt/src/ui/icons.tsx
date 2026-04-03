// Custom SVG icons — unique style, no generic crypto clichés
// Flat, geometric, playful with intentional color choices

export function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M7 14.5L11.5 19L21 9"
        stroke="#4ADE80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ErrorIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke="#E8553A" strokeWidth="2" />
      <path
        d="M14 9V15"
        stroke="#E8553A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="19" r="1.2" fill="#E8553A" />
    </svg>
  );
}

export function WalletConnectIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="6" width="24" height="16" rx="4" stroke="#6E9EF5" strokeWidth="1.8" />
      <path
        d="M8 14C8 14 10.5 10.5 14 10.5C17.5 10.5 20 14 20 14"
        stroke="#6E9EF5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.5 14C10.5 14 12 12 14 12C16 12 17.5 14 17.5 14"
        stroke="#6E9EF5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 4L6 8L10 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 6V3.5A1.5 1.5 0 013.5 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 2H16.5A1.5 1.5 0 0118 3.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 14V16.5A1.5 1.5 0 0116.5 18H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 18H3.5A1.5 1.5 0 012 16.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DisconnectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 2L6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 2L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M3 7C3 7 3 12 8 12C13 12 13 7 13 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
