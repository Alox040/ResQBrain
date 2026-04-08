import { Footer } from "@/components/layout/footer";
import { CollaborationAreasSection } from "@/components/sections/kontakt/collaboration-areas-section";
import { ContributionContactSection } from "@/components/sections/kontakt/contribution-contact-section";
import { KontaktCtaSection } from "@/components/sections/kontakt/kontakt-cta-section";
import { KontaktHeroSection } from "@/components/sections/kontakt/kontakt-hero-section";

export default function KontaktPage() {
  return (
    <>
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <KontaktHeroSection />
        <ContributionContactSection />
        <CollaborationAreasSection />
        <KontaktCtaSection />
      </main>
      <Footer />
    </>
  );
}
