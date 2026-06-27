import { useEffect } from 'react';

/**
 * Sets up an IntersectionObserver that adds `is-visible` to any element
 * with a reveal class (.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip).
 * Call this once inside a page component.
 */
export function useRevealAnimation() {
  useEffect(() => {
    const selectors = '.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip, .reveal-from-left, .reveal-from-right';
    const revealEls = document.querySelectorAll(selectors);
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // fire once only
          }
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
