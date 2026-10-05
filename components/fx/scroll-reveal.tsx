"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Words light up one by one as the paragraph scrolls through the viewport. Wrap a word in *asterisks* to highlight it. */
export function ScrollReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [18, 0]);
  const blur = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);
  const highlighted = children.startsWith("*");

  return (
    <motion.span style={{ opacity, y, filter: blur }} className="mr-[0.25em] inline-block">
      <span className={cn(highlighted && "gradient-text")}>{children.replaceAll("*", "")}</span>
    </motion.span>
  );
}
