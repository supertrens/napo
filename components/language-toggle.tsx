"use client";

import { Lang, LANGS } from "@/lib/i18n";
import { useLang } from "./language-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn(
        "relative inline-flex items-center rounded-full border border-border-strong bg-background-elev/60 p-0.5 text-xs font-medium",
        className,
      )}
    >
      {LANGS.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(l.code as Lang)}
            className={cn(
              "relative z-10 rounded-full px-2.5 py-1 transition-colors",
              active
                ? "text-[#0a0e27]"
                : "text-foreground-muted hover:text-foreground",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-haiti-gold"
              />
            )}
            {l.native}
          </button>
        );
      })}
    </div>
  );
}
