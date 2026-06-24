import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {


  // 2. Hero Symmetrical Scroll-Linked Shrink Animation Progress
  const [scrollProgress, setScrollProgress] = useState(0);

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
  const lastSlideTransitionTime = useRef<number>(0);
  const aboutShowcaseRef = useRef<HTMLDivElement>(null);

  const setActiveAboutSlide = (val: number) => {
    activeAboutSlideRef.current = val;
    _setActiveAboutSlide(val);
  };

  const requestSlideTransition = (targetSlide: number) => {
    const now = Date.now();
    // Enforce 1300ms transition time to let the 1.2s smooth CSS transition complete
    if (now - lastSlideTransitionTime.current < 1300) {
      return false;
    }

    const currentSlide = activeAboutSlideRef.current;
    if (targetSlide === currentSlide) {
      return false;
    }

    // Force strictly one-by-one transitions!
    let nextSlide = currentSlide;
    if (targetSlide > currentSlide) {
      nextSlide = currentSlide + 1;
    } else {
      nextSlide = currentSlide - 1;
    }

    lastSlideTransitionTime.current = now;
    setActiveAboutSlide(nextSlide);
    return true;
  };

  // 5. Accordion expand/collapse state
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);



  // Hero Section Symmetrical Shrink on Scroll
  useEffect(() => {
    const handleHeroScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleHeroScroll, { passive: true });
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

  // Stacked About Showcase Scroll Link Logic
  useEffect(() => {
    const handleAboutScroll = () => {
      if (window.innerWidth < 992) {
        return;
      }
      if (aboutShowcaseRef.current) {
        const rect = aboutShowcaseRef.current.getBoundingClientRect();
        const containerHeight = rect.height;
        const scrolledIntoContainer = -rect.top;
        const totalScrollableHeight = containerHeight - window.innerHeight;

        if (totalScrollableHeight <= 0) return;

        const progress = Math.max(0, Math.min(scrolledIntoContainer / totalScrollableHeight, 1));

        let calculatedSlide = 0;
        if (progress < 0.33) {
          calculatedSlide = 0;
        } else if (progress < 0.66) {
          calculatedSlide = 1;
        } else {
          calculatedSlide = 2;
        }

        if (calculatedSlide !== activeAboutSlideRef.current) {
          requestSlideTransition(calculatedSlide);
        }
      }
    };

    window.addEventListener('scroll', handleAboutScroll, { passive: true });
    window.addEventListener('resize', handleAboutScroll);
    return () => {
      window.removeEventListener('scroll', handleAboutScroll);
      window.removeEventListener('resize', handleAboutScroll);
    };
  }, []);

  // Wheel-based scroll snapping logic for about showcase section
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 992) {
        return;
      }

      const container = aboutShowcaseRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isSticky = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (!isSticky) return;

      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) return;

      const currentSlide = activeAboutSlideRef.current;

      let targetSlide = currentSlide;
      if (e.deltaY > 0) {
        if (currentSlide < 2) targetSlide = currentSlide + 1;
      } else if (e.deltaY < 0) {
        if (currentSlide > 0) targetSlide = currentSlide - 1;
      }

      if (targetSlide !== currentSlide) {
        e.preventDefault();

        const didTransition = requestSlideTransition(targetSlide);
        if (didTransition) {
          const containerPageTop = window.scrollY + rect.top;
          const targetScrollY = containerPageTop + (targetSlide * totalScrollableHeight / 2);

          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Accordion list details
  const accordionItems = [
    {
      title: "Dedicated & Resolute",
      content: "We pride ourselves on unwavering loyalty, complete discretion, and a calm, commanding presence amidst the complex planning processes. Our team maintains a steady hand, shielding you from operational friction so the planning experience remains as beautiful as the day itself."
    },
    {
      title: "Adept & Knowledgeable",
      content: "Drawing from deep expertise in multi-cultural wedding traditions, intricate etiquette guidelines, and complex logistical networks, we execute events with precision. We know the rules, we know the vendors, and we know how to blend standard schedules into high-art experiences."
    },
    {
      title: "Engaged & Thoughtful",
      content: "Anticipating needs before they surface, arranging personalized hospitality desks, and managing seamless RSVP flows. We design experiences around your guests, making sure every contact point feels curated, warm, and highly personal."
    },
    {
      title: "Subtle & Discreet",
      content: "We believe true luxury doesn't yell; it whispers. Our team works discreetly behind the scenes, ensuring the logistics slide into place invisibly. We coordinate every vendor and manage every timeline in a way that feels organic and effortless, letting the final production speak for itself."
    }
  ];

  const marqueeImages = [
    {
      src: "/assets/05 PHOTOS/Weddings/AKR05567.jpg",
      alt: "Floral Mandap styling detail",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.jpg",
      alt: "Luxury guest welcome hampers",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Reception/WEVA1312 2.jpeg",
      alt: "Luxury reception table setting detail",
      width: 3651,
      height: 5477
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR07499.jpg",
      alt: "Elegant wedding ceremony mandap",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02772.jpg",
      alt: "Vibrant Haldi celebration setup",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR05590.jpg",
      alt: "Elegant wedding floral arch details",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Reception/WEVA1313 2.jpeg",
      alt: "Bespoke dinner banquet design",
      width: 4000,
      height: 2666
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03432.jpg",
      alt: "Exotic floral canopy styling",
      width: 2400,
      height: 3600
    }
  ];

  // Hero Background Images Slideshow
  const heroImages = [
    { src: "/assets/05 PHOTOS/Proposal/0039.JPG", width: 4671, height: 7006 },
    { src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.jpg", width: 3600, height: 2400 },
    { src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39266.jpg", width: 4608, height: 3072 },
    { src: "/assets/05 PHOTOS/Weddings/AKR07379.jpg", width: 3600, height: 2400 }
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Interval for Hero Background Slideshow (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAccordionClick = (index: number) => {
    setActiveAccordion(prev => (prev === index ? null : index));
  };

  const heroStyle = {
    width: `${100 - scrollProgress * 18}%`,
    height: `${100 - scrollProgress * 18}vh`,
    borderRadius: `${scrollProgress * 40}px`
  };

  return (
    <div className="home-page-container">


      {/* 1. HERO SECTION WRAPPER WITH SHRINK ANIMATION */}
      <div className="hero-wrapper">
        <section className="hero-section" style={heroStyle}>
          <div className="hero-slideshow-container">
            {heroImages.map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                width={img.width}
                height={img.height}
                alt={`Luxury Celebration ${idx + 1}`}
                className={`hero-slide-img ${idx === heroImageIndex ? 'active' : ''}`}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "low"}
                decoding="async"
              />
            ))}
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="glass-title-container">
              <h1 className="hero-brand-title">TAAFFEITE EVENTS</h1>
            </div>
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
            <Link to="/enquire" className="hero-enquire-btn">Enquire With Us</Link>
          </div>
        </section>
      </div>

      {/* 2. SCROLL-LINKED ABOUT SECTION (3 PARTS) */}
      <div className="about-showcase-container" id="about-showcase" ref={aboutShowcaseRef}>
        <div className="about-showcase-sticky">
          {/* Static Title Header */}
          <div className="about-static-title-container">
            <h2 className="about-static-title">Our Essence</h2>
          </div>

          {/* Slide 1 */}
          <div className={`about-showcase-slide ${activeAboutSlide === 0 ? 'active' : ''}`} id="about-slide-0">
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  Taaffeite was built on the belief that every celebration should feel personal, meaningful, and true to the people it brings together. We believe the most memorable weddings are not created through excess, but through thoughtful details and genuine moments. Every event begins with understanding your story, your style, and what matters most to you.<br></br> From intimate gatherings to grand celebrations, our focus remains the same: creating experiences that feel effortless, heartfelt, and unforgettable. We take pride in crafting events that allow you to be fully present, knowing every detail has been carefully considered and beautifully executed.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <img
                  src="/assets/05 PHOTOS/Weddings/AKR05567.jpg"
                  alt="Taaffeite Beliefs & Proposal Setup"
                  className="about-showcase-image"
                  width={2400}
                  height={3600}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className={`about-showcase-slide ${activeAboutSlide === 1 ? 'active' : ''}`} id="about-slide-1">
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  Named after one of the rarest gemstones in the world, Taaffeite represents individuality, rarity, and timeless beauty. These qualities inspire the way we approach every celebration we design. No two weddings are alike, and we believe every couple deserves an experience that reflects their unique journey. We work closely with families and couples to create spaces that feel welcoming, elegant, and deeply personal. <br></br>By combining thoughtful planning, refined aesthetics, and seamless coordination, we transform ideas into celebrations that feel authentic, memorable, and effortlessly beautiful from beginning to end.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <img
                  src="/assets/05 PHOTOS/Weddings/Sanhita & Benny-317 2.jpg"
                  alt="Taaffeite Luxury Wedding Ceremony Setup"
                  className="about-showcase-image"
                  width={4631}
                  height={6946}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className={`about-showcase-slide ${activeAboutSlide === 2 ? 'active' : ''}`} id="about-slide-2">
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  For us, luxury is not about doing more, it is about doing everything with intention. It is found in the details that guests may not notice but will always feel. From the flow of an event to the atmosphere of every space, we focus on creating experiences that are smooth, meaningful, and memorable.<br></br> Our goal is to remove the stress from planning so you can enjoy every moment with the people who matter most. At Taaffeite, we create celebrations that feel natural, elegant, and timeless moments that stay with you long after the event is over.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <img
                  src="/assets/05 PHOTOS/Reception/Weva1701.jpeg"
                  alt="Taaffeite Luxury Reception Design"
                  className="about-showcase-image"
                  width={3645}
                  height={5467}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. A GLIMPSE INTO THE WORLD WE CREATE */}
      <section className="glimpse-section reveal-on-scroll">
        <div className="glimpse-container">
          <div className="glimpse-text-wrapper">
            <span className="glimpse-sub-label">A Glimpse Into</span>
            <h2 className="glimpse-title">The World We Create</h2>
            <div className="glimpse-divider"></div>
            <p className="glimpse-desc">
              From intimate gatherings shared among close family and friends to grand, multi-day celebrations filled with unforgettable moments, every event we create is thoughtfully designed to reflect the people at the heart of it. We believe that no two stories are ever the same, which is why every celebration we plan is approached with care, creativity, and a deep understanding of what matters most to our clients. From the first spark of an idea to the final farewell, we curate experiences that feel personal, meaningful, and effortlessly beautiful.
              Each photograph in this collection represents more than a perfectly styled event—it captures emotions, connections, traditions, and memories that will be cherished for years to come. These are the moments that remind us why we do what we do, and the celebrations we have been honoured to bring to life.
            </p>
          </div>

          {/* Curated infinite marquee image slider */}
          <div className="glimpse-marquee-container">
            <div className="glimpse-marquee-track">
              {/* First Set */}
              {marqueeImages.map((img, idx) => (
                <div key={`set1-${idx}`} className="glimpse-marquee-card">
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
              {/* Duplicate Set for infinite looping */}
              {marqueeImages.map((img, idx) => (
                <div key={`set2-${idx}`} className="glimpse-marquee-card" aria-hidden="true">
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glimpse-action">
            <Link to="/media" className="btn-editorial">View Full Media Gallery</Link>
          </div>
        </div>
      </section>


      {/* 6. PHILOSOPHY & MISSION */}
      <section className="philosophy-section reveal-on-scroll">
        <div className="philosophy-container">
          <span className="intro-title">Philosophy & Mission</span>
          <h2 className="philosophy-essence">"Because rare stories deserve rare celebrations."</h2>

          <div className="philosophy-grid">
            <div className="philosophy-card">
              <h3>The Philosophy</h3>
              <p>At Taaffeite, we believe the most meaningful celebrations are the ones that feel personal. Not overly staged or overwhelming, but honest, warm, and deeply reflective of the people at the heart of them. We approach every wedding and event with intention, creating spaces, experiences, and moments that feel natural, elegant, and emotionally connected.</p>
            </div>
            <div className="philosophy-card">
              <h3>The Mission</h3>
              <p>To create thoughtful and beautifully executed celebrations that feel deeply personal, seamless, and memorable for every couple, family, and guest. We handle the heavy lifting, allowing you to immerse yourselves fully in the magic of your day, while every detail unfolds with purpose, elegance, and effortless grace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THE EXPERIENCE (ACCORDION SECTION) */}
      <section className="experience-section reveal-on-scroll">
        <div className="experience-container">
          <div className="experience-header">
            <h2>The Experience</h2>
            <p>How we plan and execute luxury</p>
          </div>

          <div className="accordion-group">
            {accordionItems.map((item, index) => (
              <div
                key={index}
                className={`accordion-item ${activeAccordion === index ? 'active' : ''}`}
              >
                <button
                  className="accordion-trigger"
                  onClick={() => handleAccordionClick(index)}
                  aria-expanded={activeAccordion === index ? 'true' : 'false'}
                >
                  <span className="accordion-title">{item.title}</span>
                  <span className="accordion-icon" aria-hidden="true"></span>
                </button>
                <div className="accordion-content">
                  <p className="accordion-text">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="cta-section reveal-on-scroll">
        <div className="cta-container">
          <h2 className="cta-title">Rare stories deserve rare celebrations.</h2>
          <Link to="/enquire" className="btn-luxury">Enquire with us</Link>
        </div>
      </section>
    </div>
  );
};
