"use client";

import {
  animate,
  type AnimationPlaybackControls,
  motion,
  useAnimate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GradientSlider } from "@/components/fx/gradient-slider";
import { Magnetic } from "@/components/fx/magnetic";
import { ScrambleText } from "@/components/fx/scramble-text";
import { burst, burstFrom } from "@/lib/burst";
import { cn, seeded } from "@/lib/utils";

const NEON = ["#ff2bd6", "#22d3ee", "#facc15", "#a855f7", "#ff2e88"];

export function SynthwavePage() {
  return (
    <main className="relative min-h-svh bg-[#0b0016] font-mono text-white">
      <RetroHero />
      <TerminalSection />
      <VibeMixer />
      <FlipCards />
      <HoldToLaunch />
      <footer className="border-t border-fuchsia-500/20 px-6 py-10 text-center text-xs uppercase tracking-[0.3em] text-fuchsia-300/50">
        A Marketing Company // Synthwave division // Est. 1986 (spiritually)
      </footer>
    </main>
  );
}

function RetroHero() {
  const ref = useRef<HTMLElement>(null);
  const stars = useMemo(() => {
    const rand = seeded(1986);
    return Array.from({ length: 90 }, () => ({
      left: rand() * 100,
      top: rand() * 55,
      size: rand() * 2 + 0.6,
      delay: rand() * 4,
      dur: 2 + rand() * 3,
    }));
  }, []);

  const tilt = useSpring(0, { stiffness: 60, damping: 18 });
  const sunX = useTransform(tilt, (v) => v * -40);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => tilt.set(e.clientX / window.innerWidth - 0.5)}
      className="relative h-svh min-h-[640px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(#07000f_0%,#1d0536_40%,#4a0a5e_56%,#ff2e88_64%,#0b0016_64.2%)]" />
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              "--dur": `${s.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <motion.div style={{ x: sunX, y: sunY }} className="absolute left-1/2 top-[18%] -translate-x-1/2">
        <div className="absolute inset-0 rounded-full bg-[#ff2e88] opacity-60 blur-[80px]" />
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="sun relative size-[min(70vw,440px)] rounded-full"
        />
      </motion.div>

      {/* Grid depth must stay under the perspective distance or the near edge passes behind the camera and vanishes. */}
      <div className="absolute inset-x-0 bottom-0 h-[36%] overflow-hidden bg-[#0b0016] [perspective:600px]">
        <div className="retro-grid absolute inset-x-[-150%] top-0 h-[560px] origin-top [mask-image:linear-gradient(to_bottom,transparent,black_30%)] [transform:rotateX(70deg)]" />
      </div>
      <div className="absolute inset-x-0 top-[64%] h-px bg-fuchsia-300 shadow-[0_0_30px_8px_#ff2bd6]" />

      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-[18vh] text-center drop-shadow-[0_0_25px_rgba(255,43,214,0.6)]"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 2.5, filter: "blur(30px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          data-text="NEON//GROWTH"
          className="glitch bg-[linear-gradient(to_bottom,#fff_0%,#ffe9fb_45%,#ff2bd6_52%,#22d3ee_100%)] bg-clip-text font-retro text-[clamp(2.4rem,10vw,8.5rem)] font-black italic leading-none tracking-tight text-transparent"
        >
          NEON//GROWTH
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-6 text-sm uppercase tracking-[0.4em] text-cyan-300 md:text-lg"
        >
          <ScrambleText text="ROI THAT GLOWS IN THE DARK" className="neon-text" />
        </motion.div>
        <motion.a
          href="#terminal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="crt-flicker mt-10 rounded-sm border-2 border-fuchsia-400 px-8 py-3 font-retro text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-300 shadow-[0_0_20px_#ff2bd6,inset_0_0_20px_#ff2bd6] transition-colors hover:bg-fuchsia-500 hover:text-white"
        >
          Enter the grid ↓
        </motion.a>
      </motion.div>
    </section>
  );
}

type Line = { id: number; kind: "in" | "out" | "sys"; text: string };

const HYPE = [
  "Your brand just got 10,000 new followers. In the multiverse.",
  "Engagement is up. Way up. Like, orbital.",
  "We A/B tested the sun. Variant B won.",
  "Synergy levels: dangerously aesthetic.",
  "Your logo is now visible from low earth orbit.",
];

const HELP = `available commands:
  launch     deploy a campaign into the neon void
  hype       generate a motivational metric
  theme <c>  pink | cyan | lime | gold
  whoami     identify current user
  party      you know what this does
  clear      wipe the screen`;

const THEMES: Record<string, string> = { pink: "#ff2bd6", cyan: "#22d3ee", lime: "#a3e635", gold: "#facc15" };

const QUICK = ["help", "launch", "hype", "theme cyan", "party"];

function TerminalSection() {
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: "sys", text: "AMC-OS v9.9 — hype kernel loaded.\nType 'help' or tap a command below." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [accent, setAccent] = useState(THEMES.pink);
  const [party, setParty] = useState(false);
  const nextId = useRef(1);
  const hypeCount = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;
    cancelled.current = false;
    const ro = new ResizeObserver(() => scroller.scrollTo({ top: scroller.scrollHeight }));
    ro.observe(content);
    return () => {
      ro.disconnect();
      cancelled.current = true;
    };
  }, []);

  const respond = (cmd: string): string => {
    const [name, arg] = cmd.split(/\s+/);
    switch (name) {
      case "help":
        return HELP;
      case "launch":
        setTimeout(() => windowRef.current && burstFrom(windowRef.current, { colors: NEON, count: 220, power: 20 }), 1300);
        return "initializing hype reactor...\n[████████████████████] 100%\ncampaign deployed to 14 galaxies ✦";
      case "hype":
        return HYPE[hypeCount.current++ % HYPE.length];
      case "theme":
        if (arg && THEMES[arg]) {
          setAccent(THEMES[arg]);
          return `theme set to ${arg}. looking fresh.`;
        }
        return "usage: theme pink | cyan | lime | gold";
      case "whoami":
        return "a future client with excellent taste.";
      case "party":
        setParty((p) => !p);
        return party ? "party mode disengaged. responsibly." : "PARTY MODE ENGAGED 🪩";
      case "sudo":
        return "nice try. but yes, we'd love to work with you.";
      default:
        return `command not found: ${name}. try 'help'`;
    }
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const inId = nextId.current++;
    const outId = nextId.current++;
    const text = respond(cmd);
    setLines((ls) => [...ls, { id: inId, kind: "in", text: raw.trim() }, { id: outId, kind: "out", text }]);
  };

  const autoType = async (cmd: string) => {
    if (busy) return;
    setBusy(true);
    setInput("");
    for (let i = 1; i <= cmd.length; i++) {
      await new Promise((r) => setTimeout(r, 55 + Math.random() * 60));
      if (cancelled.current) return;
      setInput(cmd.slice(0, i));
    }
    await new Promise((r) => setTimeout(r, 250));
    if (cancelled.current) return;
    run(cmd);
    setInput("");
    setBusy(false);
  };

  return (
    <section id="terminal" className="relative scroll-mt-20 px-4 py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-3 text-center font-retro text-3xl font-black uppercase md:text-5xl">
          <span className="neon-text text-fuchsia-400">Talk</span> to the machine
        </h2>
        <p className="mb-12 text-center text-sm text-white/50">A fully interactive terminal. Type, or let it type for you.</p>

        <motion.div
          ref={windowRef}
          initial={{ opacity: 0, rotateX: 40, y: 80 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
          style={{ transformPerspective: 1200, borderColor: accent, boxShadow: `0 0 60px -10px ${accent}` }}
          className={cn("scanlines relative overflow-hidden rounded-xl border-2 bg-black/80 transition-[border-color,box-shadow] duration-500", party && "hue-cycle")}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-white/40">guest@amc — zsh — 80×24</span>
          </div>
          <div ref={scrollRef} className="crt-flicker h-80 overflow-y-auto p-5 text-sm leading-relaxed" style={{ color: accent }}>
            <div ref={contentRef}>
              {lines.map((line) => (
                <div key={line.id} className="whitespace-pre-wrap">
                  {line.kind === "in" ? (
                    <span>
                      <span className="text-white/50">guest@amc:~$</span> <span className="text-white">{line.text}</span>
                    </span>
                  ) : (
                    <TypedText text={line.text} instant={line.kind === "sys"} />
                  )}
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  run(input);
                  setInput("");
                }}
                className="flex"
              >
                <span className="whitespace-pre text-white/50">guest@amc:~$ </span>
                <span className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={busy}
                    aria-label="Terminal command"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-transparent text-white caret-transparent outline-none"
                  />
                  <span
                    aria-hidden
                    className="caret pointer-events-none absolute top-0.5 h-4 w-2"
                    style={{ left: `${input.length}ch`, background: accent }}
                  />
                </span>
              </form>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {QUICK.map((cmd) => (
            <motion.button
              key={cmd}
              whileHover={{ y: -3, boxShadow: `0 0 20px ${accent}` }}
              whileTap={{ scale: 0.9 }}
              disabled={busy}
              onClick={() => autoType(cmd)}
              className="rounded border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 disabled:opacity-40"
            >
              &gt; {cmd}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TypedText({ text, instant = false }: { text: string; instant?: boolean }) {
  const [shown, setShown] = useState(instant ? text.length : 0);

  useEffect(() => {
    if (shown >= text.length) return;
    const t = setTimeout(() => setShown((n) => n + Math.max(1, Math.round(text.length / 90))), 14);
    return () => clearTimeout(t);
  }, [shown, text]);

  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length && <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-current" />}
    </>
  );
}

interface Vibe {
  hue: number;
  speed: number;
  amp: number;
  waves: number;
}

const PRESETS: Record<string, Vibe> = {
  Miami: { hue: 320, speed: 1.2, amp: 60, waves: 5 },
  Tokyo: { hue: 190, speed: 2.4, amp: 40, waves: 9 },
  Vapor: { hue: 265, speed: 0.6, amp: 85, waves: 3 },
  Inferno: { hue: 10, speed: 3.2, amp: 95, waves: 12 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function VibeMixer() {
  const [vibe, setVibe] = useState<Vibe>(PRESETS.Miami);
  const [preset, setPreset] = useState("Miami");
  const vibeRef = useRef(vibe);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tween = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    vibeRef.current = vibe;
  }, [vibe]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const ro = new ResizeObserver(() => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    ro.observe(canvas);

    let t = 0;
    let last = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const { hue, speed, amp, waves } = vibeRef.current;
      t += ((now - last) / 1000) * speed;
      last = now;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(8,0,18,0.28)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const count = Math.round(waves);
      for (let i = 0; i < count; i++) {
        const hh = hue + i * (60 / count);
        ctx.strokeStyle = `hsla(${hh}, 100%, 62%, 0.85)`;
        ctx.shadowColor = `hsl(${hh}, 100%, 60%)`;
        ctx.shadowBlur = 14;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const env = Math.sin((x / w) * Math.PI);
          const y =
            h * 0.42 +
            Math.sin(x * 0.012 + t * (1 + i * 0.18) + i) * (amp / 100) * h * 0.28 * env +
            Math.sin(x * 0.031 - t * 1.7 + i * 2) * (amp / 100) * h * 0.06;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      const bars = 40;
      const bw = w / bars;
      for (let j = 0; j < bars; j++) {
        const v = (Math.sin(t * 3 + j * 0.45) * 0.5 + 0.5) * (Math.sin(t * 1.3 + j * 0.13) * 0.5 + 0.5);
        const bh = v * h * 0.22 * (0.3 + amp / 100);
        ctx.fillStyle = `hsla(${hue + j * 3}, 100%, 60%, 0.75)`;
        ctx.fillRect(j * bw + 1, h - bh, bw - 2, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const applyPreset = (name: string) => {
    setPreset(name);
    tween.current?.stop();
    const from = vibe;
    const to = PRESETS[name];
    tween.current = animate(0, 1, {
      duration: 0.9,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (k) =>
        setVibe({
          hue: lerp(from.hue, to.hue, k),
          speed: lerp(from.speed, to.speed, k),
          amp: lerp(from.amp, to.amp, k),
          waves: lerp(from.waves, to.waves, k),
        }),
    });
  };

  const update = (key: keyof Vibe) => (value: number) => {
    tween.current?.stop();
    setPreset("");
    setVibe((v) => ({ ...v, [key]: value }));
  };

  const gradient = `linear-gradient(90deg, hsl(${vibe.hue} 100% 60%), hsl(${vibe.hue + 60} 100% 60%))`;

  return (
    <section className="relative px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-center font-retro text-3xl font-black uppercase md:text-5xl">
          The <span className="neon-text" style={{ color: `hsl(${vibe.hue} 100% 65%)` }}>vibe</span> mixer
        </h2>
        <p className="mb-12 text-center text-sm text-white/50">Dial in your campaign&apos;s frequency. Presets glide between states.</p>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div
            className="scanlines relative aspect-[16/10] overflow-hidden rounded-2xl border-2 bg-[#080012]"
            style={{ borderColor: `hsl(${vibe.hue} 100% 60%)`, boxShadow: `0 0 70px -15px hsl(${vibe.hue} 100% 60%)` }}
          >
            <canvas ref={canvasRef} className="size-full" />
          </div>

          <div className="flex flex-col justify-center gap-7 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(PRESETS).map((name) => (
                <button key={name} onClick={() => applyPreset(name)} className="relative rounded-lg py-2 text-xs font-bold uppercase tracking-wider">
                  {preset === name && (
                    <motion.span
                      layoutId="preset-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: gradient }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={cn("relative", preset === name ? "text-black" : "text-white/60")}>{name}</span>
                </button>
              ))}
            </div>
            <GradientSlider label="Hue" value={vibe.hue} min={0} max={360} onChange={update("hue")} format={(v) => `${Math.round(v)}°`} gradient={gradient} />
            <GradientSlider label="Tempo" value={vibe.speed} min={0.1} max={4} step={0.1} onChange={update("speed")} format={(v) => `${v.toFixed(1)}x`} gradient={gradient} />
            <GradientSlider label="Energy" value={vibe.amp} min={5} max={100} onChange={update("amp")} format={(v) => `${Math.round(v)}%`} gradient={gradient} />
            <GradientSlider label="Layers" value={vibe.waves} min={1} max={14} onChange={update("waves")} gradient={gradient} />
          </div>
        </div>
      </div>
    </section>
  );
}

const CAMPAIGNS = [
  { title: "Midnight Drop", glyph: "◐", stat: "+840%", detail: "Sneaker launch sold out in 4 minutes flat.", color: "#ff2bd6" },
  { title: "Laser Lounge", glyph: "✧", stat: "12M", detail: "Views on a 9-second teaser of a lamp.", color: "#22d3ee" },
  { title: "Turbo Dawn", glyph: "▲", stat: "3.2x", detail: "Return on ad spend for an energy drink.", color: "#facc15" },
];

function FlipCards() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-retro text-3xl font-black uppercase md:text-5xl">
          Case files <span className="text-sm text-white/40 md:text-base">(click to flip)</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {CAMPAIGNS.map((c, i) => (
            <FlipCard key={c.title} campaign={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ campaign, index }: { campaign: (typeof CAMPAIGNS)[number]; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 60, rotateY: -60 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay: index * 0.15 }}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="h-80 w-full text-left [perspective:1200px]"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 13 }}
        className="relative size-full [transform-style:preserve-3d]"
      >
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border-2 bg-black/60 p-8 [backface-visibility:hidden]"
          style={{ borderColor: campaign.color, boxShadow: `0 0 40px -10px ${campaign.color}, inset 0 0 40px -20px ${campaign.color}` }}
        >
          <span className="neon-text text-7xl" style={{ color: campaign.color }}>
            {campaign.glyph}
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Case 0{index + 1}</p>
            <h3 className="font-retro text-2xl font-bold">{campaign.title}</h3>
          </div>
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-center rounded-2xl p-8 text-black [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ background: `linear-gradient(135deg, ${campaign.color}, #fff)` }}
        >
          <p className="font-retro text-6xl font-black">{campaign.stat}</p>
          <p className="mt-4 text-sm font-medium">{campaign.detail}</p>
        </div>
      </motion.div>
    </motion.button>
  );
}

function HoldToLaunch() {
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [scope, animateScope] = useAnimate();
  const [launched, setLaunched] = useState(false);

  const scale = useTransform(progress, [0, 1], [1, 1.18]);
  const jitter = useTransform(progress, (p) => (Math.random() - 0.5) * p * 10);
  const glow = useTransform(progress, (p) => `0 0 ${20 + p * 120}px ${p * 30}px rgba(255,43,214,${0.3 + p * 0.5})`);

  const launch = () => {
    setLaunched(true);
    const el = buttonRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      burst(cx, cy, { colors: NEON, count: 260, power: 24, shapes: ["star", "rect"] });
      setTimeout(() => burst(cx - 200, cy - 80, { colors: NEON, count: 120, power: 14 }), 220);
      setTimeout(() => burst(cx + 200, cy - 80, { colors: NEON, count: 120, power: 14 }), 420);
    }
    animateScope(scope.current, { x: [0, -18, 15, -12, 9, -5, 2, 0], y: [0, 8, -10, 6, -4, 2, 0] }, { duration: 0.6 });
    setTimeout(() => {
      setLaunched(false);
      animate(progress, 0, { duration: 0.6 });
    }, 3000);
  };

  const start = () => {
    if (launched) return;
    controls.current?.stop();
    controls.current = animate(progress, 1, {
      duration: 1.6 * (1 - progress.get()),
      ease: "easeIn",
      onComplete: launch,
    });
  };

  const cancel = () => {
    if (launched || progress.get() >= 1) return;
    controls.current?.stop();
    controls.current = animate(progress, 0, { type: "spring", stiffness: 200, damping: 20 });
  };

  return (
    <section ref={scope} className="relative overflow-hidden px-4 py-40 text-center">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(255,43,214,0.35),transparent_70%)]" />
      <h2 className="relative mb-4 font-retro text-4xl font-black uppercase md:text-6xl">Ready?</h2>
      <p className="relative mb-16 text-white/50">Press and hold. Don&apos;t let go.</p>
      <Magnetic strength={0.2}>
        <motion.button
          ref={buttonRef}
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !e.repeat && start()}
          onKeyUp={cancel}
          style={{ scale, x: jitter, boxShadow: glow }}
          className="relative grid size-52 touch-none select-none place-items-center rounded-full bg-[#14002a]"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#launch-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
            <defs>
              <linearGradient id="launch-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff2bd6" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <span className={cn("font-retro text-sm font-black uppercase tracking-[0.25em]", launched ? "gradient-text text-lg" : "text-fuchsia-200")}>
            {launched ? "Launched ✦" : "Hold to launch"}
          </span>
        </motion.button>
      </Magnetic>
    </section>
  );
}
