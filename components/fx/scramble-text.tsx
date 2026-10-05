"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#@$%&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Decodes from random glyphs into the real text on mount and again on hover. */
export function ScrambleText({ text, className, duration = 1100 }: { text: string; className?: string; duration?: number }) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  const scramble = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(progress * text.length);
      setDisplay(
        [...text]
          .map((ch, i) => (i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    scramble();
    return () => cancelAnimationFrame(frame.current);
  }, [scramble]);

  return (
    <span className={className} onPointerEnter={scramble}>
      {display}
    </span>
  );
}
