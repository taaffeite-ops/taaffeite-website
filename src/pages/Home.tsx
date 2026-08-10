import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

// Lazy load below-the-fold sections
const FoundersShowcase = React.lazy(() =>
  import('../components/FoundersShowcase').then(module => ({ default: module.FoundersShowcase }))
);
const LogoStorySection = React.lazy(() =>
  import('../components/LogoStorySection').then(module => ({ default: module.LogoStorySection }))
);
const AboutShowcase = React.lazy(() =>
  import('../components/AboutShowcase').then(module => ({ default: module.AboutShowcase }))
);
const Glimpse = React.lazy(() =>
  import('../components/Glimpse').then(module => ({ default: module.Glimpse }))
);
const QuickEnquiry = React.lazy(() =>
  import('../components/QuickEnquiry').then(module => ({ default: module.QuickEnquiry }))
);
const JourneyTimeline = React.lazy(() =>
  import('../components/JourneyTimeline').then(module => ({ default: module.JourneyTimeline }))
);

export const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  // 2. Hero Symmetrical Scroll-Linked Shrink Animation Ref
  const heroSectionRef = useRef<HTMLElement>(null);

  // 3. Hero Quotes Slider States
  const [activeQuote, setActiveQuote] = useState(0);
  const quotes = [
    { text: "Because rare stories deserve rare celebrations.", author: "Brand Essence" },
    { text: "Luxury isn't about doing more. It's about making things feel right.", author: "Our Philosophy" },
    { text: "Honest, beautiful moments shared with the people who matter most.", author: "Our Mission" }
  ];

  // 4. Scroll-Linked About Showcase state
  const [activeAboutSlide, _setActiveAboutSlide] = useState<number>(0);
  const activeAboutSlideRef = useRef<number>(0);
  const aboutShowcaseRef = useRef<HTMLDivElement>(null);

  const setActiveAboutSlide = (val: number) => {
    activeAboutSlideRef.current = val;
    _setActiveAboutSlide(val);
  };

  // Founders Note Showcase state
  const [activeFoundersSlide, _setActiveFoundersSlide] = useState<number>(0);
  const activeFoundersSlideRef = useRef<number>(0);
  const foundersShowcaseRef = useRef<HTMLDivElement>(null);

  const setActiveFoundersSlide = (val: number) => {
    activeFoundersSlideRef.current = val;
    _setActiveFoundersSlide(val);
  };

  // Section refs for full-page scroll
  const glimpseRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const enquiryRef = useRef<HTMLElement>(null);

  // Wire scroll-reveal animations for the main page shell
  useRevealAnimation();

  // Instantly scroll to the top of the page on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Hero Section Symmetrical Shrink on Scroll (Hardware Accelerated Direct Mutation)
  useEffect(() => {
    let ticking = false;

    const handleHeroScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroSectionRef.current) {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const progress = Math.min(scrollY / windowHeight, 1);
            const scale = 1 - progress * 0.18;
            const radius = progress * 40;
            heroSectionRef.current.style.transform = `scale(${scale})`;
            heroSectionRef.current.style.borderRadius = `${radius}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    // Run once on mount to set initial state
    handleHeroScroll();

    return () => {
      window.removeEventListener('scroll', handleHeroScroll);
    };
  }, []);

  // Quotes Carousel Interval (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote(prev => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Passive scroll listener to update showcase slide transitions naturally as they scroll (for both mobile and desktop)
  useEffect(() => {
    const handleScrollTransitions = () => {
      const vh = window.innerHeight;

      // 1. Founders Showcase (Transition between Why Taaffeite title and Founder's Note)
      const fContainer = foundersShowcaseRef.current;
      if (fContainer) {
        const rect = fContainer.getBoundingClientRect();
        const scrolled = -rect.top;
        const total = rect.height - vh;
        if (total > 0) {
          const progress = Math.max(0, Math.min(scrolled / total, 1));
          const numSlides = 2;
          const rawSlide = progress * (numSlides - 1);
          const slide = Math.min(numSlides - 1, Math.round(rawSlide));
          if (slide !== activeFoundersSlideRef.current) {
            setActiveFoundersSlide(slide);
          }
        }
      }

      // 2. About Showcase
      const aContainer = aboutShowcaseRef.current;
      if (aContainer && !isMobile) {
        const rect = aContainer.getBoundingClientRect();
        const scrolled = -rect.top;
        const total = rect.height - vh;
        if (total > 0) {
          const progress = Math.max(0, Math.min(scrolled / total, 1));
          const slide = Math.min(2, Math.floor(progress * 3));
          if (slide !== activeAboutSlideRef.current) {
            setActiveAboutSlide(slide);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollTransitions, { passive: true });
    // Run once on mount to align initial scroll state
    handleScrollTransitions();
    return () => window.removeEventListener('scroll', handleScrollTransitions);
  }, [isMobile]);

  // Hero Background Images Slideshow (4 images)
  const heroImages = [
    {
      src: "/assets/05 PHOTOS/1/0010 (3).webp",
      width: 5398,
      height: 3677
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR07379.webp",
      width: 1411,
      height: 1600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp",
      width: 3600,
      height: 2400,
      srcSet: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316-sm.webp 600w, /assets/05 PHOTOS/Haldi-Mehandi/AKR03316-md.webp 1200w, /assets/05 PHOTOS/Haldi-Mehandi/AKR03316-lg.webp 2000w",
      sizes: "100vw"
    },
    {
      src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39266.webp",
      width: 1000,
      height: 667
    }
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [baseImageIndex, setBaseImageIndex] = useState(0);

  // Interval for Hero Background Slideshow (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex(prev => {
        const next = (prev + 1) % heroImages.length;
        setTimeout(() => {
          setBaseImageIndex(next);
        }, 1500);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="home-page-container">

      {/* 1. HERO SECTION WRAPPER WITH SHRINK ANIMATION */}
      <div className="hero-wrapper">
        <section className="hero-section" ref={heroSectionRef}>
          <div className="hero-slideshow-container">
            {heroImages.map((img, idx) => {
              const isActive = idx === heroImageIndex;
              const isBase = idx === baseImageIndex;
              return (
                <OptimizedImage
                  key={idx}
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={`Bespoke luxury event celebration ${idx + 1} by Taaffeite Events — luxury event planners in Bangalore`}
                  className={`hero-slide-img ${isActive ? 'active' : ''} ${isBase ? 'base' : ''}`}
                  eager={idx === 0}
                  containerStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  aspectRatio="unset"
                  srcSet={img.srcSet}
                  sizes={img.sizes}
                />
              );
            })}
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-quotes-container">
              {quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className={`hero-quote-slide ${idx === activeQuote ? 'active' : ''}`}
                >
                  "{quote.text}"
                  <span className="hero-quote-author">{quote.author}</span>
                </div>
              ))}
            </div>
            <Link to="/enquire" className="hero-enquire-btn">ENQUIRE WITH US</Link>
          </div>
        </section>
      </div>

      {/* FOUNDERS NOTE SHOWCASE SECTION */}
      <Suspense fallback={<div className="founders-showcase-placeholder" style={{ minHeight: isMobile ? '1000px' : '200vh', backgroundColor: 'var(--bg-cream)' }} />}>
        <FoundersShowcase
          ref={foundersShowcaseRef}
          isMobile={isMobile}
          activeFoundersSlide={activeFoundersSlide}
        />
      </Suspense>

      {/* SCHEDULE OF THE DAY & VERTICAL JOURNEY TIMELINE */}
      <Suspense fallback={<div style={{ minHeight: '600px', backgroundColor: 'var(--bg-cream)' }} />}>
        <JourneyTimeline />
      </Suspense>

      {/* STORY BEHIND OUR LOGO SECTION (SEPARATE SECTION) */}
      <Suspense fallback={<div style={{ minHeight: '600px', backgroundColor: 'var(--bg-cream)' }} />}>
        <LogoStorySection isMobile={isMobile} />
      </Suspense>

      {/* 2. SCROLL-LINKED ABOUT SECTION (3 PARTS) */}
      <Suspense fallback={<div className="about-showcase-placeholder" style={{ minHeight: isMobile ? '1600px' : '300vh', backgroundColor: 'var(--bg-cream)' }} />}>
        <AboutShowcase
          ref={aboutShowcaseRef}
          isMobile={isMobile}
          activeAboutSlide={activeAboutSlide}
        />
      </Suspense>

      {/* 4. A GLIMPSE INTO THE WORLD WE CREATE */}
      <Suspense fallback={<div className="glimpse-placeholder" style={{ minHeight: '800px', backgroundColor: 'var(--bg-cream)' }} />}>
        <Glimpse ref={glimpseRef} />
      </Suspense>

      {/* 8. CALL TO ACTION */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-container">
          <h2 className="cta-title reveal-scale reveal-slow">"Because rare stories deserve rare celebrations."</h2>
        </div>
      </section>

      {/* 7.5. QUICK ENQUIRY SECTION */}
      <Suspense fallback={<div className="enquiry-placeholder" style={{ minHeight: '600px', backgroundColor: 'var(--bg-cream)' }} />}>
        <QuickEnquiry ref={enquiryRef} />
      </Suspense>

    </div>
  );
};
