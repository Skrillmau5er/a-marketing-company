"use client";

import { motion } from "motion/react";

const CURTAIN = ["#ff2bd6", "#7c3aed", "#22d3ee", "#facc15", "#34d399"];
const EASE = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[80] flex">
        {CURTAIN.map((color, i) => (
          <motion.div
            key={color}
            className="h-full flex-1 origin-top"
            style={{ background: color }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.05 + i * 0.07 }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
