import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Brand description */}
        <div className="footer-brand">
          <img 
            src="/assets/images/logo.png" 
            alt="Taaffeite Events Logo" 
            className="footer-logo" 
            width={4500}
            height={4500}
            loading="lazy"
            decoding="async"
          />
          <p className="footer-desc">
            Taaffeite is a high-end luxury events planning agency specializing in elegant, warm, and minimal celebrations. Named after one of the rarest gemstones in the world.
          </p>
        </div>

        {/* Page links */}
        <div className="footer-nav">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/media">Media</Link></li>
            <li><Link to="/enquire">Enquire</Link></li>
          </ul>
        </div>

        {/* Contact detail */}
        <div className="footer-contact">
          <h4>Connect with Us</h4>
          <p>Email: <a href="mailto:thetaaffeiteevents@gmail.com" style={{ color: 'var(--color-gold-dark)' }}>thetaaffeiteevents@gmail.com</a></p>
          <p>WhatsApp: <a href="https://wa.me/919148990266" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-dark)' }}>+91 91489 90266</a></p>

          <div className="footer-social-icons">
            <a href="https://www.instagram.com/taaffeiteevents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.wedmegood.com/profile/Taaffeite-Events-25042588?srsltid=AfmBOop_bgaeRe3LCx6eg9jacDSxhOKk-9glpzOU3wzwjiCIgl-829hI" target="_blank" rel="noopener noreferrer">WedMeGood</a>
            <a href="https://www.linkedin.com/company/taaffeiteevents/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://ar.pinterest.com/thetaaffeiteevents/_created/" target="_blank" rel="noopener noreferrer">Pinterest</a>
            <a href="https://www.youtube.com/@Taaffeiteevents" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Taaffeite Events. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="mailto:thetaaffeiteevents@gmail.com">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};
