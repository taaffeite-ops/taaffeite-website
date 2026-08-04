import React from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from './OptimizedImage';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

const marqueeImages = [
  {
    src: "/assets/05 PHOTOS/Weddings/AKR05567.webp",
    alt: "Luxury wedding mandap floral styling by Taaffeite Events, top wedding planners in Bangalore",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.webp",
    alt: "Bespoke Haldi ceremony welcome hampers designed by event planners in Bangalore, India",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Reception/WEVA1312 2.webp",
    alt: "Luxury wedding reception table styling by Taaffeite Events — event management company in Bangalore",
    width: 3651,
    height: 5477
  },
  {
    src: "/assets/05 PHOTOS/Weddings/AKR07499.webp",
    alt: "Elegant wedding ceremony mandap decor in Bangalore by Taaffeite luxury event designers",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02772.webp",
    alt: "Vibrant Haldi celebration setup by Taaffeite Events — pre-wedding planners in Bengaluru",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Weddings/AKR05590.webp",
    alt: "Elegant wedding floral arch decor by top wedding decorators in Bangalore, Taaffeite Events",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Reception/WEVA1313 2.webp",
    alt: "Bespoke dinner banquet styling for luxury wedding reception in Bangalore by Taaffeite Events",
    width: 4000,
    height: 2666
  },
  {
    src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03432.webp",
    alt: "Exotic floral canopy styling for Haldi ceremony by Taaffeite Events, wedding planners in Bengaluru",
    width: 2400,
    height: 3600
  }
];

export const Glimpse = React.memo(React.forwardRef<HTMLElement, {}>((_, ref) => {
  useRevealAnimation();

  return (
    <section className="glimpse-section" ref={ref}>
      <div className="glimpse-container">
        <div className="glimpse-text-wrapper reveal-up reveal-slow">
          <span className="glimpse-sub-label">A Glimpse Into</span>
          <h2 className="glimpse-title">The World We Create</h2>
          <div className="glimpse-divider"></div>
          <p className="glimpse-desc">
            <span className="glimpse-desc-line">Every celebration you see here began with a simple question...</span>
            <span className="glimpse-desc-line">"Can we trust you with one of the most important days of our lives?"</span>
            <span className="glimpse-desc-line">Our answer will always be the same. Through our work.</span>
          </p>
        </div>

        {/* Curated infinite marquee image slider */}
        <div className="glimpse-marquee-container">
          <div className="glimpse-marquee-track">
            {/* First Set */}
            {marqueeImages.map((img, idx) => (
              <div key={`set1-${idx}`} className="glimpse-marquee-card">
                <OptimizedImage
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  aspectRatio="unset"
                  containerStyle={{ width: '100%', height: '100%' }}
                />
              </div>
            ))}
            {/* Duplicate Set for infinite looping */}
            {marqueeImages.map((img, idx) => (
              <div key={`set2-${idx}`} className="glimpse-marquee-card" aria-hidden="true">
                <OptimizedImage
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  aspectRatio="unset"
                  containerStyle={{ width: '100%', height: '100%' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glimpse-action reveal-fade">
          <Link to="/media" className="btn-editorial">View Full Media Gallery</Link>
        </div>
      </div>
    </section>
  );
}));

Glimpse.displayName = 'Glimpse';
