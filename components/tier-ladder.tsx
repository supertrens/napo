"use client";

import { TIERS, getTier } from "@/lib/tiers";
import { formatMoney } from "@/lib/utils";
import { Check } from "lucide-react";
import { useT } from "./language-provider";

export function TierLadder({ amount = 0 }: { amount?: number }) {
  const t = useT();
  const current = amount > 0 ? getTier(amount) : null;
  return (
    <div className="grid gap-2">
      {TIERS.map((tier) => {
        const reached = current && amount >= tier.min;
        const blurb = t.tierBlurbs[tier.id] ?? tier.blurb;
        return (
          <div
            key={tier.id}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background-elev/40 px-3 py-2.5 transition-all"
            style={
              reached
                ? {
                    borderColor: tier.accent + "66",
                    background: `linear-gradient(135deg, ${tier.accent}14 0%, transparent 60%)`,
                  }
                : undefined
            }
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-semibold"
              style={{
                background: tier.accent + "22",
                color: tier.accent,
                boxShadow: reached ? `0 0 24px ${tier.glow}` : undefined,
              }}
            >
              {reached ? <Check className="h-4 w-4" /> : tier.label[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold leading-none">
                  {tier.label}
                </span>
                <span className="text-xs uppercase tracking-wider text-foreground-dim">
                  {tier.sublabel}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-foreground-muted">
                {blurb}
              </p>
            </div>
            <div
              className="font-display text-sm font-semibold tabular-nums"
              style={{ color: reached ? tier.accent : "var(--foreground-muted)" }}
            >
              {formatMoney(tier.min, { compact: tier.min >= 1000 })}+
            </div>
          </div>
        );
      })}
    </div>
  );
}
