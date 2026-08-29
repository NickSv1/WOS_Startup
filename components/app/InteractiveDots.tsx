"use client";

import { useEffect, useRef } from "react";

/**
 * An ambient dot grid that reacts to the cursor: dots near the pointer swell,
 * ease away, and warm toward lime. Pure canvas + requestAnimationFrame with
 * eased pointer tracking so the motion stays buttery. Purely decorative —
 * pointer-events are off so it never steals interaction from the map.
 */
export function InteractiveDots({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    // Explicit non-null aliases so the nested rAF/resize closures stay typed.
    const cv: HTMLCanvasElement = el;
    const c: CanvasRenderingContext2D = context;

    const SPACING = 26;
    const BASE_R = 1.4;
    const INFLUENCE = 130;
    const MAX_PUSH = 12;
    const MAX_GROW = 3.2;

    // Live + eased pointer, and an eased overall strength (0 when cursor is away).
    const pointer = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999 };
    let strength = 0;
    let targetStrength = 0;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      const rect = cv.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(width * dpr);
      cv.height = Math.floor(height * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e: MouseEvent) {
      const rect = cv.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      targetStrength = inside ? 1 : 0;
      if (eased.x < -999) {
        eased.x = x;
        eased.y = y;
      }
    }
    function onLeave() {
      targetStrength = 0;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    let raf = 0;
    function frame() {
      eased.x += (pointer.x - eased.x) * 0.16;
      eased.y += (pointer.y - eased.y) * 0.16;
      strength += (targetStrength - strength) * 0.07;

      c.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const bx = i * SPACING;
          const by = j * SPACING;

          let px = bx;
          let py = by;
          let r = BASE_R;
          let tint = 0;

          if (strength > 0.001) {
            const dx = bx - eased.x;
            const dy = by - eased.y;
            const dist = Math.hypot(dx, dy);
            if (dist < INFLUENCE) {
              const f = (1 - dist / INFLUENCE) * strength;
              const nd = dist || 1;
              px += (dx / nd) * f * MAX_PUSH;
              py += (dy / nd) * f * MAX_PUSH;
              r += f * MAX_GROW;
              tint = f;
            }
          }

          // neutral-300 → lime as the dot warms up
          const rr = Math.round(212 + (193 - 212) * tint);
          const gg = Math.round(212 + (255 - 212) * tint);
          const bb = Math.round(212 + (114 - 212) * tint);
          const alpha = 0.55 + tint * 0.45;
          c.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
          c.beginPath();
          c.arc(px, py, r, 0, Math.PI * 2);
          c.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
