"use client";

import { useT } from "./language-provider";

export function SiteFooter() {
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
