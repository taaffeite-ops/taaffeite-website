import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  opacity: number;
  color: string;
  cacheCanvas: HTMLCanvasElement;
}

// Helper to pre-render a beautiful gold heart with champagne highlights and shadow onto an off-screen canvas
const createHeartCache = (color: string, size: number, hasShadow: boolean): HTMLCanvasElement => {
  const cacheCanvas = document.createElement('canvas');
  const blur = hasShadow ? 12 : 0;
  const padding = blur + 2;
  const canvasSize = size * 2 + padding * 2;
  cacheCanvas.width = canvasSize;
  cacheCanvas.height = canvasSize;

  const cacheCtx = cacheCanvas.getContext('2d');
  if (!cacheCtx) return cacheCanvas;

  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;

  // Draw heart path
  cacheCtx.beginPath();
  cacheCtx.moveTo(centerX, centerY + size * 0.5);
  // Left lobe
  cacheCtx.bezierCurveTo(
    centerX - size * 0.65, centerY - size * 0.2,
    centerX - size * 0.35, centerY - size * 0.75,
    centerX, centerY - size * 0.25
  );
  // Right lobe
  cacheCtx.bezierCurveTo(
    centerX + size * 0.35, centerY - size * 0.75,
    centerX + size * 0.65, centerY - size * 0.2,
    centerX, centerY + size * 0.5
  );
  cacheCtx.closePath();

  // 3D shiny/metallic gold gradient: bright hot-white center fading to solid outer gold
  const gradient = cacheCtx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, size
  );
  gradient.addColorStop(0, '#ffffff');                     // Hot white center glow
  gradient.addColorStop(0.2, '#fff6d1');                   // Champagne gold highlight
  gradient.addColorStop(0.8, color);                     // Main gold body
  gradient.addColorStop(1, color);                       // Solid outer gold for crisp contour

  cacheCtx.fillStyle = gradient;
  if (hasShadow) {
    cacheCtx.shadowBlur = blur;
    cacheCtx.shadowColor = color;
  }
  cacheCtx.fill();

  // Rich satin gold stroke outline
  if (hasShadow) {
    cacheCtx.shadowBlur = 0; // turn off shadow for stroke to keep it crisp
  }
  cacheCtx.strokeStyle = 'rgba(212, 175, 55, 0.9)';
  cacheCtx.lineWidth = 1.2;
  cacheCtx.stroke();

  return cacheCanvas;
};

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize particles based on screen size
    const initParticles = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Density calculation: 1 particle per 15000 pixels, clamped
      const maxParticles = width < 768 ? 25 : 70;
      const count = Math.min(Math.floor((width * height) / 16000), maxParticles);
      const hasShadow = width >= 768; // Only desktop gets glowing shadows for performance

      particles = [];
      const goldColors = [
        '#ffd700', // Classic Metallic Gold
        '#d4af37', // Satin Sheen Gold
        '#f9a602', // Warm Amber Gold
      ];

      for (let i = 0; i < count; i++) {
        // Base drift speed (very slow and elegant)
        const baseVx = (Math.random() - 0.5) * 0.3;
        const baseVy = (Math.random() - 0.5) * 0.3;
        const size = Math.random() * 5 + 5; // 5px to 10px to make the heart shape recognizable
        const color = goldColors[Math.floor(Math.random() * goldColors.length)];
        const opacity = Math.random() * 0.4 + 0.6; // Strong luminous opacity (0.6 to 1.0)

        // Create pre-rendered canvas cache for this specific particle size/color/shadow config
        const cacheCanvas = createHeartCache(color, size, hasShadow);

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          size,
          opacity,
          color,
          cacheCanvas,
        });
      }
    };

    initParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Touch handlers for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchend', handleMouseLeave);

    // Resize handler
    const handleResize = () => {
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const mouseRadiusSq = mouse.radius * mouse.radius;

      // Draw connections first (behind particles) - each heart connects to its 2 closest neighbors (no absolute radius limit)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        let firstMinDistSq = Infinity;
        let firstMinIdx = -1;
        let secondMinDistSq = Infinity;
        let secondMinIdx = -1;

        // Use squared distance for O(n^2) comparisons to completely avoid Math.hypot/Math.sqrt calls
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < firstMinDistSq) {
            secondMinDistSq = firstMinDistSq;
            secondMinIdx = firstMinIdx;
            firstMinDistSq = distSq;
            firstMinIdx = j;
          } else if (distSq < secondMinDistSq) {
            secondMinDistSq = distSq;
            secondMinIdx = j;
          }
        }

        // Draw connection to the nearest neighbor (only once per unique pair) - Math.sqrt is called only here
        if (firstMinIdx > i) {
          const p2 = particles[firstMinIdx];
          const firstMinDist = Math.sqrt(firstMinDistSq);
          const alpha = Math.max(0.08, (1 - firstMinDist / 350) * 0.45);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Draw connection to the second nearest neighbor (only once per unique pair) - Math.sqrt is called only here
        if (secondMinIdx > i) {
          const p2 = particles[secondMinIdx];
          const secondMinDist = Math.sqrt(secondMinDistSq);
          const alpha = Math.max(0.08, (1 - secondMinDist / 350) * 0.45);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Physics: Repulsion from cursor (optimizing Math.sqrt to only execute when within interaction radius)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          const forceDirX = dx / (dist || 1);
          const forceDirY = dy / (dist || 1);
          const strength = 1.8; // strength of repulsion push

          p.vx += forceDirX * force * strength;
          p.vy += forceDirY * force * strength;
        }

        // Apply friction to slow down to normal speed when not repelled
        const speedSq = p.vx * p.vx + p.vy * p.vy;
        const maxDriftSq = 0.16; // 0.4 * 0.4
        if (speedSq > maxDriftSq) {
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else {
          // Gently restore natural slow drift
          p.vx = p.vx * 0.95 + p.baseVx * 0.05;
          p.vy = p.vy * 0.95 + p.baseVy * 0.05;
        }

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle using the high-performance off-screen canvas cache
        ctx.globalAlpha = p.opacity;
        ctx.drawImage(p.cacheCanvas, p.x - p.cacheCanvas.width / 2, p.y - p.cacheCanvas.height / 2);
      });

      ctx.globalAlpha = 1.0; // Reset global alpha to avoid leaking state
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchend', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2, // Sit behind text and interactive elements but above backgrounds
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};
