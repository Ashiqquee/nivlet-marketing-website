'use client';

import { useEffect, useRef } from 'react';

export function Beams({ variant = 'hero' }: { variant?: 'hero' | 'final' }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { element.dataset.paused = String(!entry.isIntersecting); });
    observer.observe(element);
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--mx', (event.clientX / window.innerWidth - .5).toFixed(3));
        element.style.setProperty('--my', (event.clientY / window.innerHeight - .5).toFixed(3));
      });
    };
    if (motion.matches) window.addEventListener('pointermove', move, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, []);

  return <div ref={root} className={`beams beams-${variant}`} aria-hidden="true">
    <div className="beams-field">
      <div className="beams-group">{Array.from({ length: 7 }, (_, index) => <span key={index} className="beam" />)}</div>
    </div>
  </div>;
}
