"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "./language-provider";
import { cn } from "@/lib/utils";

export function Faq() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden px-5 py-20 sm:py-24">
      <div className="grid w-full min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground-muted">
            <span className="flag-stripe inline-block h-3 w-1 rounded-sm" />
            {t.faq.eyebrow}
          </div>
          <h3 className="mt-4 max-w-md font-display text-3xl tracking-[-0.025em] sm:text-[44px] sm:leading-[1.04]">
            {t.faq.headline.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="display-italic gold-text">
              {t.faq.headline.split(" ").slice(-1)[0]}
            </span>
          </h3>
        </div>
        <div className="divide-y divide-border-strong border-y border-border-strong">
          {t.faq.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors"
                >
                  <span className="font-display text-lg tracking-[-0.01em] text-foreground-soft sm:text-xl">
                    {it.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground-muted transition-all",
                      isOpen
                        ? "rotate-180 border-haiti-gold/50 bg-haiti-gold/10 text-haiti-gold"
                        : "group-hover:border-border-bright group-hover:text-foreground-soft",
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-12 text-[15px] leading-relaxed text-foreground-muted">
                        {it.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
