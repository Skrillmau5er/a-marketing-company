"use client";

import {
  animate,
  AnimatePresence,
  motion,
  type MotionValue,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/fx/magnetic";
import { burstFrom } from "@/lib/burst";
import { pendo } from "@/lib/pendo";
import { clamp, cn } from "@/lib/utils";

const PASTELS = ["#ff9ecd", "#ffc59e", "#c9a7ff", "#9ee6ff", "#a7f3c9", "#ffe58f"];
const INKS = ["#e0457b", "#f07b2c", "#7c4ddb", "#1b9cc4", "#22a06b", "#d49b00"];

export function BloomPage() {
  return (
    <main className="relative min-h-svh bg-[#fff6ee] text-[#2b1a2e]">
      <GooHero />
      <NameLab />
      <PaletteStudio />
      <HorizontalGallery />
      <BeforeAfter />
      <FAQ />
      <BloomFooter />
    </main>
  );
}

function GooHero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lastMove = useRef(0);

  useAnimationFrame((t) => {
    const el = ref.current;
    if (!el || performance.now() - lastMove.current < 2500) return;
    mx.set(el.clientWidth / 2 + Math.sin(t / 1400) * el.clientWidth * 0.3);
    my.set(el.clientHeight / 2 + Math.sin(t / 900) * el.clientHeight * 0.22);
  });

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        lastMove.current = performance.now();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 pt-24"
    >
      <svg className="absolute size-0" aria-hidden>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -11" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      <div className="absolute inset-0 [filter:url(#goo)]">
        <div className="morph absolute left-[8%] top-[18%] size-64 bg-[#ffc59e]" />
        <div className="morph absolute right-[10%] top-[12%] size-80 bg-[#c9a7ff] [animation-delay:-4s]" />
        <div className="morph absolute bottom-[8%] left-[22%] size-72 bg-[#9ee6ff] [animation-delay:-7s]" />
        <div className="morph absolute bottom-[14%] right-[18%] size-56 bg-[#a7f3c9] [animation-delay:-2s]" />
        {PASTELS.map((color, i) => (
          <Follower key={color} mx={mx} my={my} index={i} color={color} />
        ))}
      </div>
      <div className="absolute inset-0 bg-[#fff6ee]/35 backdrop-blur-[2px]" />

      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 inline-block rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur"
        >
          🌸 Brand identity, grown organically
        </motion.p>
        <h1 className="font-soft text-[clamp(3rem,10vw,8.5rem)] font-light leading-[0.95] tracking-tight">
          <BouncyText text="Grow something" delay={0.7} />
          <br />
          <BouncyText text="beautiful." delay={1.1} italic colorful />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mx-auto mt-8 max-w-md text-lg text-[#2b1a2e]/65"
        >
          Move your cursor through the garden. Hover the letters. Everything here is soft and a little alive.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2, type: "spring" }} className="mt-10">
          <Magnetic>
            <SeedButton>Plant a seed 🌱</SeedButton>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

function Follower({ mx, my, index, color }: { mx: MotionValue<number>; my: MotionValue<number>; index: number; color: string }) {
  const spring = { stiffness: 260 - index * 36, damping: 18 + index * 2, mass: 0.6 + index * 0.25 };
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);
  const size = 140 - index * 16;

  return (
    <motion.div
      style={{ x, y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, background: color }}
      className="absolute left-0 top-0 rounded-full"
    />
  );
}

function BouncyText({ text, delay = 0, italic = false, colorful = false }: { text: string; delay?: number; italic?: boolean; colorful?: boolean }) {
  let index = 0;

  return (
    <span className={cn("inline-block", italic && "italic")}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {wi > 0 && "\u00A0"}
          {[...word].map((ch) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                style={colorful ? { color: INKS[i % INKS.length] } : undefined}
                initial={{ y: 90, opacity: 0, rotate: 14, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 11, delay: delay + i * 0.045 }}
                whileHover={{
                  y: -22,
                  scale: 1.2,
                  rotate: i % 2 ? -10 : 10,
                  transition: { type: "spring", stiffness: 500, damping: 8 },
                }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

function SeedButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9, rotate: -3 }}
      onClick={(e) =>
        burstFrom(e.currentTarget, { colors: [...PASTELS, ...INKS], shapes: ["petal", "circle"], count: 180, gravity: 0.12, power: 13, size: 12 })
      }
      className={cn(
        "rounded-full bg-[#2b1a2e] px-9 py-4 text-lg font-semibold text-[#fff6ee] shadow-[0_12px_40px_-10px_rgba(224,69,123,0.7)]",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

const TAGLINES = ["bloom loudly.", "soft power, hard results.", "grown, not made.", "petal to the metal.", "naturally irresistible."];
const DEFAULT_BRAND = "Bloom & Co";

// Pendo: the last brand name tracked this session (module-level so a remount doesn't re-send it).
let lastTrackedBrand = "";

function NameLab() {
  const [name, setName] = useState(DEFAULT_BRAND);
  const wasTruncated = useRef(false);
  const tagline = TAGLINES[name.length % TAGLINES.length];

  // Pendo: onChange fires on every keystroke, so wait until typing stops (1.5s). Empty input, the default name and a
  // repeat of the last tracked name aren't sent.
  useEffect(() => {
    const brand = name.trim();
    if (!brand || brand === DEFAULT_BRAND || brand === lastTrackedBrand) return;
    const timer = setTimeout(() => {
      lastTrackedBrand = brand;
      pendo.track("brand_name_previewed", {
        brand_name: brand,
        name_length: brand.length,
        tagline,
        was_truncated: wasTruncated.current,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [name, tagline]);

  return (
    <section className="relative px-6 py-32 text-center">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[#e0457b]">( Type something )</p>
      <h2 className="font-soft text-4xl font-medium md:text-6xl">
        Type your brand. <em className="text-[#7c4ddb]">Watch it bloom.</em>
      </h2>
      <div className="mx-auto mt-10 max-w-md">
        <input
          value={name}
          onChange={(e) => {
            wasTruncated.current = e.target.value.length > 16;
            setName(e.target.value.slice(0, 16));
          }}
          placeholder="Your brand name"
          aria-label="Brand name"
          className="w-full rounded-full border-2 border-[#2b1a2e]/10 bg-white px-7 py-4 text-center text-xl shadow-[0_10px_40px_-15px_rgba(124,77,219,0.5)] outline-none transition-[border-color,box-shadow] focus:border-[#c9a7ff] focus:shadow-[0_0_0_8px_rgba(201,167,255,0.3)]"
        />
      </div>
      <div className="mt-14 flex min-h-[1.1em] flex-wrap justify-center font-soft text-[clamp(3rem,11vw,9rem)] font-black leading-none">
        <AnimatePresence mode="popLayout">
          {[...name].map((ch, i) => (
            <motion.span
              key={`${i}-${ch}`}
              layout
              initial={{ opacity: 0, scale: 0, rotate: ((i * 53) % 80) - 40, y: -80 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 90, rotate: 40 }}
              transition={{ type: "spring", stiffness: 380, damping: 15 }}
              whileHover={{ scale: 1.25, rotate: -8, transition: { type: "spring", stiffness: 600, damping: 10 } }}
              className="inline-block"
              style={{ color: INKS[i % INKS.length], textShadow: `0 10px 30px ${PASTELS[i % PASTELS.length]}` }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={tagline}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
          className="mt-6 font-soft text-2xl italic text-[#2b1a2e]/60"
        >
          {name.trim() || "Your brand"} — {tagline}
        </motion.p>
      </AnimatePresence>
    </section>
  );
}

const PALETTES = [
  { name: "Sorbet", bg: "linear-gradient(135deg,#ffd1e8,#ffe9c7 50%,#d6f5ff)", primary: "#e0457b", secondary: "#f07b2c", ink: "#3a1530", card: "rgba(255,255,255,0.75)" },
  { name: "Lagoon", bg: "linear-gradient(135deg,#c6f7ef,#bfe3ff 50%,#e2d6ff)", primary: "#0f8fa8", secondary: "#5b5bd6", ink: "#0b2a33", card: "rgba(255,255,255,0.7)" },
  { name: "Matcha", bg: "linear-gradient(135deg,#e6f5d0,#fdf6d8 50%,#d0f0e0)", primary: "#3f7d3a", secondary: "#c08a1e", ink: "#1f2b16", card: "rgba(255,255,255,0.7)" },
  { name: "Lavender", bg: "linear-gradient(135deg,#efe1ff,#ffd9f1 50%,#d9e4ff)", primary: "#7c4ddb", secondary: "#d6407e", ink: "#2a1846", card: "rgba(255,255,255,0.7)" },
  { name: "Night Bloom", bg: "linear-gradient(135deg,#1b0f2e,#3b1450 50%,#0f2a3d)", primary: "#ff7eb6", secondary: "#7ee0ff", ink: "#fbeaff", card: "rgba(255,255,255,0.08)" },
];

function PaletteStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [reveal, setReveal] = useState<{ index: number; x: number; y: number; key: number } | null>(null);
  const active = PALETTES[reveal?.index ?? current];

  const choose = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const section = sectionRef.current;
    if (!section || index === (reveal?.index ?? current)) return;
    if (reveal) setCurrent(reveal.index);
    const s = section.getBoundingClientRect();
    const b = e.currentTarget.getBoundingClientRect();
    setReveal({ index, x: b.left + b.width / 2 - s.left, y: b.top + b.height / 2 - s.top, key: e.timeStamp });
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-28 transition-colors duration-1000" style={{ color: active.ink }}>
      <div className="absolute inset-0" style={{ background: PALETTES[current].bg }} />
      {reveal && (
        <motion.div
          key={reveal.key}
          className="absolute inset-0"
          style={{ background: PALETTES[reveal.index].bg }}
          initial={{ clipPath: `circle(0px at ${reveal.x}px ${reveal.y}px)` }}
          animate={{ clipPath: `circle(150vmax at ${reveal.x}px ${reveal.y}px)` }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => {
            setCurrent(reveal.index);
            setReveal(null);
          }}
        />
      )}

      <div className="relative mx-auto max-w-5xl">
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.3em] opacity-70">( Pick a palette )</p>
        <h2 className="text-center font-soft text-4xl font-medium md:text-6xl">Your brand, re-colored in a blink.</h2>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {PALETTES.map((p, i) => {
            const selected = (reveal?.index ?? current) === i;
            return (
              <button key={p.name} onClick={(e) => choose(i, e)} className="group relative flex flex-col items-center gap-2" aria-pressed={selected}>
                <span className="relative grid size-14 place-items-center">
                  {selected && (
                    <motion.span
                      layoutId="palette-ring"
                      className="absolute -inset-1.5 rounded-full border-2"
                      style={{ borderColor: active.ink }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <span
                    className="size-12 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45"
                    style={{ background: `conic-gradient(${p.primary}, ${p.secondary}, ${p.primary})` }}
                  />
                </span>
                <span className="text-xs font-medium opacity-80">{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl p-8 backdrop-blur transition-colors duration-700 md:col-span-2" style={{ background: active.card }}>
            <div className="mb-6 flex items-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="grid size-12 place-items-center rounded-2xl text-2xl"
                style={{ background: `linear-gradient(135deg, ${active.primary}, ${active.secondary})` }}
              >
                ✿
              </motion.span>
              <span className="font-soft text-2xl font-semibold">Petalworks</span>
            </div>
            <p className="mb-8 font-soft text-3xl leading-tight md:text-4xl">Skincare that feels like a slow Sunday morning.</p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full px-6 py-3 font-semibold text-white transition-colors duration-700" style={{ background: active.primary }}>
                Shop the ritual
              </span>
              <span className="rounded-full border-2 px-6 py-3 font-semibold transition-colors duration-700" style={{ borderColor: active.secondary, color: active.secondary }}>
                Our story
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { k: "Calm", v: "98%" },
              { k: "Glow", v: "+42%" },
            ].map((s) => (
              <div key={s.k} className="flex-1 rounded-3xl p-6 backdrop-blur transition-colors duration-700" style={{ background: active.card }}>
                <p className="text-sm opacity-70">{s.k}</p>
                <p className="font-soft text-5xl font-semibold transition-colors duration-700" style={{ color: active.primary }}>
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const WORK = [
  { n: "01", title: "Honeyfield", tag: "Organic snacks", emoji: "🍯", bg: "linear-gradient(135deg,#ffe58f,#ffc59e)" },
  { n: "02", title: "Tidepool", tag: "Ocean-safe sunscreen", emoji: "🐚", bg: "linear-gradient(135deg,#9ee6ff,#c9a7ff)" },
  { n: "03", title: "Mossy", tag: "Houseplant delivery", emoji: "🌿", bg: "linear-gradient(135deg,#a7f3c9,#e6f5d0)" },
  { n: "04", title: "Peachy Keen", tag: "Fintech for artists", emoji: "🍑", bg: "linear-gradient(135deg,#ffc59e,#ff9ecd)" },
  { n: "05", title: "Lull", tag: "Sleep sounds app", emoji: "🌙", bg: "linear-gradient(135deg,#c9a7ff,#ffd9f1)" },
];

function HorizontalGallery() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: ref });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const x = useTransform(() => -smooth.get() * distance.get());

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => distance.set(Math.max(0, track.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <section ref={ref} className="relative h-[400vh] bg-[#2b1a2e]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <h2 className="mb-10 px-[8vw] font-soft text-4xl font-medium text-[#fff6ee] md:text-6xl">
          Selected <em className="text-[#ff9ecd]">blooms</em>
        </h2>
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-8 px-[8vw]">
          {WORK.map((w, i) => (
            <WorkCard key={w.n} work={w} index={i} progress={smooth} />
          ))}
        </motion.div>
        <div className="mx-[8vw] mt-10 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div style={{ scaleX: smooth }} className="h-full origin-left bg-gradient-to-r from-[#ff9ecd] via-[#c9a7ff] to-[#9ee6ff]" />
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work, index, progress }: { work: (typeof WORK)[number]; index: number; progress: MotionValue<number> }) {
  const center = index / (WORK.length - 1);
  const rotate = useTransform(progress, [center - 0.4, center, center + 0.4], [6, 0, -6]);
  const emojiY = useTransform(progress, [center - 0.4, center + 0.4], [60, -60]);

  return (
    <motion.article
      style={{ rotate, background: work.bg }}
      whileHover={{ scale: 1.03, y: -10 }}
      className="relative flex h-[60vh] w-[78vw] shrink-0 flex-col justify-between overflow-hidden rounded-[2.5rem] p-8 text-[#2b1a2e] md:w-[42vw] md:p-12"
    >
      <span className="font-mono text-sm opacity-60">{work.n}</span>
      <motion.span style={{ y: emojiY }} className="absolute right-8 top-1/2 -translate-y-1/2 text-[min(30vw,12rem)] drop-shadow-xl">
        {work.emoji}
      </motion.span>
      <div className="relative">
        <h3 className="font-soft text-5xl font-semibold md:text-7xl">{work.title}</h3>
        <p className="mt-2 text-lg opacity-70">{work.tag}</p>
      </div>
    </motion.article>
  );
}

function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30% 0px" });
  const pct = useMotionValue(50);
  const smooth = useSpring(pct, { stiffness: 300, damping: 30 });
  const clip = useMotionTemplate`inset(0 0 0 ${smooth}%)`;
  const left = useMotionTemplate`${smooth}%`;
  const [ariaValue, setAriaValue] = useState(50);
  const dragging = useRef(false);

  useMotionValueEvent(pct, "change", (v) => setAriaValue(Math.round(v)));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(pct, [50, 78, 22, 50], { duration: 2.4, ease: "easeInOut", delay: 0.3 });
    return () => controls.stop();
  }, [inView, pct]);

  const update = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    pct.set(clamp(((clientX - r.left) / r.width) * 100, 0, 100));
  };

  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.3em] text-[#7c4ddb]">( Drag the handle )</p>
        <h2 className="mb-12 text-center font-soft text-4xl font-medium md:text-6xl">Before us. After us.</h2>
        <div
          ref={ref}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            update(e.clientX);
          }}
          onPointerMove={(e) => dragging.current && update(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          className="relative aspect-[16/9] touch-none select-none overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgba(43,26,46,0.5)]"
        >
          <div className="absolute inset-0 flex flex-col justify-center bg-[#d9d9d9] p-[6%] font-serif text-[#555]">
            <p className="text-xs uppercase tracking-widest">Before</p>
            <p className="mt-2 text-[clamp(1.5rem,4vw,3.5rem)]">Generic Corp.</p>
            <p className="mt-2 max-w-xs text-sm md:text-base">Solutions for your business needs. Contact us today.</p>
            <div className="mt-6 h-8 w-32 bg-[#bbb]" />
          </div>
          <motion.div
            style={{ clipPath: clip }}
            className="absolute inset-0 flex flex-col items-end justify-center overflow-hidden bg-[linear-gradient(135deg,#ffd1e8,#ffe9c7,#d6f5ff)] p-[6%] text-right"
          >
            <div className="morph absolute -left-10 top-10 size-64 bg-[#c9a7ff]/60 blur-2xl" />
            <div className="morph absolute bottom-0 right-1/3 size-72 bg-[#ff9ecd]/60 blur-2xl [animation-delay:-5s]" />
            <p className="relative text-xs uppercase tracking-widest text-[#e0457b]">After</p>
            <p className="relative mt-2 font-soft text-[clamp(1.8rem,5vw,4.5rem)] font-semibold italic text-[#2b1a2e]">Genie ✿</p>
            <p className="relative mt-2 max-w-xs font-soft text-sm text-[#2b1a2e]/70 md:text-lg">Wishes, granted on a Tuesday.</p>
            <span className="relative mt-6 rounded-full bg-[#2b1a2e] px-6 py-2 text-sm text-white">Make a wish →</span>
          </motion.div>
          <motion.div style={{ left }} className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
            <div
              role="slider"
              tabIndex={0}
              aria-label="Before and after comparison"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={ariaValue}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") pct.set(clamp(pct.get() - 5, 0, 100));
                if (e.key === "ArrowRight") pct.set(clamp(pct.get() + 5, 0, 100));
              }}
              className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-lg shadow-xl outline-none ring-[#c9a7ff] focus-visible:ring-4"
            >
              ⟷
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "How long does a rebrand take?", a: "Usually 6–10 weeks, from first seedling sketch to full bloom. Rush jobs are possible with extra sunlight (budget)." },
  { q: "Do you only do soft pastel stuff?", a: "Not at all — check the Aurora and Synthwave pages. We just like to show range." },
  { q: "Can you animate our existing brand?", a: "Absolutely. Motion systems, micro-interactions and launch films are some of our favorite projects." },
  { q: "Is this form real?", a: "Nope! This whole site is a demo of what we can build. But the vibes are very real." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-center font-soft text-4xl font-medium md:text-6xl">Questions, answered softly</h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                layout
                className={cn("overflow-hidden rounded-3xl transition-colors duration-500", isOpen ? "bg-white shadow-[0_20px_60px_-25px_rgba(124,77,219,0.45)]" : "bg-white/50")}
              >
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-6 text-left">
                  <span className="font-soft text-xl font-medium md:text-2xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 135 : 0, backgroundColor: isOpen ? "#ff9ecd" : "#f1e4f3" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="grid size-10 shrink-0 place-items-center rounded-full text-xl"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <p className="px-6 pb-6 text-[#2b1a2e]/70">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BloomFooter() {
  return (
    <footer className="relative overflow-hidden px-6 pb-16 pt-32 text-center">
      <div className="morph absolute -left-20 top-0 size-80 bg-[#ffc59e]/50 blur-3xl" />
      <div className="morph absolute -right-20 bottom-0 size-96 bg-[#c9a7ff]/50 blur-3xl [animation-delay:-6s]" />
      <h2 className="relative font-soft text-[clamp(3rem,9vw,7rem)] font-light leading-none">
        Let&apos;s grow <em className="text-[#e0457b]">together.</em>
      </h2>
      <div className="relative mt-10">
        <Magnetic>
          <SeedButton className="px-12 py-5 text-xl">Start blooming ✿</SeedButton>
        </Magnetic>
      </div>
      <p className="relative mt-20 text-sm text-[#2b1a2e]/50">© 2026 A Marketing Company — Bloom studio. No flowers were harmed.</p>
    </footer>
  );
}
