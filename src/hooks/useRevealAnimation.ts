import { useEffect } from 'react';

/**
 * Sets up an IntersectionObserver that adds `is-visible` to any element
 * with a reveal class (.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip).
 * Includes a fallback timer so elements in complex layouts (e.g. Safari CSS multi-column)
 * are guaranteed to become visible even if intersection events are delayed.
 */
export function useRevealAnimation() {
  useEffect(() => {
    const selectors = '.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip, .reveal-from-left, .reveal-from-right, .reveal-on-mobile, .reveal-on-scroll';

    let observer: IntersectionObserver | null = null;

    const setup = () => {
      const revealEls = document.querySelectorAll(selectors);
      if (!revealEls.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              entry.target.classList.add('active');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.02, rootMargin: '100px 0px 100px 0px' }
      );

      revealEls.forEach((el) => observer!.observe(el));
    };

    setup();

    let idleId: number;
    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(setup, { timeout: 1000 });
    } else {
      idleId = window.setTimeout(setup, 150) as unknown as number;
    }

    // Safety fallback: Ensure all reveal elements become visible even if
    // browser multi-column IntersectionObserver bugs prevent intersection events.
    const fallbackTimer = setTimeout(() => {
      const revealEls = document.querySelectorAll(selectors);
      revealEls.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
          el.classList.add('active');
        }
      });
    }, 800);

    return () => {
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, []);
}
