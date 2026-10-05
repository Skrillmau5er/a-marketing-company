"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const INTERACTIVE = "a, button, input, textarea, label, [role='slider'], [data-cursor]";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.6 });
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHovering(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block">
      <motion.div style={{ x, y }} className="absolute -left-1 -top-1 size-2 rounded-full bg-white" />
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ scale: pressed ? 0.6 : hovering ? 2.2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute -left-5 -top-5 size-10 rounded-full border-2 border-white"
      />
    </div>
  );
}
