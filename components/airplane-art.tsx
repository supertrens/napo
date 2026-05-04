"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AirplaneArt() {
  const totals = useQuery(api.pledges.totals);
  const recent = useQuery(api.pledges.recent, { limit: 1 });

  const passengers = totals?.totalPledgers ?? 0;
  const passengersDisplay =
    passengers > 0 ? passengers.toLocaleString("en-US") : "—";
  const flightNumber =
    passengers > 0 ? String(passengers).padStart(4, "0") : "0000";
  const latest = recent?.[0];
  const lastJoinedCity = latest?.city ?? null;

  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden rounded-3xl"
    >
      <div className="absolute inset-0 surface-elev rounded-3xl" />

      <svg
        viewBox="0 0 600 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="sky" cx="50%" cy="80%" r="80%">
            <stop offset="0%" stopColor="rgba(217, 179, 103, 0.25)" />
            <stop offset="35%" stopColor="rgba(200, 29, 58, 0.12)" />
            <stop offset="100%" stopColor="rgba(13, 18, 50, 0)" />
          </radialGradient>
          <linearGradient id="horizon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(217, 179, 103, 0)" />
            <stop offset="50%" stopColor="rgba(217, 179, 103, 0.55)" />
            <stop offset="100%" stopColor="rgba(217, 179, 103, 0)" />
          </linearGradient>
          <linearGradient id="contrail" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(244, 236, 216, 0)" />
            <stop offset="50%" stopColor="rgba(244, 236, 216, 0.7)" />
            <stop offset="100%" stopColor="rgba(244, 236, 216, 0)" />
          </linearGradient>
          <linearGradient id="planeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7dca0" />
            <stop offset="60%" stopColor="#d9b367" />
            <stop offset="100%" stopColor="#8c6d2e" />
          </linearGradient>
          <linearGradient id="wing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e3c07e" />
            <stop offset="100%" stopColor="#a08246" />
          </linearGradient>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.7" fill="rgba(244, 236, 216, 0.18)" />
          </pattern>
        </defs>

        <rect width="600" height="720" fill="url(#sky)" />
        <rect width="600" height="720" fill="url(#dots)" opacity="0.55" />

        <line
          x1="0"
          y1="500"
          x2="600"
          y2="500"
          stroke="url(#horizon)"
          strokeWidth="1.2"
        />
        <line
          x1="0"
          y1="540"
          x2="600"
          y2="540"
          stroke="rgba(217, 179, 103, 0.18)"
          strokeWidth="0.5"
        />

        <circle
          cx="300"
          cy="500"
          r="120"
          fill="rgba(217, 179, 103, 0.18)"
          filter="blur(2px)"
        />
        <circle cx="300" cy="500" r="58" fill="rgba(247, 220, 160, 0.25)" />

        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-6 0; 6 0; -6 0"
            dur="14s"
            repeatCount="indefinite"
          />
          <path
            d="M 40 600 C 180 460, 360 360, 560 200"
            fill="none"
            stroke="rgba(217, 179, 103, 0.45)"
            strokeWidth="1.2"
            strokeDasharray="2 8"
          />
          <path
            d="M 40 640 C 220 540, 420 460, 580 320"
            fill="none"
            stroke="rgba(244, 236, 216, 0.18)"
            strokeWidth="0.8"
            strokeDasharray="1 7"
          />
        </g>

        <line
          x1="60"
          y1="320"
          x2="380"
          y2="220"
          stroke="url(#contrail)"
          strokeWidth="1.6"
          strokeDasharray="4 10"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-120"
            dur="6s"
            repeatCount="indefinite"
          />
        </line>

        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -8; 0 0"
            dur="6.5s"
            repeatCount="indefinite"
          />
          <g transform="translate(380 220) rotate(-18)">
            <ellipse cx="0" cy="0" rx="92" ry="10" fill="url(#planeBody)" />
          <path
            d="M 92 0 Q 110 -2, 120 0 Q 110 2, 92 0 Z"
            fill="#f7dca0"
          />
          <path
            d="M -82 0 L -100 -22 L -88 -22 L -76 -2 Z"
            fill="url(#wing)"
          />
          <rect x="-94" y="-22" width="3" height="22" fill="#1e3a8a" />
          <rect x="-91" y="-22" width="3" height="22" fill="#c81d3a" />
          <path
            d="M -10 4 L -60 38 L -28 38 L 22 6 Z"
            fill="url(#wing)"
          />
          <path
            d="M -10 -4 L -60 -34 L -28 -34 L 22 -6 Z"
            fill="url(#wing)"
            opacity="0.85"
          />
          <ellipse cx="-32" cy="22" rx="9" ry="4" fill="#8c6d2e" />
          <ellipse cx="-32" cy="-22" rx="9" ry="4" fill="#8c6d2e" opacity="0.85" />
          <g fill="rgba(13, 18, 50, 0.75)">
            <rect x="20" y="-2" width="6" height="2.5" rx="1" />
            <rect x="32" y="-2" width="6" height="2.5" rx="1" />
            <rect x="44" y="-2" width="6" height="2.5" rx="1" />
            <rect x="56" y="-2" width="6" height="2.5" rx="1" />
            <rect x="68" y="-2" width="6" height="2.5" rx="1" />
          </g>
          <path
            d="M 76 -1 Q 88 -3, 95 -0.5 L 95 1 Q 88 2.5, 76 1 Z"
            fill="rgba(13, 18, 50, 0.85)"
          />
          <ellipse cx="-10" cy="-4" rx="60" ry="2" fill="rgba(255,255,255,0.18)" />
          </g>
        </g>

        <g fill="rgba(244, 236, 216, 0.7)">
          <circle cx="120" cy="80" r="1" />
          <circle cx="510" cy="120" r="1.2" />
          <circle cx="80" cy="180" r="0.8" />
          <circle cx="540" cy="60" r="0.9" />
          <circle cx="220" cy="50" r="0.6" />
        </g>

        <rect
          x="0"
          y="560"
          width="600"
          height="160"
          fill="url(#sky)"
          opacity="0.4"
        />
      </svg>

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6">
        <div className="surface rounded-2xl p-4 text-[11px] uppercase tracking-[0.18em]">
          <div className="flex items-center justify-between text-foreground-dim">
            <span>Diaspora · Boarding pass</span>
            <span className="flex items-center gap-1.5 text-haiti-gold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              NA · {flightNumber}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-3 font-display tracking-tight">
            <div>
              <div className="text-[9px] text-foreground-dim">Origin</div>
              <div className="text-2xl text-foreground-soft">Diaspora</div>
            </div>
            <svg
              viewBox="0 0 80 12"
              className="h-3 flex-1 text-haiti-gold/60"
              fill="currentColor"
            >
              <path d="M2 6 L60 6 L60 2 L78 6 L60 10 L60 6 Z" />
              <circle cx="2" cy="6" r="1.2" />
            </svg>
            <div className="text-right">
              <div className="text-[9px] text-foreground-dim">Destination</div>
              <div className="text-2xl text-foreground-soft">Ayiti</div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-foreground-dim">
            <span className="normal-case tracking-normal text-foreground-muted">
              <span className="font-medium tabular-nums text-foreground-soft">
                {passengersDisplay}
              </span>{" "}
              passengers boarded
              {lastJoinedCity && (
                <span className="hidden sm:inline">
                  {" "}
                  · last from{" "}
                  <span className="text-foreground-soft">{lastJoinedCity}</span>
                </span>
              )}
            </span>
            <span className="font-mono">ETD: SOON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
