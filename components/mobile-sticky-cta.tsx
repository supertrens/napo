"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plane } from "lucide-react";
import { useT } from "./language-provider";
import { formatMoney } from "@/lib/utils";

export function MobileStickyCTA() {
  const t = useT();
  const [show, setShow] = useState(false);
  const totals = useQuery(api.pledges.totals);

  useEffect(() => {
    function onScroll() {
      // Show after scrolling past the hero (~600px)
      const scrolled = window.scrollY > 520;
      // Hide once the form is in view
      const form = document.querySelector("#pledge");
      const formInView =
        form !== null &&
        form.getBoundingClientRect().top <= window.innerHeight - 100;
      setShow(scrolled && !formInView);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        "pointer-events-none fixed inset-x-3 bottom-3 z-40 flex justify-center transition-all duration-300 sm:hidden " +
        (show
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0 pointer-events-none")
      }
    >
      <a
        href="#pledge"
        className="surface-elev pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-full px-1.5 py-1.5"
      >
        <div className="flex min-w-0 items-center gap-2 px-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[10px] uppercase tracking-[0.22em] text-foreground-dim">
              {t.hero.totalPledged}
            </div>
            <div className="truncate font-display text-sm font-semibold tabular-nums text-foreground-soft">
              {formatMoney(totals?.totalAmount ?? 0)}
            </div>
          </div>
        </div>
        <span className="btn-gold inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium">
          <Plane className="h-3.5 w-3.5" />
          {t.hero.ctaPrimary}
        </span>
      </a>
    </div>
  );
}
