"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatedCounter } from "./animated-counter";
import { formatMoney } from "@/lib/utils";
import { ArrowDown, ArrowUpRight, Plane } from "lucide-react";
import { useT } from "./language-provider";
import { AirplaneArt } from "./airplane-art";

export function Hero() {
  const t = useT();
  const totals = useQuery(api.pledges.totals);
  const geo = useQuery(api.pledges.geography);
  const total = totals?.totalAmount ?? 0;
  const pledgers = totals?.totalPledgers ?? 0;
  const goal = totals?.goal ?? 25_000_000;
  const percent = Math.min(100, (total / goal) * 100);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1.5 sm:block">
        <div className="flag-stripe h-full w-full" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-12 pb-12 sm:pt-20 sm:pb-20">
        <div className="grid w-full min-w-0 grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16 lg:items-start">
          <div className="reveal-up">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground-muted">
              <Pellets />
              <span className="font-medium">{t.hero.eyebrow}</span>
            </div>

            <h1 className="mt-8 font-display tracking-tight">
              <span className="block text-[36px] leading-[0.98] text-foreground sm:text-[56px] md:text-[72px] lg:text-[84px]">
                {t.hero.line1}
              </span>
              <span className="relative mt-1.5 block text-[36px] leading-[0.98] sm:text-[56px] md:text-[72px] lg:text-[84px]">
                <span className="display-italic gold-text pr-2">
                  {t.hero.line2}
                </span>
                <span className="text-foreground/95">,</span>
                <UnderlineSwoop />
              </span>
              <span className="mt-1.5 block text-[36px] leading-[0.98] text-foreground/95 sm:text-[56px] md:text-[72px] lg:text-[84px]">
                {t.hero.line3}
              </span>
            </h1>

            <div className="mt-8 max-w-xl space-y-3 text-base leading-relaxed text-foreground-muted sm:text-[17px]">
              <p>{t.hero.lead}</p>
              <p className="flex gap-3 text-foreground-soft">
                <span
                  aria-hidden
                  className="mt-2.5 h-px w-6 shrink-0 bg-haiti-gold/70"
                />
                <span className="italic">{t.hero.leadEm}</span>
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="#pledge"
                className="btn-gold group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium tracking-wide"
              >
                <Plane className="h-4 w-4" />
                <span>{t.hero.ctaPrimary}</span>
                <span className="opacity-50">·</span>
                <span className="opacity-80">{t.hero.ctaPrimarySub}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[300%]"
                />
              </a>
              <a
                href="#how"
                className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground-soft"
              >
                <span className="relative">
                  {t.hero.ctaSecondary}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-haiti-gold transition-transform duration-300 group-hover:scale-x-100" />
                </span>
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>

            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-foreground-dim">
              {t.hero.footnote}
            </p>
          </div>

          <div className="relative mx-auto aspect-[5/6] w-full max-w-[320px] reveal-up sm:max-w-sm lg:mx-0 lg:max-w-none lg:justify-self-end">
            <AirplaneArt />
          </div>
        </div>

        <div className="mt-14 sm:mt-20">
          <CounterBand
            total={total}
            pledgers={pledgers}
            goal={goal}
            percent={percent}
            cities={geo?.cities ?? 0}
            countries={geo?.countries ?? 0}
            liveLabel={t.hero.live}
            totalLabel={t.hero.totalPledged}
            pledgersLabel={t.hero.pledgers(pledgers)}
            goalLabel={t.hero.goal}
            stats={t.hero.stats}
          />
        </div>
      </div>
    </section>
  );
}

function CounterBand({
  total,
  pledgers,
  goal,
  percent,
  cities,
  countries,
  liveLabel,
  totalLabel,
  pledgersLabel,
  goalLabel,
  stats,
}: {
  total: number;
  pledgers: number;
  goal: number;
  percent: number;
  cities: number;
  countries: number;
  liveLabel: string;
  totalLabel: string;
  pledgersLabel: string;
  goalLabel: string;
  stats: {
    minimum: string;
    goal: string;
    tiers: string;
    region: string;
    worldwide: string;
  };
}) {
  return (
    <div className="surface-elev relative overflow-hidden rounded-3xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-haiti-gold/10 blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-60 w-60 rounded-full bg-haiti-blue/15 blur-[80px]"
      />

      <div className="grid w-full min-w-0 grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="px-7 py-7 sm:px-10 sm:py-9">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] uppercase tracking-[0.28em] text-foreground-muted">
              {totalLabel}
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border-strong bg-background-elev/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {liveLabel}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <div className="font-display text-[64px] font-semibold leading-[0.95] tracking-[-0.03em] sm:text-[88px] md:text-[112px]">
              <AnimatedCounter
                value={total}
                formatter={(n) => formatMoney(n)}
                className="gold-text"
              />
            </div>
            <div className="text-sm text-foreground-muted tabular-nums sm:text-base">
              <span className="font-display text-foreground-dim italic">of</span>{" "}
              <span className="text-foreground-soft">
                {formatMoney(goal, { compact: true })}
              </span>
            </div>
          </div>

          <div className="mt-7">
            <div className="relative h-[6px] overflow-hidden rounded-full bg-white/[0.05]">
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
                  className="font-medium text-foreground-soft"
                />{" "}
                {pledgersLabel}
              </span>
              <span>
                {goalLabel}{" "}
                <span className="font-medium text-foreground-soft">
                  {formatMoney(goal, { compact: true })}
                </span>
              </span>
            </div>
            {(cities > 0 || countries > 0) && (
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-foreground-dim">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-haiti-gold" />
                  <AnimatedCounter
                    value={cities}
                    className="text-foreground-soft tabular-nums"
                  />{" "}
                  cities
                </span>
                <span className="opacity-40">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <AnimatedCounter
                    value={countries}
                    className="text-foreground-soft tabular-nums"
                  />{" "}
                  countries
                </span>
                <span className="opacity-40">·</span>
                <span>
                  <span className="text-foreground-soft">$50</span> minimum
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-border-strong lg:grid-cols-2 lg:border-t-0 lg:border-l">
          <StatCell label={stats.minimum} value="$50" sub="USD" />
          <StatCell label={stats.tiers} value="5" sub="ranks" border="left" />
          <StatCell
            label={stats.goal}
            value="$25M"
            sub="raise"
            border="top"
          />
          <StatCell
            label={stats.region}
            value={stats.worldwide}
            border="top-left"
            small
          />
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  sub,
  border,
  small,
}: {
  label: string;
  value: string;
  sub?: string;
  border?: "left" | "top" | "top-left";
  small?: boolean;
}) {
  const borderCls =
    border === "left"
      ? "border-l border-border-strong"
      : border === "top"
        ? "border-t border-border-strong"
        : border === "top-left"
          ? "border-t border-l border-border-strong"
          : "";
  return (
    <div className={`px-5 py-5 sm:px-6 sm:py-6 ${borderCls}`}>
      <div className="text-[10px] uppercase tracking-[0.24em] text-foreground-dim">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span
          className={
            "font-display font-semibold tracking-[-0.02em] " +
            (small ? "text-xl" : "text-3xl sm:text-[34px]")
          }
        >
          {value}
        </span>
        {sub && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground-dim">
            {sub}
          </span>
        )}
      </div>
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
      className="pointer-events-none absolute -bottom-2 left-0 h-3 w-[88%] text-haiti-gold/70"
    >
      <path
        d="M2 18 C 120 4, 280 4, 380 14 S 560 22, 598 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
