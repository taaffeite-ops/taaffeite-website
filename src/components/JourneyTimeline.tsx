import React, { useEffect, useState, useRef } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

export const JourneyTimeline: React.FC = () => {
  useRevealAnimation();
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fillLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      if (!containerRef.current || !fillLineRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Scroll trigger bounds: line fills as container travels through viewport
      const focalPoint = windowHeight * 0.65;
      const totalDistance = rect.height;
      const scrolled = focalPoint - rect.top;

      const progress = Math.max(0, Math.min(1, scrolled / totalDistance));

      // GPU hardware-accelerated transform scaling (instant 60fps response)
      fillLineRef.current.style.transform = `translateX(-50%) scaleY(${progress})`;

      // Update active milestone nodes & number badges
      const currentActiveIndex = Math.floor(progress * 5.2);
      setActiveStepIndex(currentActiveIndex);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const journeySteps = [
    {
      stepNumber: '01',
      title: 'Discovery',
      description: 'We listen. Your vision, your story, your dreams we understand every detail before we begin.',
      image: '/assets/05 PHOTOS/Haldi-Mehandi/AKR03875.webp',
      alt: 'Discovery step - understanding vision'
    },
    {
      stepNumber: '02',
      title: 'Planning',
      description: 'Meticulous planning timelines, vendors, budgets all curated to bring your concept to life.',
      image: '/assets/05 PHOTOS/Haldi-Mehandi/AKR02762.webp',
      alt: 'Planning step - curated concepts'
    },
    {
      stepNumber: '03',
      title: 'Design',
      description: 'Bespoke aesthetics moodboards, decor concepts, florals, lighting designed just for you.',
      image: '/assets/05 PHOTOS/Reception/WEVA1313 2.webp',
      alt: 'Design step - bespoke decor aesthetics'
    },
    {
      stepNumber: '04',
      title: 'Coordination',
      description: 'On-day management so you can be fully present every detail handled with precision and grace.',
      image: '/assets/05 PHOTOS/Proposal/0044.webp',
      alt: 'Coordination step - seamless on-day management'
    },
    {
      stepNumber: '05',
      title: 'Celebration',
      description: 'The moment arrives unforgettable, emotional, beautiful. Exactly as you imagined, and more.',
      image: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39266.webp',
      alt: 'Celebration step - unforgettable moments'
    }
  ];

  return (
    <section className="timeline-master-section">
      <div className="journey-timeline-container">
        {/* HOW WE WORK TOP LABEL */}
        <span className="glimpse-sub-label reveal-up">HOW WE WORK</span>

        {/* MAIN TITLE: Your journey to the perfect celebration */}
        <h2 className="journey-main-title reveal-up">
          Your journey to<br />the <span>perfect</span> celebration
        </h2>

        {/* VERTICAL TIMELINE WITH ANIMATED FILL LINE */}
        <div className="timeline-vertical-wrapper" ref={containerRef}>
          {/* Base background line */}
          <div className="timeline-center-line"></div>
          {/* Animated golden fill line (GPU scaleY) */}
          <div
            className="timeline-center-fill-line"
            ref={fillLineRef}
          ></div>

          {journeySteps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isPassed = index <= activeStepIndex;

            return (
              <div key={index} className={`timeline-card-row ${isEven ? 'row-left' : 'row-right'} ${isPassed ? 'step-active' : ''}`}>

                {/* DESKTOP LEFT SIDE CONTAINER */}
                <div className="timeline-side-col col-left desktop-only">
                  {isEven ? (
                    <div className="timeline-text-block">
                      <div className={`timeline-step-badge ${isPassed ? 'badge-filled' : ''}`}>
                        {step.stepNumber}
                      </div>
                      <h3 className="timeline-item-title">{step.title}</h3>
                      <p className="timeline-item-desc">{step.description}</p>
                    </div>
                  ) : (
                    step.image && (
                      <div className="timeline-image-block">
                        <OptimizedImage
                          src={step.image}
                          alt={step.alt}
                          width={400}
                          height={400}
                          aspectRatio="1/1"
                          containerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}
                        />
                      </div>
                    )
                  )}
                </div>

                {/* CENTER DIAMOND NODE */}
                <div className={`timeline-diamond-node ${isPassed ? 'diamond-active' : ''}`}>
                  <div className="diamond-gap-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 12l10 10 10-10L12 2z" />
                    </svg>
                  </div>
                </div>

                {/* DESKTOP RIGHT SIDE CONTAINER */}
                <div className="timeline-side-col col-right desktop-only">
                  {!isEven ? (
                    <div className="timeline-text-block">
                      <div className={`timeline-step-badge ${isPassed ? 'badge-filled' : ''}`}>
                        {step.stepNumber}
                      </div>
                      <h3 className="timeline-item-title">{step.title}</h3>
                      <p className="timeline-item-desc">{step.description}</p>
                    </div>
                  ) : (
                    step.image && (
                      <div className="timeline-image-block">
                        <OptimizedImage
                          src={step.image}
                          alt={step.alt}
                          width={400}
                          height={400}
                          aspectRatio="1/1"
                          containerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}
                        />
                      </div>
                    )
                  )}
                </div>

                {/* MOBILE UNIFIED CARD CONTAINER (Text Always Top, Image Always Below) */}
                <div className="timeline-mobile-card-wrapper mobile-only">
                  <div className="timeline-text-block">
                    <div className={`timeline-step-badge ${isPassed ? 'badge-filled' : ''}`}>
                      {step.stepNumber}
                    </div>
                    <h3 className="timeline-item-title">{step.title}</h3>
                    <p className="timeline-item-desc">{step.description}</p>
                  </div>
                  {step.image && (
                    <div className="timeline-image-block">
                      <OptimizedImage
                        src={step.image}
                        alt={step.alt}
                        width={400}
                        height={400}
                        aspectRatio="1/1"
                        containerStyle={{ width: '100%', height: '100%', borderRadius: '14px' }}
                      />
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};



