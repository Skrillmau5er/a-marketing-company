"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Counter } from "@/components/fx/counter";
import { GradientSlider } from "@/components/fx/gradient-slider";
import { Magnetic } from "@/components/fx/magnetic";
import { RainbowButton } from "@/components/fx/rainbow-button";
import { ScrollReveal } from "@/components/fx/scroll-reveal";
import { SparkTrail } from "@/components/fx/spark-trail";
import { SplitText } from "@/components/fx/split-text";
import { TiltCard } from "@/components/fx/tilt-card";
import { Typewriter } from "@/components/fx/typewriter";
import { VelocityMarquee } from "@/components/fx/velocity-marquee";
import { burstFrom } from "@/lib/burst";
import { pendo } from "@/lib/pendo";
import { cn } from "@/lib/utils";

const WORDS = ["unforgettable.", "electric.", "go viral.", "iconic.", "glow."] as const;

export function AuroraPage() {
  return (
    <main className="relative bg-[#06010f] text-white">
      <SparkTrail />
      <Hero />
      <LogoMarquee />
      <Manifesto />
      <Services />
      <Stats />
      <PricingLab />
      <ContactCTA />
      <Footer />
    </main>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const nx = useSpring(0, { stiffness: 50, damping: 20 });
  const ny = useSpring(0, { stiffness: 50, damping: 20 });
  const blobX = useTransform(nx, (v) => v * -80);
  const blobY = useTransform(ny, (v) => v * -80);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(217,70,239,0.22), transparent 70%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const contentBlur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(12px)"]);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
        nx.set((e.clientX - r.left) / r.width - 0.5);
        ny.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 pb-16 pt-28"
    >
      <motion.div style={{ x: blobX, y: blobY }} className="absolute inset-[-15%]">
        <div className="aurora-blob left-[5%] top-[10%] bg-fuchsia-600 [animation-duration:18s]" />
        <div className="aurora-blob right-0 top-0 bg-cyan-500 [animation-delay:-6s] [animation-duration:22s]" />
        <div className="aurora-blob bottom-0 left-[25%] bg-violet-700 [animation-delay:-12s] [animation-duration:26s]" />
        <div className="aurora-blob bottom-[10%] right-[15%] bg-amber-400/80 [animation-delay:-3s] [animation-duration:20s]" />
      </motion.div>
      <div className="dot-grid absolute inset-0 opacity-50" />
      <motion.div style={{ background: spotlight }} className="absolute inset-0" />
      <div className="noise absolute inset-0" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale, filter: contentBlur }}
        className="relative z-10 mx-auto max-w-7xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.7 }}
          className="shimmer mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-fuchsia-400" />
          </span>
          Now booking campaigns for 2027
        </motion.div>

        <h1 className="font-display text-[clamp(2.1rem,8.5vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight">
          <SplitText text="We make brands" delay={0.8} onMount />
          <span className="mt-2 block whitespace-nowrap text-[clamp(1.5rem,7.5vw,7.5rem)]">
            <Typewriter words={WORDS} startDelay={1500} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-lg text-white/65"
        >
          An unreasonably animated marketing studio. We turn quiet products into brands people screenshot, share and
          can&apos;t stop talking about.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <RainbowButton onClick={(e) => burstFrom(e.currentTarget, { count: 200 })}>
              Start a project <span className="transition-transform group-hover:translate-x-1">→</span>
            </RainbowButton>
          </Magnetic>
          <Magnetic>
            <a
              href="#services"
              className="inline-flex rounded-full border border-white/20 px-8 py-4 font-semibold text-white/90 backdrop-blur transition-colors hover:border-white/60 hover:bg-white/10"
            >
              See what we do
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 flex h-10 w-6 -translate-x-1/2 justify-center rounded-full border-2 border-white/30 pt-2"
      >
        <motion.span
          animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-2 w-1 rounded-full bg-white"
        />
      </motion.div>
    </section>
  );
}

const BRANDS = ["Nebula Foods", "Quantum Socks", "Glitter Bank", "Moonshot Tea", "Pixel Dairy", "Lumen Air", "Hyperloop Pets"];

function LogoMarquee() {
  return (
    <section className="relative z-10 space-y-6 border-y border-white/10 bg-black/30 py-10 backdrop-blur">
      <VelocityMarquee baseVelocity={-2.5}>
        {BRANDS.map((brand, i) => (
          <span
            key={brand}
            className={cn(
              "mx-8 flex items-center gap-3 text-2xl font-bold text-white/50 transition-colors hover:text-white md:text-3xl",
              i % 2 ? "font-display" : "font-mono tracking-tighter",
            )}
          >
            <span className="gradient-text text-3xl">✦</span>
            {brand}
          </span>
        ))}
      </VelocityMarquee>
      <VelocityMarquee baseVelocity={3}>
        {["STRATEGY", "DESIGN", "MOTION", "VIRALITY", "MAGIC"].map((word) => (
          <span key={word} className="text-stroke mx-6 font-display text-6xl font-extrabold md:text-8xl">
            {word} <span className="gradient-text [-webkit-text-stroke:0]">✺</span>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-40">
      <p className="mb-10 font-mono text-sm uppercase tracking-[0.3em] text-fuchsia-300/80">( Manifesto )</p>
      <ScrollReveal
        className="font-display text-[clamp(1.8rem,4.5vw,4rem)] font-bold leading-[1.1]"
        text="We believe marketing should feel like a *fireworks* show inside a cathedral — loud, *luminous*, and impossible to scroll past. Every pixel moves with *intent*."
      />
    </section>
  );
}

const SERVICES = [
  {
    glyph: "✺",
    title: "Brand Alchemy",
    body: "Names, identities and design systems forged in a particle accelerator of ideas.",
    color: "from-fuchsia-500 to-violet-600",
  },
  {
    glyph: "◎",
    title: "Viral Engineering",
    body: "Campaigns with a measurable blast radius. We test, iterate and amplify what spreads.",
    color: "from-cyan-400 to-blue-600",
  },
  {
    glyph: "⚡",
    title: "Experience Design",
    body: "Websites and products so smooth people refresh them just to watch them load.",
    color: "from-amber-300 to-rose-500",
  },
];

function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <h2 className="mb-16 text-center font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none">
        <SplitText text="What we unleash" />
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 80, rotate: i % 2 ? 4 : -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 90, damping: 14, delay: i * 0.12 }}
          >
            <TiltCard className="h-full">
              <div
                className={cn(
                  "mb-8 grid size-16 place-items-center rounded-2xl bg-gradient-to-br text-3xl shadow-[0_0_40px_-6px_rgba(255,43,214,0.7)] [transform:translateZ(60px)]",
                  s.color,
                )}
              >
                {s.glyph}
              </div>
              <h3 className="mb-3 font-display text-2xl font-bold [transform:translateZ(40px)]">{s.title}</h3>
              <p className="text-white/60 [transform:translateZ(20px)]">{s.body}</p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const STATS = [
  { to: 312, suffix: "%", label: "Average engagement lift" },
  { to: 48, suffix: "M", label: "Impressions last quarter" },
  { to: 97, suffix: "", label: "Shiny awards on a shelf" },
  { to: 4.9, suffix: "★", label: "Client happiness", decimals: 1 },
];

function Stats() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-[#08020f] p-8 text-center md:p-10">
            <Counter
              to={s.to}
              suffix={s.suffix}
              decimals={s.decimals}
              className="gradient-text block font-display text-5xl font-extrabold tabular-nums md:text-6xl"
            />
            <p className="mt-3 text-sm text-white/55">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const CHANNELS = [
  { id: "social", label: "Social", emoji: "📱", cost: 1200 },
  { id: "video", label: "Video", emoji: "🎬", cost: 3400 },
  { id: "ooh", label: "Billboards", emoji: "🏙️", cost: 2600 },
  { id: "influencers", label: "Influencers", emoji: "✨", cost: 4100 },
  { id: "ar", label: "AR Filters", emoji: "🕶️", cost: 1900 },
  { id: "blimp", label: "Literal Blimp", emoji: "🎈", cost: 9999 },
];

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

const INTENSITY_LABELS = ["Polite", "Bold", "Loud", "Unhinged"];
const intensityLabel = (v: number) => INTENSITY_LABELS[Math.min(3, Math.floor(v / 25))];

// Pendo: the last pricing estimate tracked this session. Module-level so a remount doesn't re-send it,
// and so a contact form lead can carry the visitor's budget signal.
let trackedEstimate: { signature: string; price: number; billingCycle: string } | null = null;

function PricingLab() {
  const [reach, setReach] = useState(45);
  const [intensity, setIntensity] = useState(60);
  const [channels, setChannels] = useState<string[]>(["social", "video"]);
  const [yearly, setYearly] = useState(false);

  const audience = Math.round(10 ** (3 + (reach / 100) * 4));
  const channelCost = CHANNELS.filter((c) => channels.includes(c.id)).reduce((sum, c) => sum + c.cost, 0);
  const monthly = 900 + reach * 60 + intensity * 30 + channelCost;
  const price = yearly ? monthly * 0.8 : monthly;
  const hype = Math.min(100, Math.round(reach * 0.4 + intensity * 0.35 + channels.length * 5));

  const priceMV = useSpring(price, { stiffness: 90, damping: 20 });
  const priceText = useTransform(priceMV, (v) => `$${Math.round(v).toLocaleString("en-US")}`);
  const hue = useSpring(260, { stiffness: 60, damping: 20 });
  const hue2 = useTransform(hue, (h) => h + 80);
  const glow = useMotionTemplate`radial-gradient(circle at 30% 20%, hsl(${hue} 95% 55% / 0.35), transparent 60%), radial-gradient(circle at 85% 90%, hsl(${hue2} 95% 55% / 0.3), transparent 55%)`;

  useEffect(() => {
    priceMV.set(price);
  }, [price, priceMV]);
  useEffect(() => {
    hue.set(260 + reach * 1.4 + intensity * 0.6);
  }, [reach, intensity, hue]);

  // Pendo: channels in CHANNELS order, so the same selection always reports the same value.
  const channelIds = CHANNELS.filter((c) => channels.includes(c.id)).map((c) => c.id).join(",");
  const billingCycle = yearly ? "yearly" : "monthly";
  const signature = `${reach}|${intensity}|${channelIds}|${billingCycle}`;
  // The configuration the lab mounted with. The visitor hasn't touched anything yet, so it isn't tracked.
  const [untouched] = useState(signature);

  const trackEstimate = useEffectEvent(() => {
    trackedEstimate = { signature, price: Math.round(price), billingCycle };
    pendo.track("pricing_estimate_configured", {
      reach,
      audience,
      intensity,
      intensity_label: intensityLabel(intensity),
      channels: channelIds,
      channel_count: channels.length,
      channel_cost: channelCost,
      billing_cycle: billingCycle,
      monthly_price: monthly,
      price: Math.round(price),
      hype,
    });
  });

  // Pendo: sliders fire onChange on every step, so wait until the visitor settles (1.5s after the last change).
  // The untouched defaults and a repeat of the last tracked configuration aren't sent.
  useEffect(() => {
    if (signature === untouched || signature === trackedEstimate?.signature) return;
    const timer = setTimeout(() => trackEstimate(), 1500);
    return () => clearTimeout(timer);
  }, [signature, untouched]);

  const toggle = (id: string) => setChannels((cs) => (cs.includes(id) ? cs.filter((c) => c !== id) : [...cs, id]));

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-cyan-300/80">( Interactive )</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none">
            <SplitText text="Build your blast radius" />
          </h2>
        </div>

        <motion.div
          style={{ background: glow }}
          className="grid gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:grid-cols-[1.2fr_1fr] md:p-12"
        >
          <div className="space-y-10">
            <GradientSlider
              label="Audience reach"
              value={reach}
              min={0}
              max={100}
              onChange={setReach}
              format={() => `${compact.format(audience)} people`}
            />
            <GradientSlider
              label="Intensity"
              value={intensity}
              min={0}
              max={100}
              onChange={setIntensity}
              format={intensityLabel}
              gradient="linear-gradient(90deg,#facc15,#fb7185,#ff2bd6)"
            />

            <div>
              <p className="mb-3 text-sm font-medium text-white/80">Channels</p>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((c) => {
                  const on = channels.includes(c.id);
                  return (
                    <motion.button
                      key={c.id}
                      onClick={() => toggle(c.id)}
                      whileTap={{ scale: 0.85 }}
                      layout
                      className={cn(
                        "relative flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm transition-colors",
                        on ? "border-transparent text-white" : "border-white/15 text-white/60 hover:text-white",
                      )}
                    >
                      <AnimatePresence>
                        {on && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500"
                          />
                        )}
                      </AnimatePresence>
                      <motion.span
                        className="relative"
                        animate={on ? { rotate: [0, -25, 25, -10, 0], scale: [1, 1.5, 1] } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {c.emoji}
                      </motion.span>
                      <span className="relative">{c.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="inline-flex rounded-full border border-white/15 bg-black/30 p-1">
              {(["Monthly", "Yearly"] as const).map((label) => {
                const active = (label === "Yearly") === yearly;
                return (
                  <button
                    key={label}
                    onClick={() => setYearly(label === "Yearly")}
                    className={cn("relative rounded-full px-5 py-2 text-sm font-medium", active ? "text-black" : "text-white/70")}
                  >
                    {active && (
                      <motion.span
                        layoutId="billing-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">
                      {label}
                      {label === "Yearly" && <span className="ml-1 text-xs text-fuchsia-500">-20%</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/40 p-8 text-center">
            <div className="relative mb-6 grid size-48 place-items-center">
              <motion.div
                animate={{ scale: 0.55 + reach / 160, rotate: 360 }}
                transition={{
                  scale: { type: "spring", stiffness: 120, damping: 10 },
                  rotate: { duration: 12 - intensity / 12, repeat: Infinity, ease: "linear" },
                }}
                className="conic-border morph-shape absolute inset-0 blur-[2px]"
                style={{ boxShadow: `0 0 ${30 + intensity}px ${intensity / 6}px rgba(255,43,214,0.5)` }}
              />
              <div className="relative font-display text-xs uppercase tracking-[0.25em] text-white/90 mix-blend-difference">
                Hype {hype}%
              </div>
            </div>
            <motion.div className="font-display text-6xl font-extrabold tabular-nums">{priceText}</motion.div>
            <p className="mt-1 text-sm text-white/50">per month{yearly && ", billed yearly"}</p>
            <div className="mt-6 flex h-12 w-full items-end gap-1">
              {Array.from({ length: 24 }, (_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-fuchsia-600 to-cyan-400"
                  animate={{ height: `${Math.max(8, Math.min(100, hype * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7)))))}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: i * 0.015 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactCTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const headline = "Let's make noise.";

  return (
    <section className="relative overflow-hidden px-6 py-40 text-center">
      <div className="aurora-blob left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-700/60" />
      <h2 className="relative font-display text-[clamp(3rem,11vw,10rem)] font-extrabold leading-none tracking-tight">
        {[...headline].map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            whileHover={{
              y: -30,
              rotate: ((i * 37) % 50) - 25,
              scale: 1.3,
              color: `hsl(${(i * 47) % 360} 100% 65%)`,
              transition: { type: "spring", stiffness: 500, damping: 10 },
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </h2>
      <p className="relative mx-auto mt-6 max-w-md text-white/60">Hover the letters. Then leave your email and we&apos;ll bring the fireworks.</p>

      <div className="relative mx-auto mt-12 h-16 max-w-lg">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.6, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="gradient-text flex h-full items-center justify-center font-display text-2xl font-bold"
            >
              You&apos;re on the list ✦ (this is a demo)
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
              onSubmit={(e) => {
                e.preventDefault();
                const button = e.currentTarget.querySelector("button");
                if (button) burstFrom(button, { count: 260, power: 18 });
                setSent(true);
                // Pendo: the site's only lead capture, and nothing is sent to a server, so this is the sole record of it.
                // Sends the email's domain, never the address.
                const at = email.lastIndexOf("@");
                pendo.track("contact_form_submitted", {
                  email_domain: at === -1 ? "" : email.slice(at + 1).trim().toLowerCase(),
                  form_location: "aurora_contact_cta",
                  ...(trackedEstimate && {
                    estimate_price: trackedEstimate.price,
                    estimate_billing_cycle: trackedEstimate.billingCycle,
                  }),
                });
              }}
              className="conic-border flex h-full rounded-full p-[2px]"
            >
              <div className="flex flex-1 rounded-full bg-[#0b0217]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInvalid={(e) => {
                    // Pendo: native validation blocked the submit, so onSubmit never runs. Sends the length, never the value.
                    const { validity, value } = e.currentTarget;
                    pendo.track("contact_form_validation_failed", {
                      error_type: validity.valueMissing ? "value_missing" : validity.typeMismatch ? "type_mismatch" : "other",
                      input_length: value.length,
                      form_location: "aurora_contact_cta",
                    });
                  }}
                  placeholder="you@yourbrand.com"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent px-6 text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="m-1.5 rounded-full bg-white px-6 font-semibold text-black transition-transform hover:scale-105 active:scale-95"
                >
                  Let&apos;s go
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/40 md:flex-row">
        <span className="font-display text-lg font-bold text-white">
          A Marketing Company<span className="gradient-text">✦</span>
        </span>
        <span>© 2026 — Built with an irresponsible amount of easing curves.</span>
      </div>
    </footer>
  );
}
