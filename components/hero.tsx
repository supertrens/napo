"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatedCounter } from "./animated-counter";
import { formatMoney } from "@/lib/utils";
import { ArrowDown, Plane } from "lucide-react";

export function Hero() {
  const totals = useQuery(api.pledges.totals);
  const total = totals?.totalAmount ?? 0;
  const pledgers = totals?.totalPledgers ?? 0;
  const goal = totals?.goal ?? 25_000_000;
  const percent = Math.min(100, (total / goal) * 100);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-haiti-gold/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:pt-24 sm:pb-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground-muted">
          <span className="flag-stripe inline-block h-3 w-1 rounded-full" />
          <span>Napo Air · Diaspora Initiative</span>
        </div>

        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl md:text-[88px]">
          <span className="block text-foreground/95">An airline</span>
          <span className="block">
            <span className="gold-text">for the diaspora</span>
            <span className="text-foreground/95">,</span>
          </span>
          <span className="block text-foreground/95">by the diaspora.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
          Spirit Airlines is grounded. We're rallying the Haitian diaspora to
          pledge <span className="text-foreground">$25M</span> and acquire a
          stake — turning fleet, gates, and routes into the foundation of a
          world-class airline that connects Ayiti to its people. No money moves
          today. Just your word.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-[1.4fr_1fr] sm:gap-8">
          <div className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
                Total Pledged
              </div>
              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Live
              </div>
            </div>

            <div className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
              <AnimatedCounter
                value={total}
                formatter={(n) => formatMoney(n)}
                className="gold-text"
              />
            </div>

            <div className="mt-6">
              <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-haiti-blue via-haiti-gold to-haiti-red transition-all duration-700"
                  style={{ width: `${Math.max(2, percent)}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full shimmer"
                  style={{ width: `${Math.max(2, percent)}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-foreground-muted">
                <span>
                  <AnimatedCounter
                    value={pledgers}
                    className="text-foreground"
                  />{" "}
                  pledgers
                </span>
                <span>
                  Goal{" "}
                  <span className="text-foreground">
                    {formatMoney(goal, { compact: true })}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-col sm:justify-between">
            <Stat label="Minimum Pledge" value="$50" />
            <Stat label="Goal" value="$25M" />
            <Stat label="Tiers" value="5" />
            <Stat label="Region" value="Worldwide" />
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <a
            href="#pledge"
            className="group inline-flex items-center gap-2 rounded-full bg-haiti-gold px-6 py-3 font-medium text-haiti-midnight transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(233,196,106,0.4)]"
            style={{ color: "#0a0e27" }}
          >
            <Plane className="h-4 w-4" />
            Mwen ladan l
            <span className="opacity-60">·</span>
            <span className="text-sm opacity-80">I'm in</span>
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            How it works <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background-elev/40 p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-foreground-dim">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}
