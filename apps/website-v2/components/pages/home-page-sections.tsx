import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { RegionSection } from "@/components/sections/region-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TrustSection } from "@/components/sections/trust-section";

export function HomePageSections() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <ProcessSection />
      <RegionSection />
      <ContactCtaSection />
      <Footer />
    </>
  );
}
