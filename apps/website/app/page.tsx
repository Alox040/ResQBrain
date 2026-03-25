import { AudienceSection } from "../sections/AudienceSection";
import { BuildingNowSection } from "../sections/BuildingNowSection";
import { CTASection } from "../sections/CTASection";
import { FeatureSection } from "../sections/FeatureSection";
import { FeatureVotingSection } from "../sections/FeatureVotingSection";
import { FooterSection } from "../sections/FooterSection";
import { HeroSection } from "../sections/HeroSection";
import { ProblemSection } from "../sections/ProblemSection";
import { RoadmapSection } from "../sections/RoadmapSection";
import { SolutionSection } from "../sections/SolutionSection";
import { StatusSection } from "../sections/StatusSection";
import { SurveysSection } from "../sections/SurveysSection";
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
      <StatusSection />
      <BuildingNowSection />
      <RoadmapSection />
      <SurveysSection />
      <FeatureVotingSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
