import { Hero } from "@/components/hero";
import { LiveFeed } from "@/components/live-feed";
import { PledgeForm } from "@/components/pledge-form";
import { PledgeTicker } from "@/components/pledge-ticker";
import { Manifesto } from "@/components/manifesto";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Divider } from "@/components/divider";
import { TrustStrip } from "@/components/trust-strip";
import { Faq } from "@/components/faq";
import { MobileStickyCTA } from "@/components/mobile-sticky-cta";
import { MilestoneCelebration } from "@/components/milestone-celebration";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <PledgeForm />
        <Divider />
        <LiveFeed />
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
