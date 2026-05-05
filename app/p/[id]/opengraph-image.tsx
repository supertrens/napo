import { ImageResponse } from "next/og";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getTier } from "@/lib/tiers";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Spirit of Haiti Air boarding pass";

const TIER_CLASS: Record<string, string> = {
  fondate: "FOUNDER",
  pilye: "DIAMOND",
  patron: "FIRST",
  bilder: "BUSINESS",
  sipote: "ECONOMY",
};

function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function ticketCodes(seed: string) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++)
    h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  const abs = Math.abs(h);
  const flightNum = String((abs % 9000) + 1000).padStart(4, "0");
  const seatRow = ((abs >> 4) % 38) + 1;
  const seatLetter = "ABCDEF"[(abs >> 8) % 6];
  return { flightNum, seat: `${seatRow}${seatLetter}` };
}

async function loadFont(name: string, weights: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:${weights}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(
      /src: url\((https:\/\/fonts.gstatic.com\/[^)]+)\)/,
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  let pledger: {
    name: string;
    city: string;
    country: string;
    amount: number;
    pledgeCount: number;
  } | null = null;
  if (url) {
    try {
      const client = new ConvexHttpClient(url);
      pledger = await client.query(api.pledges.publicById, {
        id: params.id as Id<"pledges">,
      });
    } catch {}
  }

  const [fraunces700, fraunces500Italic, inter500, inter700] = await Promise.all([
    loadFont("Fraunces", "wght@700"),
    loadFont("Fraunces", "ital,wght@1,500"),
    loadFont("Inter", "wght@500"),
    loadFont("Inter", "wght@700"),
  ]);

  const fonts = [
    fraunces700 && {
      name: "Fraunces",
      data: fraunces700,
      style: "normal" as const,
      weight: 700 as const,
    },
    fraunces500Italic && {
      name: "Fraunces",
      data: fraunces500Italic,
      style: "italic" as const,
      weight: 500 as const,
    },
    inter500 && {
      name: "Inter",
      data: inter500,
      style: "normal" as const,
      weight: 500 as const,
    },
    inter700 && {
      name: "Inter",
      data: inter700,
      style: "normal" as const,
      weight: 700 as const,
    },
  ].filter(Boolean) as Array<{
    name: string;
    data: ArrayBuffer;
    style: "normal" | "italic";
    weight: 500 | 700;
  }>;

  const name = pledger?.name?.toUpperCase() ?? "ANONYMOUS";
  const city = pledger?.city?.toUpperCase() ?? "—";
  const country = pledger?.country?.toUpperCase() ?? "—";
  const amount = pledger?.amount ?? 0;
  const tier = getTier(amount);
  const tierClass = TIER_CLASS[tier.id] ?? "ECONOMY";
  const codes = ticketCodes(`${pledger?.name ?? "x"}|${city}|${amount}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(ellipse 60% 60% at 30% 20%, rgba(44,80,181,0.35), transparent 60%), radial-gradient(ellipse 50% 60% at 90% 90%, rgba(200,29,58,0.22), transparent 60%), radial-gradient(ellipse 60% 60% at 100% 0%, rgba(217,179,103,0.22), transparent 60%), linear-gradient(180deg, #05071a 0%, #0a0e2c 100%)",
          color: "#f4ecd8",
          fontFamily: "Inter",
          padding: "60px 70px",
          position: "relative",
        }}
      >
        {/* left flag stripe */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 12,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, background: "#1e3a8a" }} />
          <div style={{ flex: 1, background: "#c81d3a" }} />
        </div>

        {/* watermark */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) rotate(-10deg)",
            color: tier.accent,
            opacity: 0.06,
            fontFamily: "Fraunces",
            fontWeight: 700,
            fontSize: 280,
            letterSpacing: -8,
            display: "flex",
          }}
        >
          PROMISED
        </div>

        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            letterSpacing: 6,
            fontSize: 18,
            color: "#a39d8e",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                color: "#d9b367",
                fontWeight: 700,
                letterSpacing: 5,
              }}
            >
              ✈ SPIRIT OF HAITI AIR
            </span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>BOARDING PASS</span>
          </div>
          <div
            style={{
              color: "#ddd2b9",
              fontFamily: "Inter",
              fontWeight: 500,
            }}
          >
            SH-{codes.flightNum}
          </div>
        </div>

        {/* passenger */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 50 }}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 6,
              color: "#67625a",
              textTransform: "uppercase",
            }}
          >
            Passenger
          </div>
          <div
            style={{
              fontFamily: "Fraunces",
              fontWeight: 700,
              fontSize: 76,
              letterSpacing: -2,
              marginTop: 4,
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
        </div>

        {/* route */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 42,
            gap: 30,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                letterSpacing: 6,
                color: "#67625a",
                textTransform: "uppercase",
              }}
            >
              From
            </div>
            <div
              style={{
                fontFamily: "Fraunces",
                fontWeight: 700,
                fontSize: 52,
                color: "#ddd2b9",
                letterSpacing: -1,
                lineHeight: 1.05,
                marginTop: 6,
              }}
            >
              {city}
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#a39d8e",
                letterSpacing: 4,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {country}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: 16,
            }}
          >
            <div style={{ color: "#d9b367", fontSize: 36, display: "flex" }}>
              ✈
            </div>
            <div
              style={{
                marginTop: 4,
                width: 140,
                borderTop: "2px dashed rgba(217,179,103,0.45)",
                display: "flex",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: 16,
                letterSpacing: 6,
                color: "#67625a",
                textTransform: "uppercase",
              }}
            >
              To
            </div>
            <div
              style={{
                fontFamily: "Fraunces",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 64,
                color: tier.accent,
                letterSpacing: -1,
                lineHeight: 1.05,
                marginTop: 4,
              }}
            >
              Freedom
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#a39d8e",
                letterSpacing: 5,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Ayiti · NA
            </div>
          </div>
        </div>

        {/* divider */}
        <div
          style={{
            marginTop: 36,
            borderTop: "1px dashed rgba(244,236,216,0.16)",
            display: "flex",
          }}
        />

        {/* stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 26,
            gap: 30,
          }}
        >
          <Stat label="Class" value={tierClass} accent={tier.accent} />
          <Stat label="Fare" value={fmtMoney(amount)} />
          <Stat label="Seat" value={codes.seat} />
          <Stat label="Tier" value={tier.label} accent={tier.accent} italic />
        </div>

        {/* footer */}
        <div style={{ display: "flex", flex: 1 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px dashed rgba(244,236,216,0.16)",
            paddingTop: 22,
            marginTop: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontFamily: "Fraunces",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 36,
                color: "#f4ecd8",
                letterSpacing: -0.5,
              }}
            >
              Will you board too?
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#a39d8e",
                letterSpacing: 1,
              }}
            >
              An airline for the diaspora, by the diaspora · $50 minimum
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: 4,
                color: "#67625a",
                textTransform: "uppercase",
              }}
            >
              Status
            </div>
            <div
              style={{
                fontSize: 22,
                color: tier.accent,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              PROMISED
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  );
}

function Stat({
  label,
  value,
  accent,
  italic,
}: {
  label: string;
  value: string;
  accent?: string;
  italic?: boolean;
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}
    >
      <div
        style={{
          fontSize: 14,
          letterSpacing: 5,
          color: "#67625a",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: italic ? "Fraunces" : "Inter",
          fontWeight: italic ? 500 : 700,
          fontStyle: italic ? "italic" : "normal",
          fontSize: italic ? 32 : 28,
          letterSpacing: italic ? -0.5 : 2,
          color: accent ?? "#f4ecd8",
          textTransform: italic ? "none" : "uppercase",
        }}
      >
        {value}
      </div>
    </div>
  );
}
