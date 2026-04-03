import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { KonnektProvider, KonnektButton } from 'konnekt';

function App() {
  return (
    <KonnektProvider config={{}}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, marginBottom: 24, fontWeight: 600, letterSpacing: -0.5 }}>Konnekt Test</h1>
        <KonnektButton />
      </div>
    </KonnektProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
