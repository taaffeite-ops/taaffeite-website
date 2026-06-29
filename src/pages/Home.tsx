import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

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

  // Tracks the current step index (0=hero, 1-3=founders, 4-6=about, 7=glimpse, 8=cta, 9=enquiry)
  const currentStepRef = useRef(0);

  // Wire scroll-reveal animations for the whole page
  useRevealAnimation();

  // Enable scroll snap class on document root for home page only
  useEffect(() => {
    // Scroll to the top of the page instantly before snap initializes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const timer = setTimeout(() => {
      document.documentElement.classList.add('has-scroll-snap');
    }, 150);

    return () => {
      document.documentElement.classList.remove('has-scroll-snap');
      clearTimeout(timer);
    };
  }, []);

  // Quick Enquiry Form States
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryPhoneFocused, setEnquiryPhoneFocused] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquiryData, setEnquiryData] = useState({
    fullName: '',
    email: '',
    phone: '',
    proposedDate: '',
    celebrationType: 'Wedding Planning',
    guestCount: '',
    location: ''
  });
  const [enquiryOtherDetail, setEnquiryOtherDetail] = useState('');

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const keyMap: Record<string, string> = {
      'quick-name': 'fullName',
      'quick-email': 'email',
      'quick-phone': 'phone',
      'quick-date': 'proposedDate',
      'quick-type': 'celebrationType',
      'quick-guests': 'guestCount',
      'quick-location': 'location'
    };

    const field = keyMap[id];
    if (field) {
      if (field === 'phone') {
        let digits = value.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
          digits = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
          digits = digits.slice(1);
        }
        digits = digits.slice(0, 10);
        setEnquiryData(prev => ({ ...prev, [field]: digits }));
      } else {
        setEnquiryData(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    setEnquiryError(null);

    const { fullName, email, phone, proposedDate, celebrationType, guestCount, location } = enquiryData;
    if (!fullName || !email || !phone || !proposedDate || !celebrationType || !guestCount || !location) {
      setEnquiryError('Please fill in all required fields.');
      setEnquirySubmitting(false);
      return;
    }

    if (celebrationType === 'Other' && !enquiryOtherDetail.trim()) {
      setEnquiryError('Please specify your celebration type.');
      setEnquirySubmitting(false);
      return;
    }

    if (phone.length !== 10) {
      setEnquiryError('Please enter a valid 10-digit phone number.');
      setEnquirySubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          phone: `+91 ${phone}`,
          proposedDate,
          celebrationType: celebrationType === 'Other' ? `Other: ${enquiryOtherDetail}` : celebrationType,
          guestCount: Number(guestCount),
          location
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      setEnquirySubmitted(true);
    } catch (err: any) {
      console.error('Error submitting enquiry form:', err);
      setEnquiryError(err.message || 'Failed to submit form. Please check your connection and try again.');
    } finally {
      setEnquirySubmitting(false);
    }
  };



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

  // Full-page wheel/touch interceptor — every scroll advances exactly one step.
  // Steps: 0=hero | 1-3=founders slides | 4-6=about slides | 7=glimpse | 8=cta | 9=enquiry | 10=footer
  useEffect(() => {
    const TOTAL_STEPS = 11;
    const THROTTLE_MS = 1000;
    const lastAdvance = { current: 0 };
    let touchStartY = 0;

    // Compute the scroll target Y for a given step.
    const getScrollTarget = (step: number): number => {
      const vh = window.innerHeight;
      const fContainer = foundersShowcaseRef.current;
      const aContainer = aboutShowcaseRef.current;
      if (!fContainer || !aContainer) return 0;

      const fTop = fContainer.offsetTop;
      const aTop = aContainer.offsetTop;

      if (step === 0) return 0;
      if (step >= 1 && step <= 3) return fTop + (step - 1) * vh;
      if (step >= 4 && step <= 6) return aTop + (step - 4) * vh;
      if (step === 7) return glimpseRef.current?.offsetTop ?? aTop + 3 * vh;
      if (step === 8) return ctaRef.current?.offsetTop ?? 0;
      if (step === 9) return enquiryRef.current?.offsetTop ?? 0;
      if (step === 10) return 99999;
      return 0;
    };

    const navigateTo = (step: number) => {
      const now = Date.now();
      if (now - lastAdvance.current < THROTTLE_MS) return;
      if (step < 0 || step >= TOTAL_STEPS) return;

      lastAdvance.current = now;
      currentStepRef.current = step;

      // Update showcase slide states
      if (step >= 1 && step <= 3) {
        setActiveFoundersSlide(step - 1);
      } else if (step >= 4 && step <= 6) {
        setActiveAboutSlide(step - 4);
      }

      // Temporarily remove snap scroll during programmatic smooth scrollTo transition
      document.documentElement.classList.remove('has-scroll-snap');

      window.scrollTo({ top: getScrollTarget(step), behavior: 'smooth' });

      // Re-enable snap scroll after the 1000ms transition finishes
      setTimeout(() => {
        if (currentStepRef.current === step) {
          document.documentElement.classList.add('has-scroll-snap');
        }
      }, 1000);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      navigateTo(currentStepRef.current + direction);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;
      navigateTo(currentStepRef.current + (delta > 0 ? 1 : -1));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);



  const marqueeImages = [
    {
      src: "/assets/05 PHOTOS/Weddings/AKR05567.webp",
      alt: "Floral Mandap styling detail",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.webp",
      alt: "Luxury guest welcome hampers",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Reception/WEVA1312 2.webp",
      alt: "Luxury reception table setting detail",
      width: 3651,
      height: 5477
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR07499.webp",
      alt: "Elegant wedding ceremony mandap",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02772.webp",
      alt: "Vibrant Haldi celebration setup",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Weddings/AKR05590.webp",
      alt: "Elegant wedding floral arch details",
      width: 2400,
      height: 3600
    },
    {
      src: "/assets/05 PHOTOS/Reception/WEVA1313 2.webp",
      alt: "Bespoke dinner banquet design",
      width: 4000,
      height: 2666
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03432.webp",
      alt: "Exotic floral canopy styling",
      width: 2400,
      height: 3600
    }
  ];

  // Hero Background Images Slideshow
  const heroImages = [
    {
      src: "/assets/05 PHOTOS/Proposal/0039-lg.webp",
      width: 4671,
      height: 7006,
      srcSet: "/assets/05 PHOTOS/Proposal/0039-sm.webp 600w, /assets/05 PHOTOS/Proposal/0039-md.webp 1200w, /assets/05 PHOTOS/Proposal/0039-lg.webp 2000w",
      sizes: "100vw"
    },
    {
      src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316-lg.webp",
      width: 3600,
      height: 2400,
      srcSet: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316-sm.webp 600w, /assets/05 PHOTOS/Haldi-Mehandi/AKR03316-md.webp 1200w, /assets/05 PHOTOS/Haldi-Mehandi/AKR03316-lg.webp 2000w",
      sizes: "100vw"
    },
    { src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39266.webp", width: 4608, height: 3072 },
    { src: "/assets/05 PHOTOS/Weddings/AKR07379.webp", width: 3600, height: 2400 }
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Interval for Hero Background Slideshow (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);



  const scale = 1 - scrollProgress * 0.18;
  const heroStyle = {
    transform: `scale(${scale})`,
    borderRadius: `${scrollProgress * 40}px`
  };

  return (
    <div className="home-page-container">


      {/* 1. HERO SECTION WRAPPER WITH SHRINK ANIMATION */}
      <div className="hero-wrapper">
        <section className="hero-section" style={heroStyle}>
          <div className="hero-slideshow-container">
            {heroImages.map((img, idx) => (
              <OptimizedImage
                key={idx}
                src={img.src}
                width={img.width}
                height={img.height}
                alt={`Luxury Celebration ${idx + 1}`}
                className={`hero-slide-img ${idx === heroImageIndex ? 'active' : ''}`}
                eager={idx === 0}
                containerStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                aspectRatio="unset"
                srcSet={img.srcSet}
                sizes={img.sizes}
              />
            ))}
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-brand-logo-top-left">
            <OptimizedImage
              src="/assets/images/logo.webp"
              alt="Taaffeite Events"
              width={150}
              height={150}
              eager={true}
              objectFit="contain"
              containerStyle={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
            />
          </div>
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
            <Link to="/enquire" className="hero-enquire-btn">Enquire With Us</Link>
          </div>
        </section>
      </div>

      {/* FOUNDERS NOTE SHOWCASE SECTION */}
      <div className="founders-showcase-container" id="founders-showcase" ref={foundersShowcaseRef}>
        <div className="showcase-snap-point"></div>
        <div className="showcase-snap-point"></div>
        <div className="showcase-snap-point"></div>
        <div className="founders-showcase-sticky">

          {/* Slide 0: Why Taaffeite Title Entry */}
          <div className={`founders-showcase-slide ${activeFoundersSlide === 0 ? 'active' : ''} ${activeFoundersSlide > 0 ? 'exited' : ''}`} id="founders-slide-0">
            <section className="founders-title-section">
              <div className="founders-title-card-content">
                <h1 className="founders-large-title">
                  Why <span>Taaffeite?</span>
                </h1>
              </div>
            </section>
          </div>

          {/* Slide 1: Founder's Note */}
          <div className={`founders-showcase-slide ${activeFoundersSlide === 1 ? 'active' : ''}`} id="founders-slide-1">
            <section className="founders-note-section">
              <div className="founders-note-container has-bg-image">
                {/* Background Image wrapper */}
                <div className="founders-note-bg-image">
                  <OptimizedImage
                    src="/assets/images/founders3.webp"
                    srcSet="/assets/images/founders3-sm.webp 600w, /assets/images/founders3-lg.jpg 1200w"
                    sizes="(max-width: 600px) 100vw, 1200px"
                    alt="Anya Daisy Vergis & Sipporah - Founders of Taaffeite Events"
                    width={1200}
                    height={800}
                    aspectRatio="unset"
                    containerStyle={{ width: '100%', height: '100%' }}
                    style={{ objectPosition: '30% 50%' }}
                  />
                </div>
                <div className="founders-note-bg-overlay"></div>

                {/* Text Content */}
                <div className="founders-note-content-wrapper">
                  <div className="founders-note-header">
                    <h2 className="founders-note-title">Why <span>Taaffeite?</span></h2>
                    <div className="founders-note-divider"></div>
                  </div>

                  <div className="founders-note-content">
                    <div className="founders-note-body">
                      <center><p>
                        "People often ask why we chose the name Taaffeite.
                        It's one of my favourite questions."
                      </p></center>
                      <p>
                        When Sipporah and I began building this company, we weren't searching for a name that sounded beautiful. We were searching for one that reflected what we believed.
                      </p>
                      <p>
                        That's when we found Taaffeite, one of the rarest gemstones in the world. For years, it was mistaken for something else until someone looked a little closer and recognised its true rarity. That felt deeply familiar. Because every couple, every family, and every story deserves to be seen that way. That's the heart of Taaffeite. Not simply planning weddings, but honouring the people at the centre of them. The moment you walk through our doors, you stop being a client. You become family. And every beautiful celebration begins the same way. With your story.
                      </p>
                    </div>
                  </div>

                  <div className="founders-note-signature-container">
                    <span className="founders-note-signature">Anya Daisy Vergis</span>
                    <span className="founders-note-designation">Founder, Taaffeite Events</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Slide 2: Why Taaffeite — Brand Pillars */}
          <div className={`founders-showcase-slide ${activeFoundersSlide === 2 ? 'active' : ''}`} id="founders-slide-2">
            <section className="founders-grid-section">
              <div className="founders-pillars-container">
                <div className="founders-pillars-header">
                  <h2 className="founders-pillars-title">Story Behind Our <span>Logo</span></h2>
                  <div className="founders-pillars-divider"></div>
                </div>

                <div className="founders-trio-row">
                  <div className="founders-trio-card founders-trio-img--1">
                    <div className="founders-trio-img-wrapper">
                      <OptimizedImage
                        src="/assets/images/1.webp"
                        alt="Warm Celebrations"
                        width={2400}
                        height={3600}
                        aspectRatio="unset"
                        containerStyle={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="founders-trio-card founders-trio-img--2">
                    <div className="founders-trio-img-wrapper">
                      <OptimizedImage
                        src="/assets/images/2.webp"
                        alt="Minimal Styling"
                        width={2400}
                        height={3600}
                        aspectRatio="unset"
                        containerStyle={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="founders-trio-card founders-trio-img--3">
                    <div className="founders-trio-img-wrapper">
                      <OptimizedImage
                        src="/assets/images/3.webp"
                        alt="Elegant Design"
                        width={2400}
                        height={3600}
                        aspectRatio="unset"
                        containerStyle={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>

      {/* 2. SCROLL-LINKED ABOUT SECTION (3 PARTS) */}
      <div className="about-showcase-container" id="about-showcase" ref={aboutShowcaseRef}>
        <div className="showcase-snap-point"></div>
        <div className="showcase-snap-point"></div>
        <div className="showcase-snap-point"></div>
        <div className="about-showcase-sticky">

          {/* Slide 1 */}
          <div className={`about-showcase-slide ${activeAboutSlide === 0 ? 'active' : ''}`} id="about-slide-0">
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <h3 className="about-showcase-title">It Starts With Your Story</h3>
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  Every celebration begins with people, not plans.Before we think about colours, venues, or timelines, we take time to understand who you are, what matters to your family, and the moments you want to remember years from now. Every decision we make grows from your story, your traditions, and your vision, creating a celebration that feels deeply personal from beginning to end.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <OptimizedImage
                  src="/assets/05 PHOTOS/Weddings/AKR05567.webp"
                  alt="Taaffeite Beliefs & Proposal Setup"
                  className="about-showcase-image"
                  width={2400}
                  height={3600}
                  aspectRatio="unset"
                />
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className={`about-showcase-slide ${activeAboutSlide === 1 ? 'active' : ''}`} id="about-slide-1">
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <h3 className="about-showcase-title">Inspired by Rarity</h3>
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  Taaffeite is one of the rarest gemstones in the world, and that belief shapes everything we create. We have never believed in celebrations that look copied or predictable. Every couple, every family, and every story deserves something uniquely their own. That is why we approach every event with fresh ideas, thoughtful design, and an unwavering attention to detail, creating experiences that feel timeless rather than trendy.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <OptimizedImage
                  src="/assets/05 PHOTOS/Weddings/Sanhita & Benny-317 2.webp"
                  alt="Taaffeite Luxury Wedding Ceremony Setup"
                  className="about-showcase-image"
                  width={4631}
                  height={6946}
                  aspectRatio="unset"
                />
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className={`about-showcase-slide ${activeAboutSlide === 2 ? 'active' : ''}`} id="about-slide-2">
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <h3 className="about-showcase-title">Designed So You Can Be Present</h3>
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  The most memorable celebrations are the ones where you never have to think about what comes next. While you enjoy every conversation, embrace every loved one, and live every moment, we quietly manage everything behind the scenes. From planning and coordination to the smallest finishing touches, every detail is carefully orchestrated so your celebration unfolds effortlessly, exactly as it should.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <OptimizedImage
                  src="/assets/05 PHOTOS/Reception/Weva1701.webp"
                  alt="Taaffeite Luxury Reception Design"
                  className="about-showcase-image"
                  width={3645}
                  height={5467}
                  aspectRatio="unset"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. A GLIMPSE INTO THE WORLD WE CREATE */}
      <section className="glimpse-section" ref={glimpseRef}>
        <div className="glimpse-container">
          <div className="glimpse-text-wrapper reveal-up reveal-slow">
            <span className="glimpse-sub-label">A Glimpse Into</span>
            <h2 className="glimpse-title">The World We Create</h2>
            <div className="glimpse-divider"></div>
            <p className="glimpse-desc">
              Every celebration you see here began with a simple question...<br></br>

              "Can we trust you with one of the most important days of our lives?"<br></br>

              Our answer will always be the same. Through our work.
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




      {/* 8. CALL TO ACTION */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-container">
          <h2 className="cta-title reveal-scale reveal-slow">"Because rare stories deserve rare celebrations."</h2>
        </div>
      </section>

      {/* 7.5. QUICK ENQUIRY SECTION */}
      <section className="quick-enquiry-section" ref={enquiryRef}>
        <div className="quick-enquiry-container">
          <div className="quick-enquiry-header reveal-up">
            <span className="intro-title">Quick Enquiry</span>
            <h2>Tell Us About Your Celebration</h2>
            <p>Share the initial details of your vision, and we will get back to you within 24 hours.</p>
          </div>

          {!enquirySubmitted ? (
            <form className="quick-enquiry-form reveal-fade" onSubmit={handleEnquirySubmit}>
              {enquiryError && (
                <div className="quick-enquiry-error">
                  <span>⚠️</span> {enquiryError}
                </div>
              )}

              {/* Row 1: Name and Email */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="quick-name">Your Full Name *</label>
                  <input
                    type="text"
                    id="quick-name"
                    required
                    disabled={enquirySubmitting}
                    placeholder="e.g. Eleanor Vance"
                    value={enquiryData.fullName}
                    onChange={handleEnquiryChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quick-email">Email Address *</label>
                  <input
                    type="email"
                    id="quick-email"
                    required
                    disabled={enquirySubmitting}
                    placeholder="e.g. eleanor@example.com"
                    value={enquiryData.email}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              {/* Row 2: Phone and Proposed Date */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="quick-phone">Phone / WhatsApp Number *</label>
                  <div className={`phone-input-wrapper ${enquiryPhoneFocused ? 'focused' : ''}`}>
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      id="quick-phone"
                      required
                      disabled={enquirySubmitting}
                      placeholder="98765 43210"
                      value={enquiryData.phone}
                      onChange={handleEnquiryChange}
                      onFocus={() => setEnquiryPhoneFocused(true)}
                      onBlur={() => setEnquiryPhoneFocused(false)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="quick-date">Proposed Date *</label>
                  <input
                    type="date"
                    id="quick-date"
                    required
                    disabled={enquirySubmitting}
                    value={enquiryData.proposedDate}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              {/* Row 3: Celebration Type and Guest Count */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="quick-type">Celebration Type *</label>
                  <select
                    id="quick-type"
                    required
                    disabled={enquirySubmitting}
                    value={enquiryData.celebrationType}
                    onChange={handleEnquiryChange}
                  >
                    <option value="Wedding Planning">Wedding Celebration</option>
                    <option value="Pre-Wedding Celebration">Pre-Wedding (Sangeet, Haldi, Mehendi)</option>
                    <option value="Milestone Birthday">Milestone Birthday / Party</option>
                    <option value="Bespoke Private Event">Bespoke Private Event</option>
                    <option value="Destination Celebration">Destination Wedding / Celebration</option>
                    <option value="Other">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quick-guests">Estimated Guest Count *</label>
                  <input
                    type="number"
                    id="quick-guests"
                    required
                    disabled={enquirySubmitting}
                    min="1"
                    placeholder="e.g. 150"
                    value={enquiryData.guestCount}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              {/* Row 4: Specify Celebration Type (Conditional) */}
              <div className={`conditional-form-row ${enquiryData.celebrationType === 'Other' ? 'show' : ''}`}>
                <div className="form-group">
                  <label htmlFor="quick-other-detail">Specify Celebration Type *</label>
                  <input
                    type="text"
                    id="quick-other-detail"
                    required={enquiryData.celebrationType === 'Other'}
                    disabled={enquirySubmitting}
                    placeholder="e.g. Corporate Anniversary Gala, Proposal, Baby Shower"
                    value={enquiryOtherDetail}
                    onChange={(e) => setEnquiryOtherDetail(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 5: Proposed Location */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quick-location">Proposed Location / City *</label>
                  <input
                    type="text"
                    id="quick-location"
                    required
                    disabled={enquirySubmitting}
                    placeholder="e.g. Bangalore, India"
                    value={enquiryData.location}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-form-submit" disabled={enquirySubmitting}>
                {enquirySubmitting ? 'Sending Request...' : 'Send Inquiry'}
              </button>
            </form>
          ) : (
            <div className="quick-enquiry-success">
              <h3>Thank You, {enquiryData.fullName}</h3>
              <p>
                Your inquiry for the <strong>{enquiryData.celebrationType === 'Other' ? enquiryOtherDetail : enquiryData.celebrationType}</strong> on <strong>{enquiryData.proposedDate}</strong> has been received successfully.
                Our luxury planning directors will connect with you via email or WhatsApp within 24 hours.
              </p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
};
