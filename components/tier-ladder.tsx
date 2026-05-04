"use client";

import { TIERS, getTier } from "@/lib/tiers";
import { formatMoney } from "@/lib/utils";
import { Check } from "lucide-react";

export function TierLadder({ amount = 0 }: { amount?: number }) {
  const current = amount > 0 ? getTier(amount) : null;
  return (
    <div className="grid gap-2">
      {TIERS.map((t) => {
        const reached = current && amount >= t.min;
        return (
          <div
            key={t.id}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background-elev/40 px-3 py-2.5 transition-all"
            style={
              reached
                ? {
                    borderColor: t.accent + "66",
                    background: `linear-gradient(135deg, ${t.accent}14 0%, transparent 60%)`,
                  }
                : undefined
            }
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-semibold"
              style={{
                background: t.accent + "22",
                color: t.accent,
                boxShadow: reached ? `0 0 24px ${t.glow}` : undefined,
              }}
            >
              {reached ? <Check className="h-4 w-4" /> : t.label[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold leading-none">
                  {t.label}
                </span>
                <span className="text-xs uppercase tracking-wider text-foreground-dim">
                  {t.sublabel}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-foreground-muted">
                {t.blurb}
              </p>
            </div>
            <div
              className="font-display text-sm font-semibold tabular-nums"
              style={{ color: reached ? t.accent : "var(--foreground-muted)" }}
            >
              {formatMoney(t.min, { compact: t.min >= 1000 })}+
            </div>
          </div>
        );
      })}
    </div>
  );
}
