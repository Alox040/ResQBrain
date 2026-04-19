import { AudienceSection } from "@/components/sections/AudienceSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { IdeaProjectGoalSplitSection } from "@/components/sections/IdeaProjectGoalSplitSection";
import { MitwirkungSection } from "@/components/sections/MitwirkungSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { StatusSection } from "@/components/sections/StatusSection";
import { homeContent } from "@/lib/site/content";

export default function HomePage() {
  return (
    <>
      <HeroSection hero={homeContent.hero} survey={homeContent.mitwirkung.activeSurvey} />

      <ProblemSection
        title={homeContent.problem.headline}
        cards={homeContent.problem.scenarios.map((scenario) => ({
          headline: scenario.title,
          text: scenario.text,
        }))}
        conclusion={homeContent.problem.conclusion}
      />

      <IdeaProjectGoalSplitSection
        primary={{
          title: homeContent.idea.headline,
          subtitle: homeContent.idea.subheadline,
          cards: homeContent.idea.blocks.map((block) => ({
            headline: block.title,
            text: block.text,
            status: block.status ? { label: block.status.label } : undefined,
          })),
          disclaimer: homeContent.idea.disclaimer,
        }}
        secondary={{
          title: homeContent.trust.headline,
          cards: homeContent.trust.items.map((item) => ({
            headline: item.title,
            text: item.text,
          })),
        }}
      />

      <StatusSection
        title={homeContent.status.headline}
        subtitle={homeContent.status.subheadline}
        groups={homeContent.status.groups}
        disclaimer={homeContent.status.disclaimer}
        cta={homeContent.status.cta}
      />

      <AudienceSection
        title={homeContent.audiences.headline}
        items={homeContent.audiences.useCases}
        closingText={homeContent.audiences.closingText}
        cta={homeContent.audiences.cta}
      />

      <MitwirkungSection
        title={homeContent.mitwirkung.headline}
        subtitle={homeContent.mitwirkung.subheadline}
        text={homeContent.mitwirkung.supportingCopy}
        activeSurvey={homeContent.mitwirkung.activeSurvey}
        paths={homeContent.mitwirkung.paths}
        primaryCta={homeContent.mitwirkung.cta.primary}
        secondaryCta={homeContent.mitwirkung.cta.secondary}
      />

      <FaqSection title={homeContent.faq.headline} items={homeContent.faq.items} />
    </>
  );
}
