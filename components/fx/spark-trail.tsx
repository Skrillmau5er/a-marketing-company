"use client";

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

const MAX_SPARKS = 450;

/** Full-screen additive-blended rainbow sparks that trail the pointer. */
export function SparkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const sparks: Spark[] = [];
    let hue = 0;
    let lastX = -1;
    let lastY = -1;

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const steps = lastX < 0 ? 1 : Math.min(8, Math.ceil(Math.hypot(dx, dy) / 7));
      for (let i = 1; i <= steps; i++) {
        sparks.push({
          x: lastX < 0 ? e.clientX : lastX + (dx * i) / steps,
          y: lastY < 0 ? e.clientY : lastY + (dy * i) / steps,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6 - 0.4,
          life: 1,
          hue,
          size: 1.5 + Math.random() * 3.5,
        });
      }
      if (sparks.length > MAX_SPARKS) sparks.splice(0, sparks.length - MAX_SPARKS);
      hue = (hue + 3) % 360;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.025;
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const r = s.size * s.life;
        ctx.fillStyle = `hsla(${s.hue}, 100%, 60%, ${s.life * 0.18})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${s.life})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40 size-full" />;
}
