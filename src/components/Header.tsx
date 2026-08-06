import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isMenuOpen?: boolean;
  setIsMenuOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const toggleMenu = () => {
    if (setIsMenuOpen) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const [headerLoaded, setHeaderLoaded] = useState(false);

  useEffect(() => {
    // Trigger entry animation frame after initial paint to prevent CLS
    const rAF = requestAnimationFrame(() => {
      setHeaderLoaded(true);
    });
    return () => cancelAnimationFrame(rAF);
  }, []);

  // Strict scroll handler: hides when scrolling down, reveals when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      setIsScrolled(currentScrollY > 50);

      // Only check direction if moved more than 5px to ignore micro jitter
      if (Math.abs(diff) > 5) {
        if (diff > 0 && currentScrollY > 50) {
          setIsVisible(false); // Scrolling DOWN -> hide navbar
        } else if (diff < 0) {
          setIsVisible(true);  // Scrolling UP -> show navbar
        }
      }

      if (currentScrollY <= 20) {
        setIsVisible(true); // At top of page
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Instantiate global background audio
    const audio = new Audio('/assets/audio/final audio.mp3');
    audio.loop = true;
    audio.currentTime = 0; // Force replay from start on reload
    audioRef.current = audio;

    // Handle backgrounding / minimizing / tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          wasPlayingRef.current = true;
          setIsPlaying(false);
        } else {
          wasPlayingRef.current = false;
        }
      } else {
        if (wasPlayingRef.current && audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.log("Failed to resume audio on visibility change:", err.message);
            });
          wasPlayingRef.current = false;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      audio.pause();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("Audio playback failed", err);
          });
      }
    }
  };

  return (
    <>
      {/* Brand logo floating at top left */}
      {isHomePage && (
        <div className={`floating-brand-left desktop-only ${isScrolled ? 'scrolled' : ''}`}>
          <Link to="/" className="header-logo-link" aria-label="Taaffeite Events Home" onClick={() => setIsMenuOpen && setIsMenuOpen(false)}>
            <img src="/assets/images/navbar-logo.webp" alt="Taaffeite Events Logo" className="header-logo-img" />
          </Link>
        </div>
      )}

      {/* Audio button floating at top right */}
      {isHomePage && (
        <div className={`floating-sound-control desktop-only ${isScrolled ? 'scrolled' : ''}`}>
          <button 
            className="sound-toggle" 
            id="sound-toggle" 
            onClick={toggleSound}
            aria-label={isPlaying ? "Mute Background Music" : "Unmute Background Music"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.27 4.27L19.54 21 20.8 19.73 4.27 3zM14 7h4V3h-6v4.18l2 2V7z"/>
              </svg>
            )}
          </button>
        </div>
      )}

      <header className={`site-header ${headerLoaded ? 'header-animated' : ''} ${isScrolled || !isHomePage ? 'scrolled' : 'at-top'} ${isScrolled ? 'is-scrolled' : ''} ${isVisible ? 'nav-visible' : 'nav-hidden'} ${isMenuOpen ? 'menu-expanded' : ''}`}>
        <div className="header-top-row">
          {/* Mobile-only logo inside header */}
          <div className="header-brand-left mobile-only">
            <Link to="/" className="header-logo-link" aria-label="Taaffeite Events Home" onClick={() => setIsMenuOpen && setIsMenuOpen(false)}>
              <img src="/assets/images/navbar-logo.webp" alt="Taaffeite Events Logo" className="header-logo-img" />
            </Link>
          </div>

          <nav className="header-top-nav">
            <Link to="/" className={`top-nav-link ${location.pathname === '/' ? 'active' : ''}`}>HOME</Link>
            <Link to="/services" className={`top-nav-link ${location.pathname === '/services' ? 'active' : ''}`}>SERVICES</Link>
            <Link to="/media" className={`top-nav-link ${location.pathname === '/media' ? 'active' : ''}`}>MEDIA</Link>
            <Link to="/enquire" className={`top-nav-link ${location.pathname === '/enquire' ? 'active' : ''}`}>ENQUIRE</Link>
          </nav>

          <div className="header-controls">
            {/* Mobile-only sound control inside header */}
            <button 
              className="sound-toggle mobile-only" 
              id="sound-toggle-mobile" 
              onClick={toggleSound}
              aria-label={isPlaying ? "Mute Background Music" : "Unmute Background Music"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.27 4.27L19.54 21 20.8 19.73 4.27 3zM14 7h4V3h-6v4.18l2 2V7z"/>
                </svg>
              )}
            </button>

            {/* Mobile Accordion Dropdown Menu Toggle Button */}
            <button
              className="menu-toggle mobile-only"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              <span className="menu-line"></span>
              <span className="menu-line menu-line-short"></span>
              <span className="menu-line"></span>
            </button>
          </div>
        </div>

        {/* EMBEDDED ACCORDION DROPDOWN PANEL (EXTENDS DIRECTLY FROM NAVBAR ON MOBILE) */}
        <div className={`navbar-dropdown-panel mobile-only ${isMenuOpen ? 'open' : ''}`}>
          <nav className="dropdown-nav-links">
            <Link to="/" className={`dropdown-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen && setIsMenuOpen(false)}>
              HOME
            </Link>
            <Link to="/services" className={`dropdown-nav-item ${location.pathname === '/services' ? 'active' : ''}`} onClick={() => setIsMenuOpen && setIsMenuOpen(false)}>
              SERVICES
            </Link>
            <Link to="/media" className={`dropdown-nav-item ${location.pathname === '/media' ? 'active' : ''}`} onClick={() => setIsMenuOpen && setIsMenuOpen(false)}>
              MEDIA
            </Link>
            <Link to="/enquire" className={`dropdown-nav-item ${location.pathname === '/enquire' ? 'active' : ''}`} onClick={() => setIsMenuOpen && setIsMenuOpen(false)}>
              ENQUIRE
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};
