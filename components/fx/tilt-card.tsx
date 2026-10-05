"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 200, damping: 18 };

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [16, -16]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-16, 16]), SPRING);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 55%)`;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03 }}
      className={cn("conic-border group relative rounded-3xl p-[1.5px]", className)}
    >
      <div className="relative h-full rounded-[calc(1.5rem-1.5px)] bg-[#0c0418]/95 p-8 [transform-style:preserve-3d]">
        {children}
      </div>
      <motion.div
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.div>
  );
}
