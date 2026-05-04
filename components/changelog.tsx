"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "./language-provider";
import { getTier } from "@/lib/tiers";
import { formatMoney, initials, timeAgo } from "@/lib/utils";

const PAGE_SIZE = 8;
const MAX_LOAD = 80;

export function Changelog() {
  const t = useT();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const events = useQuery(api.pledges.events, { limit });
  const totals = useQuery(api.pledges.totals);
  const goal = totals?.goal ?? 25_000_000;

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(i);
  }, []);

  const canShowMore =
    events !== undefined &&
    events.length === limit &&
    limit < MAX_LOAD;

  return (
    <section className="mx-auto w-full min-w-0 max-w-6xl overflow-hidden px-5 py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground-muted">
            <span className="flag-stripe inline-block h-3 w-1 rounded-sm" />
            {t.changelog.eyebrow}
          </div>
          <h3 className="mt-4 font-display text-3xl tracking-[-0.025em] sm:text-[44px] sm:leading-[1.04]">
            {t.changelog.headline1}{" "}
            <span className="display-italic gold-text">
              {t.changelog.headline2}
            </span>
            {t.changelog.headlineEnd}
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground-muted">
            {t.changelog.sub}
          </p>
        </div>

        <div className="relative">
          {events === undefined ? (
            <SkeletonTimeline />
          ) : events.length === 0 ? (
            <Empty text={t.changelog.empty} />
          ) : (
            <>
              {/* Vertical rule */}
              <span
                aria-hidden
                className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-haiti-gold/30 via-border-strong to-transparent"
              />
              <ul className="space-y-5">
                <AnimatePresence initial={false}>
                  {events.map((e, idx) => {
                    const tier = getTier(e.cumulativeAmount);
                    const isLatest = idx === 0;
                    const percent = Math.min(
                      100,
                      (e.cumulativeTotal / goal) * 100,
                    );
                    return (
                      <motion.li
                        key={e.id}
                        layout
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.2, 0.8, 0.2, 1],
                        }}
                        className="relative pl-10"
                      >
                        {/* Timeline dot */}
                        <span
                          aria-hidden
                          className="absolute left-1.5 top-2 flex h-3 w-3 items-center justify-center"
                        >
                          {isLatest && (
                            <span
                              className="absolute h-3 w-3 animate-ping rounded-full opacity-50"
                              style={{ background: tier.accent }}
                            />
                          )}
                          <span
                            className="relative h-2.5 w-2.5 rounded-full"
                            style={{
                              background: tier.accent,
                              boxShadow: `0 0 12px ${tier.glow}`,
                            }}
                          />
                        </span>

                        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[15px]">
                              <span className="font-medium text-foreground-soft">
                                {e.name}
                              </span>
                              <span className="text-foreground-dim">
                                {e.isReturning
                                  ? t.changelog.added
                                  : t.changelog.boarded}
                              </span>
                              <span
                                className="font-display font-semibold tabular-nums"
                                style={{ color: tier.accent }}
                              >
                                +{formatMoney(e.delta)}
                              </span>
                              <span className="text-xs text-foreground-muted">
                                · {t.changelog.from} {e.city}, {e.country}
                              </span>
                            </div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-foreground-dim">
                              <span>{timeAgo(e.createdAt, now)} ago</span>
                              <span className="opacity-50">·</span>
                              <span style={{ color: tier.accent }}>
                                {tier.label}
                              </span>
                              <span className="opacity-50">·</span>
                              <span>
                                {e.pledgeCount === 1
                                  ? t.changelog.firstFlight
                                  : t.changelog.flights(e.pledgeCount)}
                              </span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-[10px] uppercase tracking-[0.22em] text-foreground-dim">
                              {t.changelog.runningTotal}
                            </div>
                            <div className="font-display text-base font-semibold tabular-nums sm:text-lg">
                              {formatMoney(e.cumulativeTotal, {
                                compact: e.cumulativeTotal >= 10_000,
                              })}
                            </div>
                            <div className="mt-1 h-[3px] w-full max-w-[160px] overflow-hidden rounded-full bg-white/[0.05] sm:ml-auto">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.max(2, percent)}%`,
                                  background: `linear-gradient(90deg, ${tier.accent}aa, ${tier.accent})`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Initial avatar inline (shown bigger only on first item) */}
                        {isLatest && (
                          <span
                            aria-hidden
                            className="absolute -left-0.5 top-7 hidden text-[10px] uppercase tracking-[0.22em] text-haiti-gold sm:block"
                          >
                            ✦ now
                          </span>
                        )}
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

              {canShowMore && (
                <div className="mt-7 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setLimit((l) => Math.min(MAX_LOAD, l + PAGE_SIZE))
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-background-elev/40 px-5 py-2 text-xs uppercase tracking-[0.22em] text-foreground-muted transition-all hover:border-border-bright hover:text-foreground-soft"
                  >
                    <span className="h-px w-5 bg-haiti-gold/60" />
                    {t.changelog.showMore}
                  </button>
                </div>
              )}
              {!canShowMore && limit > PAGE_SIZE && (
                <div className="mt-7 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setLimit(PAGE_SIZE)}
                    className="text-xs uppercase tracking-[0.22em] text-foreground-dim transition-colors hover:text-foreground-soft"
                  >
                    {t.changelog.showLess}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function SkeletonTimeline() {
  return (
    <ul className="space-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="relative pl-10"
        >
          <span
            aria-hidden
            className="absolute left-2 top-2 h-2.5 w-2.5 animate-pulse rounded-full bg-white/10"
          />
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded bg-white/[0.06] sm:ml-auto" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="surface rounded-2xl px-6 py-10 text-center">
      <p className="text-sm text-foreground-muted">{text}</p>
    </div>
  );
}
