"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Aurora", gradient: "linear-gradient(120deg,#ff2bd6,#7c3aed,#22d3ee)" },
  { href: "/synthwave", label: "Synthwave", gradient: "linear-gradient(120deg,#ff2e88,#ff9a3c,#ffe66d)" },
  { href: "/bloom", label: "Bloom", gradient: "linear-gradient(120deg,#ff9ecd,#c9a7ff,#9ee6ff)" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-4 z-[70] flex justify-center px-4">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.9 }}
        className="flex items-center gap-1 rounded-full border border-white/15 bg-black/45 p-1.5 shadow-[0_8px_40px_-8px_rgba(124,58,237,0.6)] backdrop-blur-xl"
      >
        <Link href="/" className="px-3 font-display text-lg font-extrabold tracking-tight text-white">
          AMC<span className="gradient-text">✦</span>
        </Link>
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                active ? "text-white" : "text-white/65 hover:text-white",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: link.gradient }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative drop-shadow">{link.label}</span>
            </Link>
          );
        })}
      </motion.nav>
    </header>
  );
}
