"use client";

import { Tier } from "@/lib/tiers";
import { cn } from "@/lib/utils";

export function TierBadge({
  tier,
  size = "sm",
  showSub = false,
  className,
}: {
  tier: Tier;
  size?: "xs" | "sm" | "md";
  showSub?: boolean;
  className?: string;
}) {
  const sizes = {
    xs: "text-[10px] px-1.5 py-0.5 gap-1",
    sm: "text-xs px-2 py-0.5 gap-1.5",
    md: "text-sm px-2.5 py-1 gap-2",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium tracking-wide uppercase",
        sizes[size],
        className,
      )}
      style={{
        borderColor: tier.accent + "55",
        background: tier.accent + "1a",
        color: tier.accent,
        boxShadow: `inset 0 0 12px ${tier.accent}1f`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: tier.accent, boxShadow: `0 0 8px ${tier.glow}` }}
      />
      {tier.label}
      {showSub && (
        <span className="opacity-60 normal-case font-normal">
          · {tier.sublabel}
        </span>
      )}
    </span>
  );
}
