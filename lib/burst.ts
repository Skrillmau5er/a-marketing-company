type Shape = "rect" | "circle" | "star" | "petal";

interface BurstOptions {
  colors?: string[];
  shapes?: Shape[];
  count?: number;
  power?: number;
  gravity?: number;
  size?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  tilt: number;
  color: string;
  shape: Shape;
  life: number;
  decay: number;
}

const DEFAULT_COLORS = ["#ff2bd6", "#7c3aed", "#22d3ee", "#facc15", "#34d399", "#fb7185"];

export function burst(x: number, y: number, options: BurstOptions = {}) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const {
    colors = DEFAULT_COLORS,
    shapes = ["rect", "circle", "star"],
    count = 140,
    power = 14,
    gravity = 0.35,
    size = 9,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:90";
  document.body.appendChild(canvas);
  ctx.scale(dpr, dpr);

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = power * (0.25 + Math.random() * 0.75);
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - power * 0.35,
      size: size * (0.5 + Math.random()),
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      tilt: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 1,
      decay: 0.006 + Math.random() * 0.01,
    };
  });

  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    const drag = Math.pow(0.97, dt);
    ctx.clearRect(0, 0, w, h);

    let alive = 0;
    for (const p of particles) {
      if (p.life <= 0) continue;
      p.vx *= drag;
      p.vy = p.vy * drag + gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.tilt += 0.15 * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0 || p.y > h + 40) {
        p.life = 0;
        continue;
      }
      alive++;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life * 1.5);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.tilt));
      ctx.fillStyle = p.color;
      drawShape(ctx, p.shape, p.size);
      ctx.restore();
    }

    if (alive > 0) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

export function burstFrom(el: Element, options?: BurstOptions) {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, options);
}

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape, s: number) {
  ctx.beginPath();
  switch (shape) {
    case "rect":
      ctx.rect(-s / 2, -s / 4, s, s / 2);
      break;
    case "circle":
      ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
      break;
    case "petal":
      ctx.ellipse(0, 0, s / 2.4, s, 0, 0, Math.PI * 2);
      break;
    case "star":
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s / 1.5 : s / 3.4;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      break;
  }
  ctx.fill();
}
