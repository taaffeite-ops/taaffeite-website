import React, { useState, useEffect, useRef } from 'react';
import { OptimizedImage } from './OptimizedImage';

interface CardData {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const logoStoryCards: CardData[] = [
  {
    id: 1,
    src: "/assets/images/1.webp",
    alt: "Butterflies — Taaffeite Events Logo Story",
    title: "Butterflies",
    description: "Transformation begins with every new step toward beautiful beginnings."
  },
  {
    id: 2,
    src: "/assets/images/2.webp",
    alt: "Taaffeite — Taaffeite Events Logo Story",
    title: "Taaffeite",
    description: "As rare as the gemstone itself, representing timeless possibilities."
  },
  {
    id: 3,
    src: "/assets/images/3.webp",
    alt: "Tale of Our Logo — Taaffeite Events Logo Story",
    title: "Tale of Our Logo",
    description: "A symbol of uniqueness and growth, reflecting every new beginning."
  },
];

interface MobileLogoCarouselProps { }

const MobileLogoCarousel: React.FC<MobileLogoCarouselProps> = () => {
  const originalCards = logoStoryCards;

  const clonedCards = [
    originalCards[1], // Card 2 (index 0)
    originalCards[2], // Card 3 (index 1)
    originalCards[0], // Card 1 (index 2)
    originalCards[1], // Card 2 (index 3)
    originalCards[2], // Card 3 (index 4)
    originalCards[0], // Card 1 (index 5)
    originalCards[1], // Card 2 (index 6)
  ];

  const [currentIndex, setCurrentIndex] = useState(2); // Card 1 Original
  const [containerWidth, setContainerWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 375);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const dragDirectionRef = useRef<'none' | 'horizontal' | 'vertical'>('none');

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  // Auto-scroll loop effect: advances slides every 2 seconds when idle
  useEffect(() => {
    if (isDragging || isTransitioning) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTransitionEnabled(true);
      setCurrentIndex(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isDragging, isTransitioning]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    currentXRef.current = touch.clientX;
    dragDirectionRef.current = 'none';
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning) return;
    const touch = e.touches[0];
    currentXRef.current = touch.clientX;

    const diffX = touch.clientX - startXRef.current;
    const diffY = touch.clientY - startYRef.current;

    if (dragDirectionRef.current === 'none') {
      if (Math.abs(diffX) > Math.abs(diffY) + 5) {
        dragDirectionRef.current = 'horizontal';
      } else if (Math.abs(diffY) > Math.abs(diffX) + 5) {
        dragDirectionRef.current = 'vertical';
      }
    }

    if (dragDirectionRef.current === 'horizontal') {
      if (e.cancelable) {
        e.preventDefault();
      }
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragDirectionRef.current === 'horizontal') {
      const threshold = 60;
      if (dragOffset < -threshold) {
        setIsTransitioning(true);
        setTransitionEnabled(true);
        setCurrentIndex(prev => prev + 1);
      } else if (dragOffset > threshold) {
        setIsTransitioning(true);
        setTransitionEnabled(true);
        setCurrentIndex(prev => prev - 1);
      } else {
        setIsTransitioning(true);
        setTransitionEnabled(true);
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    dragDirectionRef.current = 'none';
  };

  const handleTransitionEnd = () => {
    if (currentIndex === 5) {
      setTransitionEnabled(false);
      setCurrentIndex(2);
    } else if (currentIndex === 1) {
      setTransitionEnabled(false);
      setCurrentIndex(4);
    }
    setIsTransitioning(false);
  };

  const cardWidth = Math.min(containerWidth * 0.75, 280);
  const gap = 16;
  const centerOffset = (containerWidth - cardWidth) / 2;
  const translateOffset = centerOffset - currentIndex * (cardWidth + gap) + (isDragging ? dragOffset : 0);

  const trackStyle: React.CSSProperties = {
    transform: `translate3d(${translateOffset}px, 0, 0)`,
    transition: transitionEnabled && !isDragging ? 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
  };

  return (
    <div className="mobile-carousel-container" ref={containerRef}>
      <div
        className="mobile-carousel-track"
        style={trackStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTransitionEnd={handleTransitionEnd}
      >
        {clonedCards.map((card, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`mobile-carousel-slide ${isActive ? 'active' : ''}`}
              style={{
                flex: `0 0 ${cardWidth}px`,
                width: `${cardWidth}px`,
                margin: `0 ${gap / 2}px`,
                boxSizing: 'border-box',
                transition: transitionEnabled && !isDragging ? 'opacity 0.3s ease, transform 0.3s ease' : 'none',
                opacity: isActive ? 1 : 0.4,
                transform: isActive ? 'scale(1)' : 'scale(0.88)',
              }}
            >
              <div className="mobile-carousel-card-inner">
                <div className="mobile-carousel-img-wrapper">
                  <OptimizedImage
                    src={card.src}
                    alt={card.alt}
                    width={2400}
                    height={3600}
                    aspectRatio="unset"
                    containerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="logo-story-card-content">
                  <h3 className="logo-story-card-title">{card.title}</h3>
                  <p className="logo-story-card-desc">{card.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface LogoStorySectionProps {
  isMobile?: boolean;
}

export const LogoStorySection: React.FC<LogoStorySectionProps> = ({ isMobile }) => {
  return (
    <section className="founders-grid-section story-behind-logo-section">
      <div className="founders-pillars-container">
        <div className="founders-pillars-header">
          <h2 className="founders-pillars-title">Story Behind Our <span>Logo</span></h2>
          <div className="founders-pillars-divider"></div>
        </div>

        {isMobile ? (
          <MobileLogoCarousel />
        ) : (
          <div className="founders-trio-row">
            {logoStoryCards.map((card) => (
              <div key={card.id} className={`founders-trio-card founders-trio-img--${card.id}`}>
                <div className="founders-trio-img-wrapper">
                  <OptimizedImage
                    src={card.src}
                    alt={card.alt}
                    width={2400}
                    height={3600}
                    aspectRatio="unset"
                    containerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="logo-story-card-content">
                  <h3 className="logo-story-card-title">{card.title}</h3>
                  <p className="logo-story-card-desc">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

