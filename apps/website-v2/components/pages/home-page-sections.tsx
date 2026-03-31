import { AudiencesSection } from "@/components/sections/audiences-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ParticipationSection } from "@/components/sections/participation-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { ProjectStatusSection } from "@/components/sections/project-status-section";
import { Stack } from "@/components/ui/stack";

export function HomePageSections() {
  return (
    <Stack>
      <HeroSection />
      <ProblemSection />
      <BenefitsSection />
      <AudiencesSection />
      <ProjectStatusSection />
      <ParticipationSection />
      <FaqSection />
      <ContactCtaSection />
    </Stack>
  );
}
