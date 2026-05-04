"use client";

import { useT } from "./language-provider";

export function Manifesto() {
  const t = useT();
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden px-5 py-20 sm:py-28">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground-muted">
        <span className="flag-stripe inline-block h-3 w-1 rounded-sm" />
        {t.manifesto.eyebrow}
      </div>
      <h3 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.025em] sm:text-[56px] sm:leading-[1.04]">
        {t.manifesto.headline1}{" "}
        <span className="display-italic gold-text">
          {t.manifesto.headline2}
        </span>
        {t.manifesto.headlineEnd}
      </h3>
      <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border-strong bg-border-strong sm:grid-cols-3">
        {t.manifesto.items.map((it, i) => (
          <div
            key={i}
            className="relative bg-background-elev/40 p-7 transition-colors hover:bg-background-elev/70"
          >
            <div className="flex items-center justify-between">
              <span className="editorial-num text-5xl text-haiti-gold/90">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-haiti-gold/40" />
            </div>
            <div className="mt-5 font-display text-xl tracking-[-0.015em]">
              {it.head}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
