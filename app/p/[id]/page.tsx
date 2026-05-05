import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Hero } from "@/components/hero";
import { LiveFeed } from "@/components/live-feed";
import { Changelog } from "@/components/changelog";
import { PledgeForm } from "@/components/pledge-form";
import { PledgeTicker } from "@/components/pledge-ticker";
import { InviterBanner } from "@/components/inviter-banner";
import { Manifesto } from "@/components/manifesto";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Divider } from "@/components/divider";
import { TrustStrip } from "@/components/trust-strip";
import { Faq } from "@/components/faq";
import { MobileStickyCTA } from "@/components/mobile-sticky-cta";
import { MilestoneCelebration } from "@/components/milestone-celebration";
import { getTier } from "@/lib/tiers";
import type { Metadata } from "next";

export const revalidate = 30;

async function loadPledger(id: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const client = new ConvexHttpClient(url);
    const data = await client.query(api.pledges.publicById, {
      id: id as Id<"pledges">,
    });
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pledger = await loadPledger(id);
  if (!pledger) {
    return {
      title: "Spirit of Haiti Air — An Airline For The Diaspora",
    };
  }
  const tier = getTier(pledger.amount);
  const firstName = pledger.name.split(" ")[0];
  const title = `${firstName} from ${pledger.city} just boarded Spirit of Haiti Air`;
  const description = `${firstName} pledged as a ${tier.label} (${tier.sublabel}). Will you board too? $50 minimum.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/p/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${firstName}'s Spirit of Haiti Air boarding pass`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/p/${id}/opengraph-image`],
    },
  };
}

export default async function PledgerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pledger = await loadPledger(id);
  const tier = pledger ? getTier(pledger.amount) : null;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {pledger && tier && <InviterBanner inviter={pledger} tier={tier} />}
        <Hero />
        <TrustStrip />
        <PledgeForm />
        <Divider />
        <LiveFeed />
        <Changelog />
        <Manifesto />
        <Faq />
      </main>
      <SiteFooter />
      <PledgeTicker />
      <MobileStickyCTA />
      <MilestoneCelebration />
    </>
  );
}
