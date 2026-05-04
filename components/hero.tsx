"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatedCounter } from "./animated-counter";
import { formatMoney } from "@/lib/utils";
import { ArrowDown, Plane } from "lucide-react";
import { useT } from "./language-provider";

export function Hero() {
  const t = useT();
  const totals = useQuery(api.pledges.totals);
  const total = totals?.totalAmount ?? 0;
  const pledgers = totals?.totalPledgers ?? 0;
  const goal = totals?.goal ?? 25_000_000;
  const percent = Math.min(100, (total / goal) * 100);

  return (
    <section className="relative isolate overflow-hidden">
      <BackdropArt />

      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1.5 sm:block">
        <div className="flag-stripe h-full w-full opacity-80" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-14 pb-12 sm:pt-24 sm:pb-20">
        <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.28em] text-foreground-muted">
          <Pellets />
          <span>{t.hero.eyebrow}</span>
        </div>

        <h1 className="mt-7 font-display tracking-tight">
          <span className="block text-[42px] leading-[1] text-foreground/90 sm:text-7xl md:text-[88px]">
            {t.hero.line1}
          </span>
          <span className="relative mt-1 block text-[42px] leading-[1] sm:text-7xl md:text-[88px]">
            <span className="gold-text">{t.hero.line2}</span>
            <UnderlineSwoop />
          </span>
          <span className="mt-1 block text-[42px] leading-[1] text-foreground/90 sm:text-7xl md:text-[88px]">
            {t.hero.line3}
          </span>
        </h1>

        <div className="mt-8 grid max-w-3xl gap-2 text-base leading-relaxed text-foreground-muted sm:text-lg">
          <p>{t.hero.lead}</p>
          <p className="text-foreground/80">
            <span className="inline-block h-1 w-6 translate-y-[-4px] bg-haiti-gold/70 mr-2 rounded-full align-middle" />
            {t.hero.leadEm}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-end">
          <CounterCard
            total={total}
            pledgers={pledgers}
            goal={goal}
            percent={percent}
            liveLabel={t.hero.live}
            totalLabel={t.hero.totalPledged}
            pledgersLabel={t.hero.pledgers(pledgers)}
            goalLabel={t.hero.goal}
          />

          <div className="flex flex-col gap-4">
            <a
              href="#pledge"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-haiti-gold px-6 py-4 font-medium text-[#0a0e27] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(233,196,106,0.45)]"
            >
              <Plane className="h-4 w-4" />
              <span>{t.hero.ctaPrimary}</span>
              <span className="opacity-50">·</span>
              <span className="text-sm opacity-80">{t.hero.ctaPrimarySub}</span>
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[300%]"
              />
            </a>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              {t.hero.ctaSecondary}
              <ArrowDown className="h-3.5 w-3.5" />
            </a>
            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-foreground-dim">
              {t.hero.footnote}
            </p>
          </div>
        </div>

        <StatStrip stats={t.hero.stats} />
      </div>
    </section>
  );
}

function CounterCard({
  total,
  pledgers,
  goal,
  percent,
  liveLabel,
  totalLabel,
  pledgersLabel,
  goalLabel,
}: {
  total: number;
  pledgers: number;
  goal: number;
  percent: number;
  liveLabel: string;
  totalLabel: string;
  pledgersLabel: string;
  goalLabel: string;
}) {
  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-haiti-gold/10 blur-3xl"
      />
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.28em] text-foreground-muted">
          {totalLabel}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {liveLabel}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <div className="font-display text-[56px] font-semibold tracking-tight leading-[1] sm:text-[72px] md:text-[88px]">
          <AnimatedCounter
            value={total}
            formatter={(n) => formatMoney(n)}
            className="gold-text"
          />
        </div>
        <div className="text-sm text-foreground-muted tabular-nums">
          / {formatMoney(goal, { compact: true })}
        </div>
      </div>

      <div className="mt-5">
        <div className="relative h-2.5 overflow-hidden rounded-full bg-white/5">
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
              className="text-foreground font-medium"
            />{" "}
            {pledgersLabel}
          </span>
          <span>
            {goalLabel}{" "}
            <span className="text-foreground font-medium">
              {formatMoney(goal, { compact: true })}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function StatStrip({
  stats,
}: {
  stats: {
    minimum: string;
    goal: string;
    tiers: string;
    region: string;
    worldwide: string;
  };
}) {
  const items = [
    { label: stats.minimum, value: "$50" },
    { label: stats.goal, value: "$25M" },
    { label: stats.tiers, value: "5" },
    { label: stats.region, value: stats.worldwide },
  ];
  return (
    <div className="mt-12 grid grid-cols-2 divide-y divide-x divide-border border border-border rounded-2xl bg-background-elev/30 backdrop-blur-sm sm:grid-cols-4 sm:divide-y-0">
      {items.map((it) => (
        <div key={it.label} className="px-5 py-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-foreground-dim">
            {it.label}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tracking-tight">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function Pellets() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-haiti-blue" />
      <span className="h-1.5 w-1.5 rounded-full bg-haiti-red" />
      <span className="h-1.5 w-1.5 rounded-full bg-haiti-gold" />
    </span>
  );
}

function UnderlineSwoop() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 24"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full text-haiti-gold/70"
    >
      <path
        d="M2 18 C 120 4, 280 4, 380 14 S 560 22, 598 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackdropArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-haiti-blue/30 blur-[120px]" />
      <div className="absolute -top-10 right-[-10%] h-[360px] w-[360px] rounded-full bg-haiti-red/20 blur-[110px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[300px] w-[300px] rounded-full bg-haiti-gold/15 blur-[110px]" />
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-[0.18]"
      >
        <defs>
          <linearGradient id="arc" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(233,196,106,0)" />
            <stop offset="50%" stopColor="rgba(233,196,106,0.9)" />
            <stop offset="100%" stopColor="rgba(220,38,38,0)" />
          </linearGradient>
          <linearGradient id="arc2" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(29,78,216,0)" />
            <stop offset="50%" stopColor="rgba(29,78,216,0.85)" />
            <stop offset="100%" stopColor="rgba(233,196,106,0)" />
          </linearGradient>
        </defs>
        <path
          d="M -50 520 C 200 280, 700 220, 1250 80"
          fill="none"
          stroke="url(#arc)"
          strokeWidth="1.4"
          strokeDasharray="2 6"
        />
        <path
          d="M -50 580 C 300 380, 800 320, 1250 180"
          fill="none"
          stroke="url(#arc2)"
          strokeWidth="1"
          strokeDasharray="1 8"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-haiti-gold/30 to-transparent" />
    </div>
  );
}
