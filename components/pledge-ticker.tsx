"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getTier } from "@/lib/tiers";
import { formatMoney } from "@/lib/utils";

type Notice = {
  key: string;
  name: string;
  city: string;
  country: string;
  amount: number;
};

export function PledgeTicker() {
  const recent = useQuery(api.pledges.recent, { limit: 1 });
  const [notice, setNotice] = useState<Notice | null>(null);
  const lastSeenRef = useRef<string | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!recent || recent.length === 0) return;
    const latest = recent[0];
    const key = `${latest.id}:${latest.lastPledgeAt}`;
    if (lastSeenRef.current === null) {
      lastSeenRef.current = key;
      return;
    }
    if (key === lastSeenRef.current) return;
    lastSeenRef.current = key;

    setNotice({
      key,
      name: latest.name.split(" ")[0],
      city: latest.city,
      country: latest.country,
      amount: latest.amount,
    });

    if (dismissRef.current) clearTimeout(dismissRef.current);
    dismissRef.current = setTimeout(() => setNotice(null), 5500);

    return () => {
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [recent]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.key}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="glass pointer-events-auto flex items-center gap-3 rounded-full px-4 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
              style={{
                background: getTier(notice.amount).accent + "22",
                color: getTier(notice.amount).accent,
                border: `1px solid ${getTier(notice.amount).accent}55`,
              }}
            >
              {notice.name[0]}
            </span>
            <div className="text-sm">
              <span className="font-medium">{notice.name}</span>{" "}
              <span className="text-foreground-muted">from</span>{" "}
              <span className="font-medium">
                {notice.city}, {notice.country}
              </span>{" "}
              <span className="text-foreground-muted">just committed</span>{" "}
              <span
                className="font-semibold tabular-nums"
                style={{ color: getTier(notice.amount).accent }}
              >
                {formatMoney(notice.amount, {
                  compact: notice.amount >= 1000,
                })}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
