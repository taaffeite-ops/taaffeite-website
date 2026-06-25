import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';

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

  // Note: Custom wheel-based scroll snapping listener has been removed to restore passive native scrolling and eliminate scroll-hijacking & thread blocking warnings.

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
    { src: "/assets/05 PHOTOS/Proposal/0039.webp", width: 4671, height: 7006 },
    { src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp", width: 3600, height: 2400 },
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

  const handleAccordionClick = (index: number) => {
    setActiveAccordion(prev => (prev === index ? null : index));
  };

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
              />
            ))}
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <OptimizedImage
              src="/assets/images/logo.png"
              alt="Taaffeite Events"
              className="hero-brand-logo"
              width={180}
              height={180}
              eager={true}
              objectFit="contain"
              containerStyle={{ width: '180px', height: '180px', marginTop: '-180px', marginBottom: '20px', backgroundColor: 'transparent' }}
            />
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
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  Named after one of the rarest gemstones in the world, Taaffeite represents individuality, rarity, and timeless beauty. These qualities inspire the way we approach every celebration we design. No two weddings are alike, and we believe every couple deserves an experience that reflects their unique journey. We work closely with families and couples to create spaces that feel welcoming, elegant, and deeply personal. <br></br>By combining thoughtful planning, refined aesthetics, and seamless coordination, we transform ideas into celebrations that feel authentic, memorable, and effortlessly beautiful from beginning to end.
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
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  For us, luxury is not about doing more, it is about doing everything with intention. It is found in the details that guests may not notice but will always feel. From the flow of an event to the atmosphere of every space, we focus on creating experiences that are smooth, meaningful, and memorable.<br></br> Our goal is to remove the stress from planning so you can enjoy every moment with the people who matter most. At Taaffeite, we create celebrations that feel natural, elegant, and timeless moments that stay with you long after the event is over.
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

      {/* 7.5. QUICK ENQUIRY SECTION */}
      <section className="quick-enquiry-section reveal-on-scroll">
        <div className="quick-enquiry-container">
          <div className="quick-enquiry-header">
            <span className="intro-title">Quick Enquiry</span>
            <h2>Tell Us About Your Celebration</h2>
            <p>Share the initial details of your vision, and we will get back to you within 24 hours.</p>
          </div>

          {!enquirySubmitted ? (
            <form className="quick-enquiry-form" onSubmit={handleEnquirySubmit}>
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
