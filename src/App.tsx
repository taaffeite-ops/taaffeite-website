import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { MenuDrawer } from './components/MenuDrawer';
import { Footer } from './components/Footer';

// Lazy load pages for performance optimization (code splitting)
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Services = React.lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Media = React.lazy(() => import('./pages/Media').then(module => ({ default: module.Media })));
const Enquire = React.lazy(() => import('./pages/Enquire').then(module => ({ default: module.Enquire })));

// Scroll to top component on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Global scroll reveal observer trigger
const ScrollRevealTrigger: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => {
        el.classList.remove('active'); // Reset state on page change
        revealObserver.observe(el);
      });

      return () => {
        revealObserver.disconnect();
      };
    } else {
      revealElements.forEach(el => el.classList.add('active'));
    }
  }, [pathname]);

  return null;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock page scrolling when menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  return (
    <Router>
      <ScrollToTop />
      <ScrollRevealTrigger />
      <div className="app-container">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <MenuDrawer isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <main className="main-content">
          <Suspense fallback={
            <div className="page-loader" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
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
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
