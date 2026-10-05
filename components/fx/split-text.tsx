"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SplitText({
  text,
  className,
  charClassName,
  delay = 0,
  stagger = 0.035,
  onMount = false,
}: {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate immediately instead of waiting to scroll into view. */
  onMount?: boolean;
}) {
  let index = 0;
  const shown = { y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)" };

  return (
    <span className={cn("inline-block [perspective:800px]", className)}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className={cn("inline-block origin-bottom", charClassName)}
                initial={{ y: "100%", rotateX: -100, opacity: 0, filter: "blur(10px)" }}
                animate={onMount ? shown : undefined}
                whileInView={onMount ? undefined : shown}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ type: "spring", stiffness: 140, damping: 14, delay: delay + i * stagger }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
