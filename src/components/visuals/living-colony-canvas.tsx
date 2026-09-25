"use client";

import * as React from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
}

export function LivingColonyCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Particles array
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 65;

    const resize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Re-initialize particles if empty
      if (particles.length === 0 && width > 0 && height > 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            radius: Math.random() * 2.5 + 1.2,
            hue: Math.random() > 0.4 ? 174 : 192, // Bio-Teal (174) & Bio-Cyan (192)
            alpha: Math.random() * 0.5 + 0.3,
            baseAlpha: Math.random() * 0.5 + 0.3,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Pause rendering when scrolled off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    let tick = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      tick += 0.015;

      // Draw faint background grid (representing a hemocytometer / Neubauer counting chamber)
      ctx.strokeStyle = "rgba(13, 148, 136, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Gentle sinusoidal breathing
          p.alpha = p.baseAlpha + Math.sin(tick + p.phase) * 0.15;

          // Boundary bounce with soft wrap
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Mouse gentle chemotaxis (subtle repulsion/dispersion)
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Draw particle body
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 45%, ${p.alpha})`;
        ctx.fill();

        // Connect nearby colony members (colony biofilm formation)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(174, 80%, 40%, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto rounded-xl"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Specimen HUD overlay labels */}
      <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] font-mono text-[var(--bio-teal)] opacity-60 tracking-wider flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--bio-teal)] animate-pulse" />
        MICROBIAL COLONY / CHEMOTACTIC FIELD (IN SILICO)
      </div>
    </div>
  );
}
