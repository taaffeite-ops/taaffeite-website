import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;        // applied to outer container for layout/positioning/dimensions
  imgClassName?: string;     // applied to inner <img>
  containerClassName?: string;
  eager?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  aspectRatio?: string;
  /** Responsive image candidates, e.g. "img-800.webp 800w, img-1600.webp 1600w" */
  srcSet?: string;
  /** Hint to browser about rendered image width, e.g. "100vw" or "(max-width: 600px) 100vw, 50vw" */
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  imgClassName = '',
  containerClassName = '',
  eager = false,
  objectFit = 'cover',
  containerStyle = {},
  style = {},
  aspectRatio,
  srcSet,
  sizes,
}) => {
  const [isInView, setIsInView] = useState(eager);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) return;

    let observer: IntersectionObserver | null = null;
    const currentContainer = containerRef.current;

    if (currentContainer && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (observer) {
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: '200px 0px 300px 0px', // 300px lookahead (down), 200px lookback (up)
          threshold: 0.01
        }
      );

      observer.observe(currentContainer);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setIsInView(true);
    }

    return () => {
      if (observer && currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [eager]);

  const computedAspectRatio = aspectRatio !== undefined ? aspectRatio : (width && height ? `${width} / ${height}` : undefined);

  return (
    <div
      ref={containerRef}
      className={`optimized-image-container ${className} ${containerClassName}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: computedAspectRatio === 'unset' ? undefined : computedAspectRatio,
        backgroundColor: '#e5dfd5', // elegant placeholder color matching brand
        overflow: 'hidden',
        ...containerStyle
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          srcSet={srcSet}
          sizes={srcSet ? (sizes ?? '100vw') : undefined}
          onLoad={() => setIsLoaded(true)}
          className={`optimized-img ${imgClassName} ${isLoaded ? 'loaded' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            transition: 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
            ...style,
            opacity: isLoaded ? (style.opacity !== undefined ? style.opacity : undefined) : 0
          }}
        />
      )}
    </div>
  );
};
