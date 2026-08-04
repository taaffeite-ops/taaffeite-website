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

    // Hoist the observer reference so the cleanup function can disconnect it
    // even if the idle callback fires after unmount.
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
        { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }
      );

      revealEls.forEach((el) => observer!.observe(el));
    };

    // Push setup off the critical render task.
    // timeout:2000 ensures it still runs even if the browser is busy.
    // Falls back to setTimeout for Safari which doesn't support requestIdleCallback.
    let idleId: number;
    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(setup, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(setup, 200) as unknown as number;
    }

    return () => {
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      observer?.disconnect();
    };
  }, []);
}
