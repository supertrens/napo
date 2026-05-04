"use client";

import { Hero } from "@/components/hero";
import { LiveFeed } from "@/components/live-feed";
import { PledgeForm } from "@/components/pledge-form";
import { PledgeTicker } from "@/components/pledge-ticker";
import { LanguageToggle } from "@/components/language-toggle";
import { useT } from "@/components/language-provider";
import { Plane } from "lucide-react";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <PledgeForm />
        <Divider />
        <LiveFeed />
        <Manifesto />
      </main>
      <SiteFooter />
      <PledgeTicker />
    </>
  );
}

function SiteHeader() {
  const t = useT();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-[rgba(5,7,26,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <a href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-border-strong bg-background-elev/60">
            <span className="flag-stripe absolute left-0 top-0 h-full w-1 rounded-l-md" />
            <Plane className="h-3.5 w-3.5 text-haiti-gold" />
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-display text-lg font-semibold tracking-[-0.02em]">
              Napo
            </span>
            <span className="font-display display-italic text-lg text-haiti-gold">
              Air
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-foreground-muted md:flex">
          <a
            href="#how"
            className="transition-colors hover:text-foreground-soft"
          >
            {t.nav.howItWorks}
          </a>
          <a
            href="#pledge"
            className="transition-colors hover:text-foreground-soft"
          >
            {t.nav.tiers}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            href="#pledge"
            className="btn-gold rounded-full px-4 py-1.5 text-sm font-medium"
          >
            {t.nav.pledge}
          </a>
        </div>
      </div>
    </header>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <div className="hairline-rule h-px" />
    </div>
  );
}

function Manifesto() {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
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

function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex items-start gap-3">
          <span className="flag-stripe inline-block h-10 w-1 rounded-sm" />
          <div>
            <div className="font-display text-base">
              <span className="font-semibold">Napo</span>{" "}
              <span className="display-italic text-haiti-gold">Air</span>
            </div>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-foreground-muted">
              {t.footer.brand}
            </p>
          </div>
        </div>
        <div className="text-xs text-foreground-dim sm:text-right">
          <div>{t.footer.note}</div>
          <div className="mt-0.5">© {new Date().getFullYear()} Napo Air</div>
        </div>
      </div>
    </footer>
  );
}
