"use client";

import { useEffect, useRef } from "react";

/**
 * Matrix-style binary rain background (0s and 1s falling).
 * Canvas-based for smooth performance; respects reduced-motion.
 */
export default function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationId = 0;
    let columns = 0;
    let drops: number[] = [];
    let fontSize = 14;

    const chars = "01";
    const accent = "246, 184, 70"; // gold accent matching theme

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      fontSize = w < 640 ? 12 : 14;
      columns = Math.floor(w / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    }

    function draw() {
      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Trailing fade for rain streaks
      ctx.fillStyle = "rgba(17, 17, 17, 0.08)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Brighter head of the stream
        const head = Math.random() > 0.92;
        ctx.fillStyle = head
          ? `rgba(${accent}, 0.55)`
          : `rgba(${accent}, ${0.08 + Math.random() * 0.18})`;

        ctx.fillText(text, x, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();

    // Initial dark fill
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (!prefersReduced) {
      animationId = requestAnimationFrame(draw);
    } else {
      // Static binary field for reduced motion
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < Math.floor(window.innerHeight / fontSize); j++) {
          if (Math.random() > 0.85) {
            ctx.fillStyle = `rgba(${accent}, 0.12)`;
            ctx.fillText(
              chars[Math.floor(Math.random() * 2)],
              i * fontSize,
              j * fontSize
            );
          }
        }
      }
    }

    const onResize = () => {
      resize();
      if (ctx) {
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
