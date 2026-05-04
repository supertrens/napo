"use client";

import { TIERS } from "@/lib/tiers";
import { TierBadge } from "./tier-badge";
import { useT } from "./language-provider";
import { formatMoney, initials } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type Tier = (typeof TIERS)[number];

export function InviterBanner({
  inviter,
  tier,
}: {
  inviter: {
    name: string;
    city: string;
    country: string;
    amount: number;
    pledgeCount: number;
  };
  tier: Tier;
}) {
  const t = useT();
  const firstName = inviter.name.split(" ")[0];

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:pt-10">
        <div
          className="surface-elev relative overflow-hidden rounded-3xl px-6 py-5 sm:px-8 sm:py-7"
          style={{
            boxShadow: `0 30px 60px -20px rgba(5,7,26,0.7), 0 0 60px -20px ${tier.glow}`,
          }}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 flag-stripe"
          />
          <div className="grid w-full min-w-0 grid-cols-1 gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${tier.accent}33, ${tier.accent}11)`,
                  color: tier.accent,
                  border: `1px solid ${tier.accent}55`,
                  boxShadow: `0 0 24px ${tier.glow}`,
                }}
              >
                {initials(inviter.name)}
              </div>
              <div className="min-w-0 lg:hidden">
                <div className="text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
                  ✦ {t.inviter.eyebrow}
                </div>
                <div className="mt-0.5">
                  <TierBadge tier={tier} size="sm" showSub />
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="hidden text-[10px] uppercase tracking-[0.32em] text-foreground-dim lg:block">
                ✦ {t.inviter.eyebrow}
              </div>
              <div className="mt-1 font-display text-xl leading-tight tracking-[-0.01em] sm:text-2xl">
                {t.inviter.headline(firstName, inviter.city)}{" "}
                <span className="display-italic gold-text">
                  {t.inviter.subhead}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground-muted">
                <span>
                  {t.inviter.tierLabel}{" "}
                  <span style={{ color: tier.accent }} className="font-medium">
                    {tier.label}
                  </span>
                </span>
                <span className="opacity-50">·</span>
                <span className="tabular-nums">
                  {formatMoney(inviter.amount)} pledged
                </span>
                {inviter.pledgeCount > 1 && (
                  <>
                    <span className="opacity-50">·</span>
                    <span>×{inviter.pledgeCount} flights</span>
                  </>
                )}
              </div>
            </div>
            <a
              href="#pledge"
              className="btn-gold inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium lg:w-auto"
            >
              {t.inviter.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
