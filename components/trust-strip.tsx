"use client";

import { Plane, ShieldCheck, Users } from "lucide-react";
import { useT } from "./language-provider";

export function TrustStrip() {
  const t = useT();
  const icons = [Plane, ShieldCheck, Users];
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden px-5 py-16 sm:py-20">
      <div className="grid w-full min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground-muted">
            <span className="flag-stripe inline-block h-3 w-1 rounded-sm" />
            {t.trust.eyebrow}
          </div>
          <h3 className="mt-4 max-w-xl font-display text-3xl tracking-[-0.025em] sm:text-[44px] sm:leading-[1.05]">
            {t.trust.headline}
          </h3>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground-muted sm:text-base">
            {t.trust.sub}
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground-dim">
            <span className="h-px w-8 bg-haiti-gold/60" />
            {t.trust.founderLine("Jhonson Napoleon")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-strong bg-border-strong sm:grid-cols-3 lg:grid-cols-1">
          {t.trust.pillars.map((p, i) => {
            const Icon = icons[i] ?? Plane;
            return (
              <div
                key={p.k}
                className="flex items-start gap-4 bg-background-elev/40 px-5 py-5 transition-colors hover:bg-background-elev/70"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-haiti-gold/30 bg-haiti-gold/10 text-haiti-gold"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-base tracking-[-0.01em] text-foreground-soft">
                    {p.k}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                    {p.v}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
