import { CTASection, MobileStickyCTA } from "../components/sections/CTASection";
import { FeatureSection } from "../components/sections/FeatureSection";
import { FooterSection } from "../components/sections/FooterSection";
import { HeroSection } from "../components/sections/HeroSection";
import { ProblemSection } from "../components/sections/ProblemSection";
import { RoadmapSection } from "../components/sections/RoadmapSection";
import { SolutionSection } from "../components/sections/SolutionSection";
import { SurveysSection } from "../components/sections/SurveysSection";
import { TrustSection } from "../components/sections/TrustSection";
import { UseCasesSection } from "../components/sections/UseCasesSection";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <SurveysSection />
      <RoadmapSection />
      <ProblemSection />
      <SolutionSection />
      <FeatureSection />
      <UseCasesSection />
      <TrustSection />
      <CTASection />
      <FooterSection />
      <MobileStickyCTA />
    </main>
  );
}
