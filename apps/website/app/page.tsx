import { AppPreviewSection } from "../components/sections/AppPreviewSection";
import { CTASection, MobileStickyCTA } from "../components/sections/CTASection";
import { TemporaryEncodingTest } from "../components/debug/TemporaryEncodingTest";
import { FeatureSection } from "../components/sections/FeatureSection";
import { FooterSection } from "../components/sections/FooterSection";
import { HeroSection } from "../components/sections/HeroSection";
import { ProblemSection } from "../components/sections/ProblemSection";
import { SolutionSection } from "../components/sections/SolutionSection";
import { TrustSection } from "../components/sections/TrustSection";
import { UseCasesSection } from "../components/sections/UseCasesSection";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeatureSection />
      <AppPreviewSection />
      <UseCasesSection />
      <TrustSection />
      <CTASection />
      <TemporaryEncodingTest />
      <FooterSection />
      <MobileStickyCTA />
    </main>
  );
}
