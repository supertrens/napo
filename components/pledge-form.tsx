"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTier, nextTier, progressToNext } from "@/lib/tiers";
import { TierBadge } from "./tier-badge";
import { TierLadder } from "./tier-ladder";
import { cn, formatMoney } from "@/lib/utils";
import { Loader2, Plane, ShieldCheck, Sparkles } from "lucide-react";
import { ShareSheet } from "./share-sheet";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "./language-provider";

const PRESETS = [50, 100, 250, 500, 1000, 5000, 10000, 25000];

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | {
      kind: "success";
      id: string;
      delta: number;
      total: number;
      isReturning: boolean;
      pledgeCount: number;
    }
  | { kind: "error"; message: string };

export function PledgeForm() {
  const t = useT();
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

  const projected =
    (existing?.amount ?? 0) + (Number.isFinite(amount) ? amount : 0);
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
        id: String(result.id),
        delta: result.delta,
        total: result.totalAmount,
        isReturning: result.isReturning,
        pledgeCount: result.pledgeCount,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
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
      className="relative mx-auto w-full max-w-6xl scroll-mt-16 overflow-hidden px-5 py-16 sm:py-24"
    >
      <div className="grid w-full min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-foreground-muted">
            <Sparkles className="h-3 w-3 text-haiti-gold" />
            {t.form.eyebrow}
          </div>
          <h2 className="mt-4 font-display text-[34px] leading-[0.98] tracking-[-0.025em] sm:text-[44px] md:text-[56px]">
            {t.form.title1}{" "}
            <span className="display-italic gold-text">{t.form.title2}</span>
            {t.form.titleEnd}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground-muted sm:text-[17px]">
            {t.form.subtitle}
          </p>

          <AnimatePresence mode="wait">
            {status.kind === "success" ? (
              <SuccessCard
                key="success"
                id={status.id}
                name={name}
                city={city}
                country={country}
                pledgeCount={status.pledgeCount}
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
                className="surface-elev mt-8 rounded-3xl p-6 sm:p-8"
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
                        {t.form.welcomeBack(existing.name.split(" ")[0])}
                      </div>
                      <div className="text-foreground-muted">
                        {t.form.alreadyPledged(
                          formatMoney(existing.amount),
                          existing.pledgeCount,
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={t.form.labels.name}
                    value={name}
                    onChange={setName}
                    placeholder={t.form.placeholders.name}
                    autoComplete="name"
                  />
                  <Field
                    label={t.form.labels.email}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder={t.form.placeholders.email}
                    autoComplete="email"
                  />
                  <Field
                    label={t.form.labels.city}
                    value={city}
                    onChange={setCity}
                    placeholder={t.form.placeholders.city}
                    autoComplete="address-level2"
                  />
                  <Field
                    label={t.form.labels.country}
                    value={country}
                    onChange={setCountry}
                    placeholder={t.form.placeholders.country}
                    autoComplete="country-name"
                  />
                </div>

                <div className="mt-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
                    {t.form.labels.amount}
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

                  <div className="input-premium mt-3 flex w-full min-w-0 items-stretch overflow-hidden rounded-xl">
                    <span className="flex shrink-0 items-center px-4 text-foreground-muted font-display text-xl">
                      $
                    </span>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      size={1}
                      value={amountText}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9]/g, "");
                        setAmountText(cleaned);
                        const n = parseInt(cleaned || "0", 10);
                        setAmount(Number.isFinite(n) ? n : 0);
                      }}
                      className="w-full min-w-0 bg-transparent py-3 pr-4 text-2xl font-display tracking-tight outline-none tabular-nums"
                      placeholder="100"
                      aria-label={t.form.labels.amount}
                    />
                    <div className="flex shrink-0 items-center pr-4">
                      <TierBadge tier={projectedTier} size="sm" />
                    </div>
                  </div>
                  {amount > 0 && amount < 50 && (
                    <div className="mt-2 text-xs text-haiti-red">
                      {t.form.minError}
                    </div>
                  )}

                  {ladderProgress.next && projected >= 50 && (
                    <div className="mt-3 text-xs text-foreground-muted">
                      {t.form.moreToReach(
                        formatMoney(ladderProgress.remaining),
                        ladderProgress.next.label,
                      )}
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
                  className="btn-gold mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium tracking-wide"
                >
                  {status.kind === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.form.submitting}
                    </>
                  ) : (
                    <>
                      {t.form.submit(
                        amount >= 50 ? formatMoney(amount) : "$50+",
                      )}
                      <span className="opacity-70">— {t.form.submitSub}</span>
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-foreground-dim">
                  <ShieldCheck className="h-3 w-3" />
                  {t.form.disclaimer}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside id="how" className="lg:pt-2">
          <div className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
            {t.form.tiersTitle}
          </div>
          <h3 className="mt-2 font-display text-2xl tracking-tight">
            {t.form.tiersHead}
          </h3>
          <p className="mt-2 text-sm text-foreground-muted">
            {t.form.tiersSub}
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
        size={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input-premium mt-1.5 w-full min-w-0 rounded-xl px-4 py-3 text-base placeholder:text-foreground-dim"
      />
    </label>
  );
}

const TIER_CLASS: Record<string, string> = {
  fondate: "FOUNDER",
  pilye: "DIAMOND",
  patron: "FIRST",
  bilder: "BUSINESS",
  sipote: "ECONOMY",
};

function ticketCodes(seed: string, pledgeCount: number) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  const abs = Math.abs(h);
  const flightNum = String(abs % 9000 + 1000).padStart(4, "0");
  const seatRow = (abs >> 4) % 38 + 1;
  const seatLetter = "ABCDEF"[(abs >> 8) % 6];
  const seat = `${seatRow}${seatLetter}`;
  const gate = ["DSP", "AYI", "PAP", "JFK", "MIA"][(abs >> 12) % 5];
  return { flightNum, seat, gate, pledgeCount };
}

function SuccessCard({
  id,
  name,
  city,
  country,
  pledgeCount,
  delta,
  total,
  isReturning,
  tier,
  onAddMore,
  onClose,
}: {
  id: string;
  name: string;
  city: string;
  country: string;
  pledgeCount: number;
  delta: number;
  total: number;
  isReturning: boolean;
  tier: ReturnType<typeof getTier>;
  onAddMore: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const next = nextTier(total);
  const codes = ticketCodes(`${name}|${city}|${country}|${total}`, pledgeCount);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${id}`
      : `/p/${id}`;
  const tierClass = TIER_CLASS[tier.id] ?? "ECONOMY";
  const dateStr = new Date()
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .toUpperCase()
    .replace(/,/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className="surface-elev relative mt-8 overflow-hidden rounded-3xl"
      style={{
        boxShadow: `0 40px 80px -20px rgba(5,7,26,0.7), 0 0 60px -10px ${tier.glow}`,
      }}
    >
      {/* Flag stripe rail */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 flag-stripe"
      />

      {/* Watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="font-display tracking-[-0.04em] -rotate-[10deg] select-none"
          style={{
            fontSize: "clamp(120px, 22vw, 220px)",
            color: tier.accent,
            opacity: 0.06,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {isReturning ? "BOARDED" : "PROMISED"}
        </span>
      </span>

      <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto]">
        {/* Main ticket */}
        <div className="px-7 py-7 sm:px-10 sm:py-9">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
            <span className="flex items-center gap-2">
              <Plane className="h-3 w-3 text-haiti-gold" />
              <span className="text-haiti-gold font-medium">Napo Air</span>
              <span className="opacity-50">·</span>
              <span>Boarding Pass</span>
            </span>
            <span className="font-mono text-foreground-muted">
              NA-{codes.flightNum}
            </span>
          </div>

          {/* Passenger */}
          <div className="mt-7">
            <div className="text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
              Passenger
            </div>
            <div className="mt-1.5 font-display text-2xl font-medium uppercase tracking-[-0.01em] sm:text-[28px]">
              {name || "Anonymous"}
            </div>
          </div>

          {/* Route */}
          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-end gap-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
                From
              </div>
              <div className="mt-1.5 truncate font-display text-xl uppercase tracking-[-0.01em] text-foreground-soft sm:text-2xl">
                {city || "—"}
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-foreground-muted">
                {country || "—"}
              </div>
            </div>
            <div className="flex flex-col items-center pb-1.5">
              <Plane className="h-5 w-5 text-haiti-gold" />
              <svg
                viewBox="0 0 80 6"
                className="mt-2 h-1.5 w-16 text-haiti-gold/40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 3"
              >
                <line x1="0" y1="3" x2="80" y2="3" />
              </svg>
            </div>
            <div className="min-w-0 text-right">
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
                To
              </div>
              <div
                className="display-italic mt-1.5 truncate font-display text-xl tracking-[-0.01em] sm:text-2xl"
                style={{ color: tier.accent }}
              >
                Freedom
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-foreground-muted">
                Ayiti · NA
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-2 gap-y-5 sm:grid-cols-4">
            <TicketCell
              label="Class"
              value={tierClass}
              accent={tier.accent}
              ranked
            />
            <TicketCell label="Fare" value={formatMoney(delta)} mono />
            <TicketCell label="Seat" value={codes.seat} mono />
            <TicketCell label="Gate" value={codes.gate} mono />
          </div>
        </div>

        {/* Stub */}
        <div className="relative hidden border-l border-dashed border-border-strong sm:block">
          {/* Notches */}
          <span
            aria-hidden
            className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-background"
          />
          <span
            aria-hidden
            className="absolute -left-2 bottom-0 h-4 w-4 rounded-full bg-background"
          />
          <div className="flex h-full flex-col justify-between px-7 py-9 text-right">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
                Tier
              </div>
              <div
                className="font-display display-italic mt-2 text-2xl tracking-[-0.02em]"
                style={{ color: tier.accent }}
              >
                {tier.label}
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-foreground-muted">
                {tier.sublabel}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
                Total commitment
              </div>
              <div className="mt-1.5 font-display text-xl tabular-nums tracking-tight">
                {formatMoney(total)}
              </div>
              {pledgeCount > 1 && (
                <div className="text-[10px] uppercase tracking-[0.22em] text-foreground-muted">
                  Across {pledgeCount} flights
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Perforation + barcode */}
      <div className="relative border-t border-dashed border-border-strong">
        <span
          aria-hidden
          className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-background"
        />
        <span
          aria-hidden
          className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-background"
        />
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-4 sm:px-10">
          <Barcode seed={codes.flightNum + codes.seat} />
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-foreground-dim">
            <span>
              <span className="text-foreground-muted">Date</span>{" "}
              <span className="font-mono text-foreground-soft">{dateStr}</span>
            </span>
            <span className="opacity-40">·</span>
            <span>
              <span className="text-foreground-muted">Status</span>{" "}
              <span
                className="font-mono"
                style={{ color: tier.accent }}
              >
                {isReturning ? "RE-BOARDED" : "PROMISED"}
              </span>
            </span>
            <span className="opacity-40 hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              <span className="text-foreground-muted">ETD</span>{" "}
              <span className="font-mono text-foreground-soft">SOON</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <div className="relative border-t border-dashed border-border-strong px-7 py-7 text-center sm:px-10 sm:py-8">
        <div className="font-display display-italic gold-text text-3xl tracking-[-0.02em] sm:text-4xl">
          {isReturning ? t.form.successReturning : t.form.successNew}
        </div>
        <p className="mt-2 text-sm text-foreground-muted">
          {isReturning
            ? t.form.successDescReturning(
                formatMoney(delta),
                formatMoney(total),
              )
            : t.form.successDescNew(formatMoney(delta), tier.label)}
        </p>
        {next && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-foreground-dim">
            {t.form.successNext(formatMoney(next.min - total), next.label)}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <ShareSheet
            shareUrl={shareUrl}
            composedText={t.share.composedTier(tier.label)}
          />
          <button
            onClick={onAddMore}
            className="rounded-full border border-border-strong bg-background-elev/40 px-5 py-2.5 text-sm font-medium text-foreground-soft transition-colors hover:border-border-bright"
          >
            {t.form.addMore}
          </button>
          <button
            onClick={onClose}
            className="text-sm text-foreground-muted transition-colors hover:text-foreground-soft"
          >
            {t.form.done}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TicketCell({
  label,
  value,
  accent,
  mono,
  ranked,
}: {
  label: string;
  value: string;
  accent?: string;
  mono?: boolean;
  ranked?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.32em] text-foreground-dim">
        {label}
      </div>
      <div
        className={cn(
          "mt-1.5 text-base sm:text-lg font-medium tracking-wide uppercase",
          mono && "font-mono tabular-nums",
          ranked && "font-display tracking-[0.04em]",
        )}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function Barcode({ seed }: { seed: string }) {
  // Deterministic stripe pattern from seed
  let h = 7919;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  const bars: { w: number; opacity: number }[] = [];
  let x = h;
  for (let i = 0; i < 38; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    const w = 1 + (x % 4);
    const opacity = 0.5 + ((x >> 5) % 50) / 100;
    bars.push({ w, opacity });
  }
  return (
    <div className="flex h-7 items-end gap-[2px]">
      {bars.map((b, i) => (
        <span
          key={i}
          className="bg-foreground-soft"
          style={{
            width: `${b.w}px`,
            height: "100%",
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}
