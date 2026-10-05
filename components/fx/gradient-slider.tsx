"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/** A native range input (for a11y and touch) layered invisibly over an animated custom track. */
export function GradientSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => String(Math.round(v)),
  gradient = "linear-gradient(90deg,#ff2bd6,#7c3aed,#22d3ee)",
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  gradient?: string;
  className?: string;
}) {
  const id = useId();
  const [active, setActive] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
        <label htmlFor={id} className="font-medium opacity-80">
          {label}
        </label>
        <span className="font-mono tabular-nums opacity-90">{format(value)}</span>
      </div>
      <div className="relative h-9">
        <div className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-current/10" />
        <div
          className="absolute left-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full"
          style={{ width: `${pct}%`, background: gradient, boxShadow: active ? "0 0 24px 2px rgba(255,255,255,0.35)" : "none" }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
          style={{ left: `${pct}%`, background: gradient }}
          animate={{ scale: active ? 1.45 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: 1, y: -30, scale: 0.7 }}
                exit={{ opacity: 0, y: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2 py-1 font-mono text-xs text-white"
              >
                {format(value)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerDown={() => {
            setActive(true);
            window.addEventListener("pointerup", () => setActive(false), { once: true });
          }}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className="absolute inset-0 w-full opacity-0"
        />
      </div>
    </div>
  );
}
