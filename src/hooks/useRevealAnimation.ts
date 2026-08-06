import { useEffect } from 'react';

/**
 * Sets up an IntersectionObserver that adds `is-visible` to any element
 * with a reveal class (.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip).
 * Deferred via requestIdleCallback so it never blocks the LCP paint task.
 * Call this once inside a page component.
 */
export function useRevealAnimation() {
  useEffect(() => {
    const selectors = '.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip, .reveal-from-left, .reveal-from-right, .reveal-on-mobile';

    let observer: IntersectionObserver | null = null;

    const setup = () => {
      const revealEls = document.querySelectorAll(selectors);
      if (!revealEls.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer?.unobserve(entry.target); // fire once only
            }
          });
        },
        { threshold: 0.01, rootMargin: '150px 0px 150px 0px' }
      );

      revealEls.forEach((el) => observer!.observe(el));
    };

    // Run setup immediately so elements in view reveal instantly without waiting for scroll/idle
    setup();

    return () => {
      observer?.disconnect();
    };
  }, []);
}
