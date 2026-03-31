import { AudiencesSection } from "@/components/sections/audiences-section";
import { CollaborationSection } from "@/components/sections/collaboration-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FeaturesOverviewSection } from "@/components/sections/features-overview-section";
import { HomeHero } from "@/components/sections/home-hero";
import { PilotFeedbackSection } from "@/components/sections/pilot-feedback-section";
import { ProblemBenefitsSection } from "@/components/sections/problem-benefits-section";
import { SurveyInviteSection } from "@/components/sections/survey-invite-section";

export function HomePageSections() {
  return (
    <>
      <HomeHero />
      <SurveyInviteSection />
      <ProblemBenefitsSection />
      <FeaturesOverviewSection />
      <AudiencesSection />
      <PilotFeedbackSection />
      <CollaborationSection />
      <FaqSection />
    </>
  );
}
