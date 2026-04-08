import { AudienceSection } from "@/components/sections/home/audience-section";
import { ContributionSection } from "@/components/sections/home/contribution-section";
import { FaqSection } from "@/components/sections/home/faq-section";
import { FeatureSection } from "@/components/sections/home/feature-section";
import { HeroSection } from "@/components/sections/home/hero-section";
import { PrefooterCtaSection } from "@/components/sections/home/prefooter-cta-section";
import { ProblemSection } from "@/components/sections/home/problem-section";

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <HeroSection />
      <ProblemSection />
      <FeatureSection />
      <AudienceSection />
      <ContributionSection />
      <FaqSection />
      <PrefooterCtaSection />
    </main>
  );
}
