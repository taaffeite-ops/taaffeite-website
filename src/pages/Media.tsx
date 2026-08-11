import React, { useState, useEffect } from 'react';
import { OptimizedImage } from '../components/OptimizedImage';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

interface MediaPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const Media: React.FC = () => {
  useRevealAnimation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [fadeActive, setFadeActive] = useState(true);

  const photos: MediaPhoto[] = [
    {
      src: "/assets/05 PHOTOS/1/0013.webp",
      alt: "Bespoke grand mandap floral arch design by Taaffeite Events — luxury wedding planners in Bangalore",
      width: 3744,
      height: 5616
    },
    {
      src: "/assets/05 PHOTOS/2/K&R-4728.jpg.webp",
      alt: "Taaffeite Events 2 decor design — K&R 4728.jpg",
      width: 6692,
      height: 4461
    },
    {
      src: "/assets/05 PHOTOS/1/0071.webp",
      alt: "Elegant royal entrance gates with cascading blooms by Taaffeite Events — luxury event management in Bangalore",
      width: 3744,
      height: 5616
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.28.43 PM (2).webp",
      alt: "Bespoke lounge seating for luxury evening reception by Taaffeite Events in Bangalore",
      width: 1600,
      height: 1423
    },
    {
      src: "/assets/05 PHOTOS/2/K&R-4033.jpg.webp",
      alt: "Taaffeite Events 2 decor design — K&R 4033.jpg",
      width: 5472,
      height: 3648
    },
    {
      src: "/assets/05 PHOTOS/1/0073.webp",
      alt: "Warm candlelit dining setup with velvet linens by Taaffeite Events — wedding reception decorators Bangalore",
      width: 3744,
      height: 5616
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.28.43 PM.webp",
      alt: "Intimate candlelit table arrangement for proposal dinner by Taaffeite Events",
      width: 1561,
      height: 1461
    },
    {
      src: "/assets/05 PHOTOS/1/0074.webp",
      alt: "Sculpted floral centerpiece and fine porcelain by Taaffeite Events — bespoke wedding designers in Bengaluru",
      width: 3703,
      height: 5555
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.28.45 PM.webp",
      alt: "Exquisite floral arch entrance for pre-wedding celebration by Taaffeite Events",
      width: 1400,
      height: 1348
    },
    {
      src: "/assets/05 PHOTOS/1/u8wnifssmlzdrb3g6bob.webp",
      alt: "Delicate pastel rose floral installation by Taaffeite Events — luxury event planners in Bangalore",
      width: 3525,
      height: 5419
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.34.42 PM (1).webp",
      alt: "Sleek mirrored banquet bar setup by Taaffeite Events — luxury event planners in Bangalore",
      width: 1549,
      height: 1372
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.28.42 PM (1).webp",
      alt: "Chic cocktail lounge styling with gold accents by Taaffeite Events in Bangalore",
      width: 1382,
      height: 1600
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.34.42 PM.webp",
      alt: "Romantic twilight lighting for lawn reception by Taaffeite Events in Bangalore",
      width: 1536,
      height: 1180
    },
    {
      src: "/assets/05 PHOTOS/2/Sanhita & Benny-47.jpg.webp",
      alt: "Taaffeite Events 2 decor design — Sanhita & Benny 47.jpg",
      width: 5544,
      height: 8316
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.28.42 PM.webp",
      alt: "Vibrant festive Haldi decor with suspended marigolds by Taaffeite Events in Bengaluru",
      width: 1411,
      height: 1600
    },
    {
      src: "/assets/05 PHOTOS/1/zfvn1kbgc9xkwguh03zl.webp",
      alt: "Grand ballroom floral stage backdrop by Taaffeite Events — event designers in Bangalore",
      width: 5192,
      height: 3311
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.28.46 PM.webp",
      alt: "Traditional brass lamp and floral urli setup by Taaffeite Events in Bangalore",
      width: 1202,
      height: 1600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02762.webp",
      alt: "Bright festive floral swing setup by Taaffeite Events — bespoke pre-wedding planners in Bengaluru",
      width: 3600,
      height: 2400
    },
    {
      src: "/assets/05 PHOTOS/1/WhatsApp Image 2026-08-04 at 3.34.42 PM (2).webp",
      alt: "Bespoke floral mandap pillar details by Taaffeite Events — wedding planners in Bengaluru",
      width: 1173,
      height: 1600
    },
    {
      src: "/assets/05 PHOTOS/2/Sanhita & Benny-7 (2).jpg.webp",
      alt: "Taaffeite Events 2 decor design — Sanhita & Benny 7 (2).jpg",
      width: 5585,
      height: 8378
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp",
      alt: "Festive swing decor with yellow rose garlands by Taaffeite Events — pre-wedding planners in Bangalore",
      width: 3600,
      height: 2400
    },
    {
      src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39266.webp",
      alt: "Suspended wisteria floral installations by Taaffeite Events — premium wedding decorators in Bangalore",
      width: 4608,
      height: 3072
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02741.webp",
      alt: "Vibrant marigold Haldi ceremony designed by Taaffeite Events — event planners in Bengaluru",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Reception/WEVA1313 2.webp",
      alt: "Handcrafted calligraphy placecards for luxury wedding reception by Taaffeite Events in Bangalore",
      width: 4000,
      height: 2666
    },
    {
      src: "/assets/05 PHOTOS/1/zjq2zj5ucjlz0fgjtt67.webp",
      alt: "Royal mandap ceiling with cascading floral chandelier by Taaffeite Events in Bangalore",
      width: 3703,
      height: 5555
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.webp",
      alt: "Hand-painted pot arrangements for Haldi ceremony by Taaffeite Events in Bangalore",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02778.webp",
      alt: "Festive bohemian lounge styling by Taaffeite Events — pre-wedding celebration designers in Bangalore",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03301.webp",
      alt: "Vibrant yellow backdrop and drapes for Haldi ceremony by Taaffeite Events in Bengaluru",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR07379.webp",
      alt: "Classic white hydrangea wedding altar by Taaffeite Events — top wedding planners in Bangalore",
      width: 3600,
      height: 2400
    },
    {
      src: "/assets/05 PHOTOS/Weddings/IMG_7094.webp",
      alt: "Pastel florals courtyard wedding stage by Taaffeite Events — top wedding decorators in Bengaluru",
      width: 4752,
      height: 3168
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03432.webp",
      alt: "Sun-drenched courtyard swing and marigold chains by Taaffeite Events — event planners in Bangalore",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Weddings/PRJ07750.webp",
      alt: "Groom and bride grand exit mandap ceremony by Taaffeite Events — wedding planners in Bangalore",
      width: 4752,
      height: 3168
    },
    {
      src: "/assets/05 PHOTOS/2/K&R-8824.jpg.webp",
      alt: "Taaffeite Events 2 decor design — K&R 8824.jpg",
      width: 3907,
      height: 5860
    },
    {
      src: "/assets/05 PHOTOS/Weddings/IMG_7095.webp",
      alt: "Clear glass lakeside wedding altar details by Taaffeite Events — luxury wedding planners Bangalore",
      width: 4024,
      height: 6036
    },
    {
      src: "/assets/05 PHOTOS/Weddings/Sanhita & Benny-13.webp",
      alt: "Luxury wedding altar styling by Taaffeite Events — premier wedding planners in Bangalore, India",
      width: 8640,
      height: 5760
    },
    {
      src: "/assets/05 PHOTOS/Proposal/0001.webp",
      alt: "Elegant seaside canopy proposal design by Taaffeite Events — luxury event designers in Bangalore",
      width: 4660,
      height: 6990
    },
    {
      src: "/assets/05 PHOTOS/Proposal/ANS01113.webp",
      alt: "Bespoke floral wall proposal panel by Taaffeite Events — luxury event designers in Bangalore, India",
      width: 4591,
      height: 6886
    },
    {
      src: "/assets/05 PHOTOS/Weddings/Sanhita & Benny-27.webp",
      alt: "Bride and groom grand entrance with sparklers — Taaffeite Events wedding planners Bangalore",
      width: 8640,
      height: 5760
    },
    {
      src: "/assets/05 PHOTOS/1/2.webp",
      alt: "Taaffeite Events 1 decor design — 2",
      width: 1080,
      height: 1350
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR04789.webp",
      alt: "Taaffeite Events Weddings decor design — AKR04789",
      width: 3600,
      height: 2400
    },
    {
      src: "/assets/05 PHOTOS/Proposal/ANS01928.webp",
      alt: "Lush rose archway entryway proposal design by Taaffeite Events — luxury planners in Bangalore",
      width: 4561,
      height: 6842
    },
    {
      src: "/assets/05 PHOTOS/Reception/Weva1701.webp",
      alt: "Sleek modern dinner banquet setup by Taaffeite Events — top event management company in Bangalore",
      width: 3645,
      height: 5467
    },
    {
      src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_26Kaushal_Story349.webp",
      alt: "Mirror walkway and uplighting reception setup by Taaffeite Events — event management in Bangalore",
      width: 3651,
      height: 4564
    },
    {
      src: "/assets/05 PHOTOS/1/0063.webp",
      alt: "Lush banquet table setting with crystal chandeliers by Taaffeite Events — top luxury event planners Bangalore",
      width: 5398,
      height: 3677
    },
    {
      src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39412.webp",
      alt: "Banquet table linens and crystal details by Taaffeite Events — wedding reception designers in Bangalore",
      width: 3651,
      height: 5111
    },
    {
      src: "/assets/05 PHOTOS/2/0040 (1).jpg.webp",
      alt: "Taaffeite Events 2 decor design — 0040 (1).jpg",
      width: 4389,
      height: 3015
    },
    {
      src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_44222.webp",
      alt: "Glow signage and neon tunnel archway for wedding reception by Taaffeite Events in Bangalore",
      width: 3651,
      height: 4564
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR05567.webp",
      alt: "Richly decorated ivory pillars mandap by Taaffeite Events — luxury wedding decorators in Bangalore",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR05590.webp",
      alt: "Courtyard floral stage setup by Taaffeite Events — premium wedding decorators in Bangalore, India",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR07499.webp",
      alt: "Traditional red rose canopy wedding decor by Taaffeite Events — event planners Bengaluru",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/2/SBJR_Ritvika_Kaushal_29313.jpg.webp",
      alt: "Taaffeite Events 2 decor design — SBJR Ritvika Kaushal 29313.jpg",
      width: 7008,
      height: 4672
    },
    {
      src: "/assets/05 PHOTOS/Weddings/IMG_7087.webp",
      alt: "Arching pastel pink blossom mandap by Taaffeite Events — luxury wedding planners in Bangalore, India",
      width: 3168,
      height: 4752
    },
    {
      src: "/assets/05 PHOTOS/Weddings/IMG_7093.webp",
      alt: "Lakeside clear glass mandap wedding altar designed by Taaffeite Events — Bangalore wedding planners",
      width: 4149,
      height: 6224
    },
    {
      src: "/assets/05 PHOTOS/2/K&R-FMS-0705.jpg.webp",
      alt: "Taaffeite Events 2 decor design — K&R FMS 0705.jpg",
      width: 4000,
      height: 6000
    },
    {
      src: "/assets/05 PHOTOS/Weddings/Sanhita & Benny-19 2.webp",
      alt: "Red rose mandap canopy columns at luxury wedding by Taaffeite Events in Bangalore, Karnataka",
      width: 5760,
      height: 8640
    },
    {
      src: "/assets/05 PHOTOS/2/Sanhita & Benny-73.jpg.webp",
      alt: "Taaffeite Events 2 decor design — Sanhita & Benny 73.jpg",
      width: 4150,
      height: 5673
    },
    {
      src: "/assets/05 PHOTOS/Weddings/Sanhita & Benny-21.webp",
      alt: "Warm candlelit temple mandap wedding ceremony by Taaffeite Events — event designers in Bangalore",
      width: 5760,
      height: 8640
    },
    {
      src: "/assets/05 PHOTOS/Weddings/Sanhita & Benny-24.webp",
      alt: "Ornate silk drapes and gold pillar wedding details by Taaffeite Events — Bangalore wedding planners",
      width: 5760,
      height: 8640
    },
    {
      src: "/assets/05 PHOTOS/Weddings/Sanhita & Benny-317 2.webp",
      alt: "Pastel hydrangea dome mandap altar by Taaffeite Events — top luxury wedding planners in Bangalore",
      width: 4631,
      height: 6946
    }
  ];

  // Note: automatic eager preloading of all 40 high-res gallery images has been removed to reduce thread blocking and network saturation.

  // Dynamic preload for the first image to optimize LCP
  useEffect(() => {
    const firstPhoto = photos[0];
    if (firstPhoto) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = firstPhoto.src;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);

  // Lock scrolling when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Handle Keyboard Navigation inside the Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setFadeActive(true);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = () => {
    setFadeActive(false);
    setTimeout(() => {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      setFadeActive(true);
    }, 200);
  };

  const showPrev = () => {
    setFadeActive(false);
    setTimeout(() => {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      setFadeActive(true);
    }, 200);
  };

  return (
    <div className="media-page-container">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <h1>Media & Impressions</h1>
        <div className="page-banner-diamond"></div>
        <p>A visual gallery of our signature celebrations</p>
      </section>

      {/* MEDIA INTRO */}
      <section className="media-intro">
        <p className="reveal-up">
          We curate moments that stay in memories forever. In our visual log, we share snippets of floral arrangements, architectural constructs, bespoke dinner styling, and guest hampers. Follow our ongoing journeys live on our social handles.
        </p>
        <div className="intro-divider reveal-fade" style={{ margin: '30px auto 0' }}></div>
      </section>

      {/* MASONRY GALLERY */}
      <section className="gallery-section">
        <div className="media-masonry" id="gallery-grid">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="media-item"
              onClick={() => openLightbox(index)}
              style={{ cursor: 'pointer' }}
            >
              <OptimizedImage
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
                eager={index < 6}
              />
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div
          id="gallery-lightbox"
          className="lightbox-modal active"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('lightbox-content')) {
              closeLightbox();
            }
          }}
        >
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">&times;</button>
          <button className="lightbox-prev" onClick={showPrev} aria-label="Previous image">&#10216;</button>
          <div className="lightbox-content">
            <img
              id="lightbox-img"
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].alt}
              width={photos[lightboxIndex].width}
              height={photos[lightboxIndex].height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                opacity: fadeActive ? 1 : 0,
                transition: 'opacity 0.2s ease'
              }}
            />
          </div>
          <button className="lightbox-next" onClick={showNext} aria-label="Next image">&#10217;</button>
        </div>
      )}

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title reveal-scale reveal-slow">See more of our daily work on Instagram.</h2>
          <a href="https://www.instagram.com/taaffeiteevents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="btn-luxury reveal-fade">Visit Instagram</a>
        </div>
      </section>
    </div>
  );
};
