import { Hero } from "@/components/hero";
import { LiveFeed } from "@/components/live-feed";
import { PledgeForm } from "@/components/pledge-form";
import { PledgeTicker } from "@/components/pledge-ticker";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <PledgeForm />
        <Divider />
        <LiveFeed />
        <Manifesto />
      </main>
      <SiteFooter />
      <PledgeTicker />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flag-stripe inline-block h-6 w-1 rounded-full" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Napo Air
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-foreground-muted sm:flex">
          <a href="#how" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#pledge" className="hover:text-foreground transition-colors">
            Tiers
          </a>
        </nav>
        <a
          href="#pledge"
          className="rounded-full bg-haiti-gold px-4 py-1.5 text-sm font-medium text-[#0a0e27] transition-all hover:scale-[1.03]"
        >
          Pledge
        </a>
      </div>
    </header>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
    </div>
  );
}

function Manifesto() {
  const items = [
    {
      kr: "1.",
      head: "By the diaspora",
      body: "Owned, governed, and capitalized by Haitians at home and abroad. Every pledger is a stakeholder in the story.",
    },
    {
      kr: "2.",
      head: "Built on real assets",
      body: "Spirit's grounded fleet, gates, and routes are tangible — not vaporware. We're rallying capital to put them to work for our people.",
    },
    {
      kr: "3.",
      head: "Word first, money later",
      body: "We collect commitments, not payments. When the raise opens, every pledger gets a private invitation with secure instructions.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground-muted">
        <span className="flag-stripe inline-block h-3 w-1 rounded-full" />
        Manifesto
      </div>
      <h3 className="mt-3 max-w-3xl font-display text-3xl tracking-tight sm:text-5xl">
        We don't need permission to{" "}
        <span className="gold-text">build our own wings</span>.
      </h3>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.kr}
            className="rounded-2xl border border-border bg-background-elev/40 p-6"
          >
            <div className="font-display text-3xl text-haiti-gold">{it.kr}</div>
            <div className="mt-3 font-display text-xl tracking-tight">
              {it.head}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-xs text-foreground-muted sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="flag-stripe inline-block h-4 w-1 rounded-full" />
          <span>
            Napo Air · An airline for the diaspora, by the diaspora.
          </span>
        </div>
        <div>
          A pledge is a promise — no charge today. © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
