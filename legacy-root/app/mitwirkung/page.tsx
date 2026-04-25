import { Footer } from "@/components/layout/footer";
import { CommunitySection } from "@/components/sections/mitwirkung/community-section";
import { MitwirkungHeroSection } from "@/components/sections/mitwirkung/mitwirkung-hero-section";
import { PartnerCtaSection } from "@/components/sections/mitwirkung/partner-cta-section";
import { PartnersSection } from "@/components/sections/mitwirkung/partners-section";
import { SurveySection } from "@/components/sections/mitwirkung/survey-section";

export default function MitwirkungPage() {
  return (
    <>
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <MitwirkungHeroSection />
        <SurveySection />
        <CommunitySection />
        <PartnersSection />
        <PartnerCtaSection />
      </main>
      <Footer />
    </>
  );
}
