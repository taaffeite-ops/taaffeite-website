import { useEffect } from 'react';

/**
 * Sets up an IntersectionObserver that adds `is-visible` to any element
 * with a reveal class (.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip).
 * Uses MutationObserver so dynamically added nodes (e.g., progressive gallery batches) are automatically observed.
 */
export function useRevealAnimation() {
  useEffect(() => {
    const selectors = '.reveal-up, .reveal-fade, .reveal-scale, .reveal-clip, .reveal-from-left, .reveal-from-right, .reveal-on-mobile';

    let observer: IntersectionObserver | null = null;

    const observeNewElements = () => {
      if (!observer) return;
      const revealEls = document.querySelectorAll(selectors);
      revealEls.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          observer!.observe(el);
        }
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target); // fire once only
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 150px 0px' }
    );

    observeNewElements();

    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        observeNewElements();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);
}
