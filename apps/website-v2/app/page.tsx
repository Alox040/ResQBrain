import { AudiencesSection } from "@/components/sections/audiences-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ParticipationSection } from "@/components/sections/participation-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { StatusSection } from "@/components/sections/status-section";
import { ValueSection } from "@/components/sections/value-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ValueSection />
      <AudiencesSection />
      <StatusSection />
      <ParticipationSection />
      <FaqSection />
      <ContactCtaSection />
    </>
  );
}
