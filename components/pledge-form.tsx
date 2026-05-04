"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TIERS, getTier, nextTier, progressToNext } from "@/lib/tiers";
import { TierBadge } from "./tier-badge";
import { TierLadder } from "./tier-ladder";
import { cn, formatMoney } from "@/lib/utils";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRESETS = [50, 100, 250, 500, 1000, 5000, 10000, 25000];

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | {
      kind: "success";
      delta: number;
      total: number;
      isReturning: boolean;
      pledgeCount: number;
    }
  | { kind: "error"; message: string };

export function PledgeForm() {
  const submit = useMutation(api.pledges.submit);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [amount, setAmount] = useState<number>(100);
  const [amountText, setAmountText] = useState<string>("100");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const looksLikeEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const existing = useQuery(
    api.pledges.lookupByEmail,
    looksLikeEmail ? { email: email.trim() } : "skip",
  );

  useEffect(() => {
    if (existing) {
      if (!name) setName(existing.name);
      if (!city) setCity(existing.city);
      if (!country) setCountry(existing.country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.name]);

  const projected = (existing?.amount ?? 0) + (Number.isFinite(amount) ? amount : 0);
  const projectedTier = getTier(projected);
  const ladderProgress = progressToNext(projected);

  const canSubmit =
    name.trim().length >= 2 &&
    looksLikeEmail &&
    city.trim().length >= 2 &&
    country.trim().length >= 2 &&
    amount >= 50 &&
    status.kind !== "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus({ kind: "submitting" });
    try {
      const result = await submit({
        name: name.trim(),
        email: email.trim(),
        amount: Math.round(amount),
        city: city.trim(),
        country: country.trim(),
      });
      setStatus({
        kind: "success",
        delta: result.delta,
        total: result.totalAmount,
        isReturning: result.isReturning,
        pledgeCount: result.pledgeCount,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Yon erè rive";
      setStatus({ kind: "error", message });
    }
  }

  function reset() {
    setStatus({ kind: "idle" });
  }

  function increase() {
    setStatus({ kind: "idle" });
    setAmount(50);
    setAmountText("50");
  }

  return (
    <section
      id="pledge"
      className="relative mx-auto max-w-6xl scroll-mt-12 px-5 py-12 sm:py-20"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground-muted">
            <Sparkles className="h-3.5 w-3.5 text-haiti-gold" />
            Pledge — no payment yet
          </div>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Make your <span className="gold-text">commitment</span>.
          </h2>
          <p className="mt-3 max-w-xl text-foreground-muted">
            $50 minimum. We hold your word, not your money. When the raise
            opens, we'll reach out with secure payment instructions.
          </p>

          <AnimatePresence mode="wait">
            {status.kind === "success" ? (
              <SuccessCard
                key="success"
                delta={status.delta}
                total={status.total}
                isReturning={status.isReturning}
                tier={getTier(status.total)}
                onAddMore={increase}
                onClose={reset}
              />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="glass mt-8 rounded-2xl p-5 sm:p-7"
              >
                {existing && (
                  <div
                    className="mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm"
                    style={{
                      borderColor: getTier(existing.amount).accent + "55",
                      background: getTier(existing.amount).accent + "12",
                    }}
                  >
                    <Sparkles
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: getTier(existing.amount).accent }}
                    />
                    <div>
                      <div className="font-medium">
                        Welcome back, {existing.name.split(" ")[0]}.
                      </div>
                      <div className="text-foreground-muted">
                        You've already pledged{" "}
                        <span className="text-foreground">
                          {formatMoney(existing.amount)}
                        </span>{" "}
                        across {existing.pledgeCount} commitment
                        {existing.pledgeCount === 1 ? "" : "s"}. New amount adds
                        to your total.
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    value={name}
                    onChange={setName}
                    placeholder="Marie Joseph"
                    autoComplete="name"
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  <Field
                    label="City"
                    value={city}
                    onChange={setCity}
                    placeholder="Port-au-Prince"
                    autoComplete="address-level2"
                  />
                  <Field
                    label="Country"
                    value={country}
                    onChange={setCountry}
                    placeholder="Haiti"
                    autoComplete="country-name"
                  />
                </div>

                <div className="mt-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
                    Pledge amount (USD)
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setAmount(p);
                          setAmountText(String(p));
                        }}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                          amount === p
                            ? "border-haiti-gold/70 bg-haiti-gold/15 text-haiti-gold"
                            : "border-border bg-background-elev/40 text-foreground-muted hover:border-border-strong hover:text-foreground",
                        )}
                      >
                        {formatMoney(p, { compact: p >= 1000 })}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex items-stretch overflow-hidden rounded-xl border border-border-strong bg-background-elev/40 focus-within:border-haiti-gold/60 focus-within:ring-2 focus-within:ring-haiti-gold/20">
                    <span className="flex items-center px-4 text-foreground-muted font-display text-xl">
                      $
                    </span>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={amountText}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9]/g, "");
                        setAmountText(cleaned);
                        const n = parseInt(cleaned || "0", 10);
                        setAmount(Number.isFinite(n) ? n : 0);
                      }}
                      className="w-full bg-transparent py-3 pr-4 text-2xl font-display tracking-tight outline-none tabular-nums"
                      placeholder="100"
                      aria-label="Pledge amount"
                    />
                    <div className="flex items-center pr-4">
                      <TierBadge tier={projectedTier} size="sm" showSub />
                    </div>
                  </div>
                  {amount > 0 && amount < 50 && (
                    <div className="mt-2 text-xs text-haiti-red">
                      Minimum pledge is $50.
                    </div>
                  )}

                  {ladderProgress.next && projected >= 50 && (
                    <div className="mt-3 text-xs text-foreground-muted">
                      <span className="text-foreground">
                        {formatMoney(ladderProgress.remaining)}
                      </span>{" "}
                      more to reach{" "}
                      <span style={{ color: ladderProgress.next.accent }}>
                        {ladderProgress.next.label}
                      </span>
                      .
                    </div>
                  )}
                </div>

                {status.kind === "error" && (
                  <div className="mt-4 rounded-xl border border-haiti-red/40 bg-haiti-red/10 px-4 py-3 text-sm text-red-200">
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium transition-all",
                    canSubmit
                      ? "bg-haiti-gold text-[#0a0e27] hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(233,196,106,0.4)] pulse-glow"
                      : "bg-white/10 text-foreground-muted cursor-not-allowed",
                  )}
                >
                  {status.kind === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending pledge…
                    </>
                  ) : (
                    <>
                      Pledge {amount >= 50 ? formatMoney(amount) : "$50+"}
                      <span className="opacity-70">— Mwen ladan l</span>
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-foreground-dim">
                  <ShieldCheck className="h-3 w-3" />
                  No payment now. Your data is held securely; never sold.
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside id="how" className="lg:pt-2">
          <div className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
            Tiers
          </div>
          <h3 className="mt-2 font-display text-2xl tracking-tight">
            Where will your pledge land?
          </h3>
          <p className="mt-2 text-sm text-foreground-muted">
            Tiers are cumulative. Every additional pledge stacks toward a
            higher rank.
          </p>
          <div className="mt-5">
            <TierLadder amount={projected} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-border-strong bg-background-elev/40 px-4 py-3 text-base outline-none transition-colors placeholder:text-foreground-dim focus:border-haiti-gold/60 focus:ring-2 focus:ring-haiti-gold/20"
      />
    </label>
  );
}

function SuccessCard({
  delta,
  total,
  isReturning,
  tier,
  onAddMore,
  onClose,
}: {
  delta: number;
  total: number;
  isReturning: boolean;
  tier: ReturnType<typeof getTier>;
  onAddMore: () => void;
  onClose: () => void;
}) {
  const next = nextTier(total);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass mt-8 rounded-2xl p-7 text-center"
      style={{ boxShadow: `0 0 60px ${tier.glow}` }}
    >
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(135deg, ${tier.accent}33 0%, ${tier.accent}10 100%)`,
          border: `1px solid ${tier.accent}66`,
        }}
      >
        <Sparkles className="h-7 w-7" style={{ color: tier.accent }} />
      </div>
      <div className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">
        {isReturning ? "Komitman ogmante." : "Mèsi anpil."}
      </div>
      <p className="mt-2 text-foreground-muted">
        You {isReturning ? "added" : "pledged"}{" "}
        <span className="text-foreground">{formatMoney(delta)}</span>.{" "}
        {isReturning ? (
          <>
            Total commitment now{" "}
            <span className="text-foreground">{formatMoney(total)}</span>.
          </>
        ) : (
          <>You're a <span style={{ color: tier.accent }}>{tier.label}</span>.</>
        )}
      </p>
      <div className="mt-5 flex justify-center">
        <TierBadge tier={tier} size="md" showSub />
      </div>
      {next && (
        <p className="mt-4 text-xs text-foreground-muted">
          {formatMoney(next.min - total)} more to{" "}
          <span style={{ color: next.accent }}>{next.label}</span>.
        </p>
      )}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onAddMore}
          className="rounded-full bg-haiti-gold px-5 py-2.5 text-sm font-medium text-[#0a0e27] transition-all hover:scale-[1.02]"
        >
          Add more
        </button>
        <button
          onClick={onClose}
          className="text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}
