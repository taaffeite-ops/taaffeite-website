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
}

// Helper to draw a beautiful, symmetrical heart shape centered at (x, y)
const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath();
  // Start at the bottom tip
  ctx.moveTo(x, y + size * 0.5);
  // Left lobe
  ctx.bezierCurveTo(
    x - size * 0.65, y - size * 0.2,  // Left outer cheek
    x - size * 0.35, y - size * 0.75, // Left upper hump
    x, y - size * 0.25                // Center cleft dip
  );
  // Right lobe
  ctx.bezierCurveTo(
    x + size * 0.35, y - size * 0.75, // Right upper hump
    x + size * 0.65, y - size * 0.2,  // Right outer cheek
    x, y + size * 0.5                 // Back down to bottom tip
  );
  ctx.closePath();
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

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          size: Math.random() * 5 + 5, // 5px to 10px to make the heart shape recognizable
          opacity: Math.random() * 0.4 + 0.6, // Strong luminous opacity (0.6 to 1.0)
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
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
      // Draw connections first (behind particles) - each heart connects to its 2 closest neighbors (no absolute radius limit)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        let firstMinDist = Infinity;
        let firstMinIdx = -1;
        let secondMinDist = Infinity;
        let secondMinIdx = -1;

        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          
          if (dist < firstMinDist) {
            secondMinDist = firstMinDist;
            secondMinIdx = firstMinIdx;
            firstMinDist = dist;
            firstMinIdx = j;
          } else if (dist < secondMinDist) {
            secondMinDist = dist;
            secondMinIdx = j;
          }
        }

        // Draw connection to the nearest neighbor (only once per unique pair)
        if (firstMinIdx > i) {
          const p2 = particles[firstMinIdx];
          const alpha = Math.max(0.08, (1 - firstMinDist / 350) * 0.45);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Draw connection to the second nearest neighbor (only once per unique pair)
        if (secondMinIdx > i) {
          const p2 = particles[secondMinIdx];
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
        // Physics: Repulsion from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Apply repulsion force away from cursor
          const forceDirX = dx / (dist || 1);
          const forceDirY = dy / (dist || 1);
          const strength = 1.8; // strength of repulsion push

          p.vx += forceDirX * force * strength;
          p.vy += forceDirY * force * strength;
        }

        // Apply friction to slow down to normal speed when not repelled
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxDrift = 0.4;
        if (speed > maxDrift) {
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

        // Draw particle with actual metallic gold radial gradient & glowing shadow aura
        drawHeart(ctx, p.x, p.y, p.size);

        // 3D shiny/metallic gold gradient: bright hot-white center fading to solid outer gold
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size
        );
        gradient.addColorStop(0, '#ffffff');                     // Hot white center glow
        gradient.addColorStop(0.2, '#fff6d1');                   // Soft champagne gold highlight
        gradient.addColorStop(0.8, p.color);                     // Main gold body
        gradient.addColorStop(1, p.color);                       // Solid outer gold for crisp contour

        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 18;                                      // Strong glowing aura
        ctx.shadowColor = p.color;                                // Glow color matches the gold particle
        ctx.fill();

        // Rich satin gold stroke outline to make the heart shape crisp and visible
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.globalAlpha = 1.0;                                    // Reset global alpha
        ctx.shadowBlur = 0;                                       // Reset shadow blur
      });

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
