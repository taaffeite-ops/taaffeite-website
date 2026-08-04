import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

interface FoundersShowcaseProps {
  isMobile: boolean;
  activeFoundersSlide: number;
}

export const FoundersShowcase = React.memo(React.forwardRef<HTMLDivElement, FoundersShowcaseProps>(({
  isMobile,
  activeFoundersSlide
}, ref) => {
  useRevealAnimation();

  const containerRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else if (entry.boundingClientRect.top > 0) {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isSlide0Active = activeFoundersSlide === 0 && isInView;

  return (
    <>
      <div className={`founders-showcase-container ${isMobile ? 'is-mobile' : ''}`} id="founders-showcase" ref={containerRef}>
        <div className="founders-showcase-sticky">

          {/* Slide 0: Why Taaffeite Title Entry */}
          <div className={`founders-showcase-slide ${isSlide0Active ? 'active' : ''} ${activeFoundersSlide > 0 ? 'exited' : ''}`} id="founders-slide-0">
            <section className="founders-title-section">
              <div className="founders-title-card-content">
                <h1 className="founders-large-title">
                  <span className="reveal-word">
                    {"Why".split('').map((char, idx) => (
                      <span key={idx} className="reveal-char" style={{ transitionDelay: `${idx * 0.04}s` }}>{char}</span>
                    ))}
                  </span>{" "}
                  <span className="reveal-word gold-reveal-word">
                    {"Taaffeite?".split('').map((char, idx) => (
                      <span key={idx} className="reveal-char" style={{ transitionDelay: `${(4 + idx) * 0.04}s` }}>{char}</span>
                    ))}
                  </span>
                </h1>
              </div>

              {/* Scroll Down Indicator */}
              <div className="founders-scroll-indicator">
                <svg className="scroll-indicator-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
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
                    src="/assets/images/founders3-lg.webp"
                    alt="Anya Daisy Vergis and Sipporah, founders of Taaffeite Events — luxury wedding and event planners based in Bangalore, India"
                    width={1200}
                    height={800}
                    aspectRatio="unset"
                    containerStyle={{ width: '100%', height: '100%' }}
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

        </div>
      </div>
    </>
  );
}));

FoundersShowcase.displayName = 'FoundersShowcase';
