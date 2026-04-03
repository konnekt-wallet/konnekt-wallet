import { useEffect, useRef } from 'react';

const IMAGES = Array.from({ length: 10 }, (_, i) => `/bg/${i + 1}.jpg`);
const INTERVAL = 15000;
const FADE = 2000;

export function BgSlideshow() {
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);
  const step = useRef(0);
  const showing = useRef<'a' | 'b'>('a');
  const locked = useRef(false);

  // Preload all images
  useEffect(() => {
    IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Set initial images
  useEffect(() => {
    if (imgARef.current) {
      imgARef.current.src = IMAGES[0];
      imgARef.current.style.opacity = '1';
    }
    if (imgBRef.current) {
      imgBRef.current.src = IMAGES[1];
      imgBRef.current.style.opacity = '0';
    }
  }, []);

  // Slideshow loop — no React state, pure DOM
  useEffect(() => {
    const timer = setInterval(() => {
      if (locked.current) return;
      locked.current = true;

      step.current = (step.current + 1) % IMAGES.length;
      const nextSrc = IMAGES[step.current];

      if (showing.current === 'a') {
        // A is visible. Set B src, fade B in, fade A out.
        if (imgBRef.current) imgBRef.current.src = nextSrc;
        requestAnimationFrame(() => {
          if (imgARef.current) imgARef.current.style.opacity = '0';
          if (imgBRef.current) imgBRef.current.style.opacity = '1';
          showing.current = 'b';
        });
      } else {
        // B is visible. Set A src, fade A in, fade B out.
        if (imgARef.current) imgARef.current.src = nextSrc;
        requestAnimationFrame(() => {
          if (imgBRef.current) imgBRef.current.style.opacity = '0';
          if (imgARef.current) imgARef.current.style.opacity = '1';
          showing.current = 'a';
        });
      }

      setTimeout(() => {
        locked.current = false;
      }, FADE + 200);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const imgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: `opacity ${FADE}ms ease-in-out`,
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <img ref={imgARef} alt="" style={imgStyle} />
      <img ref={imgBRef} alt="" style={imgStyle} />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
