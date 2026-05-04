"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { getTier } from "@/lib/tiers";
import { TierBadge } from "./tier-badge";
import { formatMoney, initials, timeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";

export function LiveFeed() {
  const recent = useQuery(api.pledges.recent, { limit: 12 });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live commitments
          </div>
          <h3 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
            The diaspora, <span className="gold-text">in real time</span>.
          </h3>
        </div>
      </div>

      <div className="mt-8">
        {recent === undefined ? (
          <SkeletonList />
        ) : recent.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {recent.map((p) => {
                const tier = getTier(p.amount);
                return (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="glass relative overflow-hidden rounded-xl px-4 py-3"
                  >
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
                      style={{ background: tier.accent }}
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${tier.accent}33, ${tier.accent}11)`,
                          color: tier.accent,
                          border: `1px solid ${tier.accent}55`,
                        }}
                      >
                        {initials(p.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate font-medium">
                            {p.name}
                          </span>
                          {p.pledgeCount > 1 && (
                            <span className="rounded-full border border-border bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-foreground-muted">
                              ×{p.pledgeCount}
                            </span>
                          )}
                        </div>
                        <div className="truncate text-xs text-foreground-muted">
                          {p.city}, {p.country} ·{" "}
                          {timeAgo(p.lastPledgeAt, now)} ago
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-display text-base font-semibold tabular-nums"
                          style={{ color: tier.accent }}
                        >
                          {formatMoney(p.amount, { compact: p.amount >= 1000 })}
                        </div>
                        <div className="mt-0.5">
                          <TierBadge tier={tier} size="xs" />
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}

function SkeletonList() {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="glass h-[68px] animate-pulse rounded-xl bg-white/[0.02]"
        />
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl px-6 py-12 text-center">
      <div className="font-display text-2xl tracking-tight">
        Be the first.
      </div>
      <p className="mt-2 text-sm text-foreground-muted">
        Your name lights up the feed when you pledge.
      </p>
    </div>
  );
}
