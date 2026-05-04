export type Tier = {
  id: string;
  label: string;
  sublabel: string;
  min: number;
  accent: string;
  glow: string;
  blurb: string;
};

export const TIERS: readonly Tier[] = [
  {
    id: "fondate",
    label: "Fondatè",
    sublabel: "Founder",
    min: 10_000,
    accent: "#E9C46A",
    glow: "rgba(212, 175, 55, 0.45)",
    blurb: "Premye non yo k ap genyen plak komemoratif sou avyon an.",
  },
  {
    id: "pilye",
    label: "Pilye",
    sublabel: "Pillar",
    min: 5_000,
    accent: "#F4A261",
    glow: "rgba(244, 162, 97, 0.4)",
    blurb: "Aksè priyoritè a tout evènman ofisyèl yo.",
  },
  {
    id: "patron",
    label: "Patron",
    sublabel: "Patron",
    min: 1_000,
    accent: "#E76F51",
    glow: "rgba(231, 111, 81, 0.4)",
    blurb: "Pin sètifye + envitasyon sou pwogrè biznis lan.",
  },
  {
    id: "bilder",
    label: "Bilder",
    sublabel: "Builder",
    min: 250,
    accent: "#2A9D8F",
    glow: "rgba(42, 157, 143, 0.4)",
    blurb: "Aksè a apèl mansyèl ak fondatè a.",
  },
  {
    id: "sipote",
    label: "Sipòtè",
    sublabel: "Supporter",
    min: 50,
    accent: "#A8DADC",
    glow: "rgba(168, 218, 220, 0.35)",
    blurb: "Non w sou miray fondatè dyaspora a.",
  },
] as const;

export function getTier(amount: number): Tier {
  return TIERS.find((t) => amount >= t.min) ?? TIERS[TIERS.length - 1];
}

export function nextTier(amount: number): Tier | null {
  const ascending = [...TIERS].sort((a, b) => a.min - b.min);
  return ascending.find((t) => t.min > amount) ?? null;
}

export function progressToNext(amount: number): {
  next: Tier | null;
  current: Tier;
  remaining: number;
  percent: number;
} {
  const current = getTier(amount);
  const next = nextTier(amount);
  if (!next) return { next: null, current, remaining: 0, percent: 1 };
  const span = next.min - current.min;
  const into = amount - current.min;
  return {
    next,
    current,
    remaining: next.min - amount,
    percent: Math.min(1, Math.max(0, into / span)),
  };
}
