'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
