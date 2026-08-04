import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OptimizedImage } from './OptimizedImage';

export const Footer: React.FC = () => {
  const location = useLocation();

  const handleNavClick = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Brand description */}
        <div className="footer-brand">
          <OptimizedImage
            src="/assets/images/logo.webp"
            alt="Taaffeite Events Logo"
            className="footer-logo"
            width={80}
            height={80}
            objectFit="contain"
            containerStyle={{ width: '80px', height: '80px', backgroundColor: 'transparent' }}
          />
          <p className="footer-desc">
            Taaffeite is a high-end luxury events planning agency specializing in elegant, warm, and minimal celebrations. Named after one of the rarest gemstones in the world.
          </p>
        </div>

        {/* Page links */}
        <div className="footer-nav">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li>
              <Link to="/" onClick={() => handleNavClick('/')}>
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" onClick={() => handleNavClick('/services')}>
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
                Services
              </Link>
            </li>
            <li>
              <Link to="/media" onClick={() => handleNavClick('/media')}>
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6h-3.17L14.25 4h-4.5L8.17 6H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="18" cy="9" r="1.2" />
                </svg>
                Media
              </Link>
            </li>
            <li>
              <Link to="/enquire" onClick={() => handleNavClick('/enquire')}>
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Enquire
              </Link>
            </li>
          </ul>
        </div>

        {/* Profile Links */}
        <div className="footer-nav">
          <h4>Links</h4>
          <ul className="footer-links">
            <li>
              <a href="https://www.wedmegood.com/profile/Taaffeite-Events-25042588?srsltid=AfmBOop_bgaeRe3LCx6eg9jacDSxhOKk-9glpzOU3wzwjiCIgl-829hI" target="_blank" rel="noopener noreferrer">
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                WedMeGood
              </a>
            </li>
            <li>
              <a href="https://ar.pinterest.com/thetaaffeiteevents/_created/" target="_blank" rel="noopener noreferrer">
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.66 7.85 6.4 9.27-.08-.79-.15-2 .03-2.86.16-.7.98-4.22.98-4.22s-.25-.5-.25-1.25c0-1.17.68-2.05 1.53-2.05.72 0 1.07.54 1.07 1.19 0 .73-.46 1.82-.7 2.83-.2.84.42 1.52 1.25 1.52 1.5 0 2.65-1.58 2.65-3.86 0-2.02-1.45-3.43-3.52-3.43-2.4 0-3.8 1.8-3.8 3.65 0 .73.28 1.51.63 1.93.07.08.08.15.06.23l-.23.95c-.04.16-.13.2-.3.12-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.9-5.41 3.1 0 5.5 2.21 5.5 5.16 0 3.08-1.95 5.56-4.65 5.56-.9 0-1.76-.48-2.05-1.03l-.56 2.14c-.2 0.78-.76 1.76-1.14 2.38 1.12.35 2.31.54 3.55.54 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
                Pinterest
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/taaffeiteevents/" target="_blank" rel="noopener noreferrer">
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@Taaffeiteevents" target="_blank" rel="noopener noreferrer">
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
            </li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="footer-contact">
          <h4>Connect with Us</h4>
          <ul className="footer-links">
            <li>
              <a href="mailto:thetaaffeiteevents@gmail.com">
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                thetaaffeiteevents@gmail.com
              </a>
            </li>
            <li>
              <a href="https://wa.me/919148990266" target="_blank" rel="noopener noreferrer">
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.944 9.944 0 0 0 4.777 1.224h.005c5.505 0 9.989-4.478 9.99-9.985A9.983 9.983 0 0 0 12.012 2zm5.835 14.165c-.244.688-1.22 1.259-1.688 1.312-.469.052-.924.234-2.949-.575-2.585-1.033-4.225-3.666-4.354-3.839-.129-.172-1.045-1.387-1.045-2.646 0-1.259.66-1.876.894-2.122.234-.246.509-.307.679-.307.17 0 .34.004.488.01.156.007.368-.06.575.44.212.513.722 1.76.786 1.892.064.133.106.287.017.464-.089.177-.133.287-.266.442-.133.156-.279.348-.399.467-.133.133-.272.278-.117.54.156.262.69 1.135 1.48 1.839.998.892 1.838 1.168 2.097 1.298.26.13.409.108.56-.065.152-.173.65-.758.824-1.017.174-.258.348-.216.586-.129.238.087 1.517.714 1.776.844.26.13.433.195.497.306.064.11.064.64-.18 1.328z"/>
                </svg>
                +91 91489 90266 (WhatsApp)
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/taaffeiteevents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">
                <svg className="footer-link-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm5.5 1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                @taaffeiteevents (Instagram)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Taaffeite Events. All rights reserved.</p>
      </div>
    </footer>
  );
};
