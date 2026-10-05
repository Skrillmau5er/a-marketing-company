"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Typewriter({
  words,
  typeSpeed = 75,
  deleteSpeed = 35,
  pause = 1600,
  startDelay = 0,
  className,
}: {
  words: readonly string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  startDelay?: number;
  className?: string;
}) {
  const [started, setStarted] = useState(startDelay === 0);
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (started) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [started, startDelay]);

  useEffect(() => {
    if (!started) return;
    const word = words[wordIndex % words.length];
    const finishedTyping = !deleting && text === word;
    const delay = finishedTyping ? pause : deleting ? deleteSpeed : typeSpeed;

    const t = setTimeout(() => {
      if (finishedTyping) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => i + 1);
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [started, text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="hue-cycle">
        {[...text].map((ch, i) => {
          const hue = (i * 26 + wordIndex * 70) % 360;
          return (
            <motion.span
              key={`${wordIndex}-${i}`}
              className="inline-block whitespace-pre"
              style={{ color: `hsl(${hue} 100% 66%)`, textShadow: `0 0 40px hsl(${hue} 100% 60% / 0.55)` }}
              initial={{ opacity: 0, y: "0.4em", scale: 0.3, rotate: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              {ch}
            </motion.span>
          );
        })}
      </span>
      <span aria-hidden className="caret ml-2 inline-block h-[0.85em] w-[0.08em] translate-y-[0.1em] rounded-full bg-white" />
    </span>
  );
}
