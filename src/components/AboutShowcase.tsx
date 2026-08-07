import React, { useEffect, useRef } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

interface AboutShowcaseProps {
  isMobile: boolean;
  activeAboutSlide: number;
}

export const AboutShowcase = React.memo(React.forwardRef<HTMLDivElement, AboutShowcaseProps>(({
  activeAboutSlide
}, ref) => {
  useRevealAnimation();

  const slide0Ref = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!slide0Ref.current || !slide1Ref.current || !slide2Ref.current) return;

      const rect0 = slide0Ref.current.getBoundingClientRect();
      const rect1 = slide1Ref.current.getBoundingClientRect();
      const rect2 = slide2Ref.current.getBoundingClientRect();

      // Card 0 VS Card 1: starts when Card 1's top touches Card 0's bottom
      let p0 = 0;
      const height0 = rect0.bottom - rect0.top;
      if (height0 > 0) {
        p0 = Math.max(0, Math.min((rect0.bottom - rect1.top) / height0, 1));
      }

      const scale0 = 1 - p0 * 0.05;
      const blur0 = p0 * 4;
      const opacity0 = 1 - p0 * 0.4;
      const translateY0 = -p0 * 30;

      slide0Ref.current.style.transform = `scale(${scale0}) translateY(${translateY0}px)`;
      slide0Ref.current.style.filter = `blur(${blur0}px)`;
      slide0Ref.current.style.opacity = `${opacity0}`;

      // Card 1 VS Card 2: starts when Card 2's top touches Card 1's bottom
      let p1 = 0;
      const height1 = rect1.bottom - rect1.top;
      if (height1 > 0) {
        p1 = Math.max(0, Math.min((rect1.bottom - rect2.top) / height1, 1));
      }

      const scale1 = 1 - p1 * 0.05;
      const blur1 = p1 * 4;
      const opacity1 = 1 - p1 * 0.4;
      const translateY1 = -p1 * 30;

      slide1Ref.current.style.transform = `scale(${scale1}) translateY(${translateY1}px)`;
      slide1Ref.current.style.filter = `blur(${blur1}px)`;
      slide1Ref.current.style.opacity = `${opacity1}`;

      // Card 2 is the top card (always reset and sharp)
      slide2Ref.current.style.transform = 'scale(1) translateY(0)';
      slide2Ref.current.style.filter = 'blur(0px)';
      slide2Ref.current.style.opacity = '1';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [ref]);

  return (
    <div className="about-showcase-container" id="about-showcase" ref={ref}>
      <div className="about-showcase-sticky">

        {/* Slide 1 */}
        <div className={`about-showcase-slide ${activeAboutSlide === 0 ? 'active' : ''}`} id="about-slide-0">
          <div ref={slide0Ref} className="about-showcase-card">
            <div className="about-card-bg-wrapper">
              <OptimizedImage
                src="/assets/05 PHOTOS/Weddings/AKR05567.webp"
                alt="Bespoke proposal setup designed by Taaffeite Events — luxury event planners in Bangalore, India"
                className="about-card-bg-image"
                width={2400}
                height={3600}
                aspectRatio="unset"
              />
              <div className="about-card-overlay"></div>
            </div>
            <div className="about-showcase-info">
              <h3 className="about-showcase-title">It Starts With Your Story</h3>
              <div className="about-slide-gold-line"></div>
              <p className="about-showcase-desc">
                Every celebration begins with people, not plans. Before we think about colours, venues, or timelines, we take time to understand who you are, what matters to your family, and the moments you want to remember years from now. Every decision we make grows from your story, your traditions, and your vision, creating a celebration that feels deeply personal from beginning to end.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className={`about-showcase-slide ${activeAboutSlide === 1 ? 'active' : ''}`} id="about-slide-1">
          <div ref={slide1Ref} className="about-showcase-card">
            <div className="about-card-bg-wrapper">
              <OptimizedImage
                src="/assets/05 PHOTOS/Weddings/AKR04789.webp"
                alt="Luxury wedding ceremony decor by Taaffeite Events — top wedding planners in Bangalore, Bengaluru"
                className="about-card-bg-image"
                width={8640}
                height={5760}
                aspectRatio="unset"
              />
              <div className="about-card-overlay"></div>
            </div>
            <div className="about-showcase-info">
              <h3 className="about-showcase-title">Inspired by Rarity</h3>
              <div className="about-slide-gold-line"></div>
              <p className="about-showcase-desc">
                Taaffeite is one of the rarest gemstones in the world, and that belief shapes everything we create. We have never believed in celebrations that look copied or predictable. Every couple, every family, and every story deserves something uniquely their own. That is why we approach every event with fresh ideas, thoughtful design, and an unwavering attention to detail, creating experiences that feel timeless rather than trendy.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className={`about-showcase-slide ${activeAboutSlide === 2 ? 'active' : ''}`} id="about-slide-2">
          <div ref={slide2Ref} className="about-showcase-card">
            <div className="about-card-bg-wrapper">
              <OptimizedImage
                src="/assets/05 PHOTOS/Reception/Weva1701.webp"
                alt="Premium wedding reception design by Taaffeite Events — bespoke event decorators in Bangalore"
                className="about-card-bg-image"
                width={3645}
                height={5467}
                aspectRatio="unset"
              />
              <div className="about-card-overlay"></div>
            </div>
            <div className="about-showcase-info">
              <h3 className="about-showcase-title">Designed So You Can Be Present</h3>
              <div className="about-slide-gold-line"></div>
              <p className="about-showcase-desc">
                The most memorable celebrations are the ones where you never have to think about what comes next. While you enjoy every conversation, embrace every loved one, and live every moment, we quietly manage everything behind the scenes. From planning and coordination to the smallest finishing touches, every detail is carefully orchestrated so your celebration unfolds effortlessly, exactly as it should.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}));

AboutShowcase.displayName = 'AboutShowcase';
