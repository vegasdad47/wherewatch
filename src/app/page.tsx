import LandingHero from "@/components/landing-hero";
import LandingServices from "@/components/landing-services";
import LandingHowItWorks from "@/components/landing-how-it-works";
import { TrendingSection } from "@/components/trending-section";
import LandingFeatures from "@/components/landing-features";
import LandingPricing from "@/components/landing-pricing";
import LandingFAQ from "@/components/landing-faq";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  return (
    <div>
      <LandingHero />
      <LandingServices />
      <LandingHowItWorks />
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <TrendingSection />
      </div>
      <LandingFeatures />
      <LandingPricing />
      <LandingFAQ />
    </div>
  );
}
