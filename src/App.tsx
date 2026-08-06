import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';

// Lazy load non-essential third-party features to prevent script execution delays during page load
const DeferredLenis = React.lazy(() => import('lenis/react').then(m => {
  import('lenis/dist/lenis.css');
  return { default: m.ReactLenis };
}));
const DeferredAnalytics = React.lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })));

// Lazy load pages for performance optimization (code splitting)
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Services = React.lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Media = React.lazy(() => import('./pages/Media').then(module => ({ default: module.Media })));
const Enquire = React.lazy(() => import('./pages/Enquire').then(module => ({ default: module.Enquire })));

// Lazy load non-critical components
const Footer = React.lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

// Scroll to top component on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  
  return null;
};

// Global scroll reveal observer trigger
const ScrollRevealTrigger: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupReveal = () => {
      if (observer) {
        observer.disconnect();
      }

      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      
      if ('IntersectionObserver' in window && revealElements.length > 0) {
        observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              obs.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
          if (!el.classList.contains('active') && observer) {
            observer.observe(el);
          }
        });
      } else if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('active'));
      }
    };

    // Reset reveal elements active class on pathname change to animate them again
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
      el.classList.remove('active');
    });

    const timer1 = setTimeout(setupReveal, 100);
    const timer2 = setTimeout(setupReveal, 350);
    const timer3 = setTimeout(setupReveal, 800);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  return null;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadNonEssential, setLoadNonEssential] = useState(false);

  // Signal to the global loader that React has mounted and the page is ready.
  // Defer non-essential scripts (Lenis smooth scroll, Analytics) until idle after FCP/LCP.
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    document.dispatchEvent(new Event('react-ready'));

    const triggerDeferred = () => setLoadNonEssential(true);
    if ('requestIdleCallback' in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(triggerDeferred);
      return () => (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(triggerDeferred, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const content = (
    <Router>
      <ScrollToTop />
      <ScrollRevealTrigger />
      <div className="app-container">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <main className="main-content">
          <Suspense fallback={
            <div className="page-loader" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-gold)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontSize: '0.9rem'
            }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/media" element={<Media />} />
              <Route path="/enquire" element={<Enquire />} />
              {/* Fallback redirect */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        
        <Suspense fallback={<div style={{ minHeight: '300px', backgroundColor: 'var(--color-navy)' }} />}>
          <Footer />
        </Suspense>
      </div>
      {loadNonEssential && (
        <Suspense fallback={null}>
          <DeferredAnalytics />
        </Suspense>
      )}
    </Router>
  );

  if (loadNonEssential) {
    return (
      <Suspense fallback={content}>
        <DeferredLenis root>
          {content}
        </DeferredLenis>
      </Suspense>
    );
  }

  return content;
}

export default App;
