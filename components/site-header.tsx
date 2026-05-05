"use client";

import { Plane } from "lucide-react";
import { LanguageToggle } from "./language-toggle";
import { useT } from "./language-provider";

export function SiteHeader() {
  const t = useT();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-[rgba(5,7,26,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <a href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-border-strong bg-background-elev/60">
            <span className="flag-stripe absolute left-0 top-0 h-full w-1 rounded-l-md" />
            <Plane className="h-3.5 w-3.5 text-haiti-gold" />
          </span>
          <span className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="font-display text-sm sm:text-lg font-semibold tracking-[-0.02em]">
              Spirit of Haiti
            </span>
            <span className="font-display display-italic text-sm sm:text-lg text-haiti-gold">
              Air
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-foreground-muted md:flex">
          <a
            href="/#how"
            className="transition-colors hover:text-foreground-soft"
          >
            {t.nav.howItWorks}
          </a>
          <a
            href="/#pledge"
            className="transition-colors hover:text-foreground-soft"
          >
            {t.nav.tiers}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            href="/#pledge"
            className="btn-gold rounded-full px-4 py-1.5 text-sm font-medium"
          >
            {t.nav.pledge}
          </a>
        </div>
      </div>
    </header>
  );
}
