"use client";

import { Hero } from "@/components/hero";
import { LiveFeed } from "@/components/live-feed";
import { PledgeForm } from "@/components/pledge-form";
import { PledgeTicker } from "@/components/pledge-ticker";
import { LanguageToggle } from "@/components/language-toggle";
import { useT } from "@/components/language-provider";

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
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flag-stripe inline-block h-6 w-1 rounded-full" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Napo Air
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-foreground-muted md:flex">
          <a href="#how" className="hover:text-foreground transition-colors">
            {t.nav.howItWorks}
          </a>
          <a href="#pledge" className="hover:text-foreground transition-colors">
            {t.nav.tiers}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            href="#pledge"
            className="rounded-full bg-haiti-gold px-4 py-1.5 text-sm font-medium text-[#0a0e27] transition-all hover:scale-[1.03]"
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
      <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
    </div>
  );
}

function Manifesto() {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground-muted">
        <span className="flag-stripe inline-block h-3 w-1 rounded-full" />
        {t.manifesto.eyebrow}
      </div>
      <h3 className="mt-3 max-w-3xl font-display text-3xl tracking-tight sm:text-5xl">
        {t.manifesto.headline1}{" "}
        <span className="gold-text">{t.manifesto.headline2}</span>
        {t.manifesto.headlineEnd}
      </h3>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {t.manifesto.items.map((it, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-background-elev/40 p-6"
          >
            <div className="font-display text-3xl text-haiti-gold">
              {i + 1}.
            </div>
            <div className="mt-3 font-display text-xl tracking-tight">
              {it.head}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
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
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-xs text-foreground-muted sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="flag-stripe inline-block h-4 w-1 rounded-full" />
          <span>{t.footer.brand}</span>
        </div>
        <div>
          {t.footer.note} © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
