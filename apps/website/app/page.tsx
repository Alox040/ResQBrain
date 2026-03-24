import { AudienceSection } from "../sections/AudienceSection";
import { CTASection } from "../sections/CTASection";
import { FeatureSection } from "../sections/FeatureSection";
import { FooterSection } from "../sections/FooterSection";
import { HeroSection } from "../sections/HeroSection";
import { ProblemSection } from "../sections/ProblemSection";
import { SolutionSection } from "../sections/SolutionSection";
import { WorkflowSection } from "../sections/WorkflowSection";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeatureSection />
      <WorkflowSection />
      <AudienceSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
