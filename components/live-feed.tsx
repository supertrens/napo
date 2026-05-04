"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { getTier } from "@/lib/tiers";
import { TierBadge } from "./tier-badge";
import { formatMoney, initials, timeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useT } from "./language-provider";

export function LiveFeed() {
  const t = useT();
  const recent = useQuery(api.pledges.recent, { limit: 12 });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden px-5 py-16 sm:py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-foreground-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t.feed.eyebrow}
          </div>
          <h3 className="mt-3 font-display text-3xl tracking-[-0.025em] sm:text-[44px] sm:leading-[1.05]">
            {t.feed.headline1}{" "}
            <span className="display-italic gold-text">
              {t.feed.headline2}
            </span>
            {t.feed.headlineEnd}
          </h3>
        </div>
      </div>

      <div className="mt-8">
        {recent === undefined ? (
          <SkeletonList />
        ) : recent.length === 0 ? (
          <EmptyState
            title={t.feed.emptyTitle}
            body={t.feed.emptyBody}
          />
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
                    className="surface relative overflow-hidden rounded-2xl px-4 py-3.5 transition-colors hover:border-border-bright"
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
                          {timeAgo(p.lastPledgeAt, now)} {t.feed.ago}
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
          className="surface h-[72px] animate-pulse rounded-2xl"
        />
      ))}
    </ul>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="surface-elev rounded-3xl px-6 py-16 text-center">
      <div className="font-display display-italic gold-text text-3xl tracking-[-0.02em]">
        {title}
      </div>
      <p className="mt-3 text-sm text-foreground-muted">{body}</p>
    </div>
  );
}
