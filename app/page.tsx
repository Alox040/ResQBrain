import { HeroSection } from "@/components/sections/hero";
import { ProblemSection } from "@/components/sections/problem";
import { SolutionSection } from "@/components/sections/solution";
import { FeaturesSection } from "@/components/sections/features";
import { UseCasesSection } from "@/components/sections/usecases";
import { StatusSection } from "@/components/sections/status";
import { SurveysSection } from "@/components/sections/SurveysSection";
import { CtaSection } from "@/components/sections/cta";
import { FooterSection } from "@/components/sections/footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <SurveysSection />
      <UseCasesSection />
      <StatusSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
