import React, { useState } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  const computedAspectRatio =
    aspectRatio !== undefined
      ? aspectRatio
      : width && height
      ? `${width} / ${height}`
      : undefined;

  return (
    <div
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
          transition: 'opacity 0.4s ease',
          ...style,
          opacity: isLoaded || eager ? 1 : 0
        }}
      />
    </div>
  );
};
