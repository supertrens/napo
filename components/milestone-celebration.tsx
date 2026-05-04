"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { formatMoney } from "@/lib/utils";

const MILESTONES: { amount: number; label: string }[] = [
  { amount: 1_000, label: "First $1K" },
  { amount: 10_000, label: "First $10K" },
  { amount: 50_000, label: "First $50K" },
  { amount: 100_000, label: "First $100K" },
  { amount: 250_000, label: "Quarter million" },
  { amount: 500_000, label: "Half a million" },
  { amount: 1_000_000, label: "First million" },
  { amount: 5_000_000, label: "Five million" },
  { amount: 10_000_000, label: "Eight figures" },
  { amount: 25_000_000, label: "Goal reached" },
];

function lastReached(total: number) {
  let last: (typeof MILESTONES)[number] | null = null;
  for (const m of MILESTONES) if (total >= m.amount) last = m;
  return last;
}

const STORAGE_KEY = "napo.lastMilestone";

export function MilestoneCelebration() {
  const totals = useQuery(api.pledges.totals);
  const total = totals?.totalAmount ?? 0;
  const [active, setActive] = useState<
    (typeof MILESTONES)[number] | null
  >(null);
  const seenRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    seenRef.current = stored ? parseInt(stored, 10) || 0 : 0;
  }, []);

  useEffect(() => {
    if (total <= 0) return;
    const reached = lastReached(total);
    if (!reached) return;
    if (seenRef.current !== null && reached.amount > seenRef.current) {
      setActive(reached);
      seenRef.current = reached.amount;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(reached.amount));
      } catch {
        /* ignore */
      }
      const t = setTimeout(() => setActive(null), 4500);
      return () => clearTimeout(t);
    }
  }, [total]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={active.amount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-haiti-gold/20 via-transparent to-haiti-red/15" />
          <Confetti />
          <motion.div
            initial={{ scale: 0.8, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="surface-elev relative max-w-[92vw] rounded-3xl px-9 py-8 text-center"
            style={{
              boxShadow:
                "0 60px 120px -20px rgba(5,7,26,0.8), 0 0 80px -10px rgba(217,179,103,0.55)",
            }}
          >
            <div className="text-[11px] uppercase tracking-[0.32em] text-foreground-dim">
              ✦ Milestone unlocked
            </div>
            <div className="mt-3 font-display display-italic gold-text text-5xl tracking-[-0.025em] sm:text-6xl">
              {formatMoney(active.amount, { compact: true })}
            </div>
            <div className="mt-2 font-display text-xl text-foreground-soft">
              {active.label}
            </div>
            <div className="mt-3 text-sm text-foreground-muted">
              The diaspora is real.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 64 }, (_, i) => i);
  const colors = ["#d9b367", "#f0cf86", "#1e3a8a", "#c81d3a", "#f4ecd8"];
  return (
    <div className="absolute inset-0 overflow-hidden">
      {pieces.map((i) => {
        const left = (i * 13) % 100;
        const delay = (i % 8) * 0.08;
        const duration = 2.4 + ((i * 7) % 14) / 10;
        const rot = (i * 47) % 360;
        const c = colors[i % colors.length];
        const w = 6 + ((i * 3) % 6);
        return (
          <motion.span
            key={i}
            initial={{ y: -30, opacity: 0, rotate: rot }}
            animate={{
              y: typeof window !== "undefined" ? window.innerHeight + 30 : 800,
              opacity: [0, 1, 1, 0],
              rotate: rot + 360 + ((i * 23) % 360),
            }}
            transition={{
              duration,
              delay,
              ease: "easeIn",
            }}
            className="absolute"
            style={{
              left: `${left}%`,
              width: w,
              height: w * 0.4,
              background: c,
              borderRadius: 1,
              boxShadow: `0 0 8px ${c}80`,
            }}
          />
        );
      })}
    </div>
  );
}
