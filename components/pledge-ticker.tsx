"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getTier } from "@/lib/tiers";
import { formatMoney, initials } from "@/lib/utils";
import { useT } from "./language-provider";

type Notice = {
  key: string;
  fullName: string;
  firstName: string;
  city: string;
  country: string;
  amount: number;
  pledgeCount: number;
  isReturning: boolean;
  bornAt: number;
};

const VISIBLE_MS = 6500;
const MAX_VISIBLE = 3;

export function PledgeTicker() {
  const t = useT();
  const recent = useQuery(api.pledges.recent, { limit: 6 });
  const [notices, setNotices] = useState<Notice[]>([]);
  const seenRef = useRef<Map<string, number> | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!recent) return;
    if (!seenRef.current) seenRef.current = new Map();

    if (!initializedRef.current) {
      // Don't toast the initial backlog — only changes from this point forward.
      for (const p of recent) {
        seenRef.current.set(p.id, p.lastPledgeAt);
      }
      initializedRef.current = true;
      return;
    }

    const now = Date.now();
    const fresh: Notice[] = [];
    for (const p of recent) {
      const prevTs = seenRef.current.get(p.id);
      if (prevTs === p.lastPledgeAt) continue;
      seenRef.current.set(p.id, p.lastPledgeAt);
      fresh.push({
        key: `${p.id}:${p.lastPledgeAt}`,
        fullName: p.name,
        firstName: p.name.split(" ")[0] ?? p.name,
        city: p.city,
        country: p.country,
        amount: p.amount,
        pledgeCount: p.pledgeCount,
        isReturning: prevTs !== undefined,
        bornAt: now,
      });
    }
    if (fresh.length === 0) return;
    setNotices((prev) => [...fresh, ...prev].slice(0, MAX_VISIBLE));
  }, [recent]);

  // Auto-dismiss expired notices
  useEffect(() => {
    if (notices.length === 0) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setNotices((prev) => prev.filter((n) => now - n.bornAt < VISIBLE_MS));
    }, 500);
    return () => clearInterval(timer);
  }, [notices.length]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-[calc(100%-2rem)] flex-col-reverse items-end gap-2.5 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {notices.map((n) => {
          const tier = getTier(n.amount);
          return (
            <motion.div
              key={n.key}
              layout
              initial={{ opacity: 0, x: 36, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 36, scale: 0.94 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="surface-elev pointer-events-auto relative w-[340px] max-w-full overflow-hidden rounded-2xl px-4 py-3.5"
              style={{
                boxShadow: `0 24px 48px -16px rgba(5,7,26,0.7), 0 0 32px -10px ${tier.glow}`,
              }}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px]"
                style={{ background: tier.accent }}
              />
              <div className="flex items-start gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold tracking-wide"
                  style={{
                    background: `linear-gradient(135deg, ${tier.accent}33, ${tier.accent}11)`,
                    color: tier.accent,
                    border: `1px solid ${tier.accent}55`,
                  }}
                >
                  {initials(n.fullName)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="truncate text-sm">
                      <span className="font-medium text-foreground-soft">
                        {n.firstName}
                      </span>{" "}
                      <span className="text-foreground-muted">
                        {t.ticker.from}
                      </span>{" "}
                      <span className="font-medium text-foreground-soft">
                        {n.city}
                      </span>
                    </div>
                    <span
                      className="shrink-0 font-display text-sm font-semibold tabular-nums"
                      style={{ color: tier.accent }}
                    >
                      {formatMoney(n.amount, { compact: n.amount >= 1000 })}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground-dim">
                    <span className="truncate">
                      {n.country} · {tier.label}
                      {n.isReturning && n.pledgeCount > 1 && (
                        <span className="ml-1.5 normal-case tracking-normal text-foreground-muted">
                          · ×{n.pledgeCount}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0">{t.ticker.committed}</span>
                  </div>
                </div>
              </div>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] origin-left bg-haiti-gold/50"
                style={{
                  animation: `tickerProgress ${VISIBLE_MS}ms linear forwards`,
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      <style>{`
        @keyframes tickerProgress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
