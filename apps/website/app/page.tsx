import { AudienceSection } from "@/components/sections/AudienceSection";
import { ContactCtaSection } from "@/components/sections/ContactCtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { IdeaSection } from "@/components/sections/IdeaSection";
import { MitwirkungSection } from "@/components/sections/MitwirkungSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { StatusSection } from "@/components/sections/StatusSection";
import { content } from "@/lib/site/content";

export default function HomePage() {
  return (
    <>
      <HeroSection
        headline={content.hero.headline}
        subline={content.hero.subline}
        statusBadge={content.hero.badge}
        primaryLabel={content.hero.ctaPrimary.label}
        secondaryLabel={content.hero.ctaSecondary.label}
        primaryHref={content.hero.ctaPrimary.href}
        secondaryHref={content.hero.ctaSecondary.href}
        secondaryExternal={content.hero.ctaSecondary.external}
        surveyBadge={content.mitwirkung.cta.badge}
        surveyDescription={content.mitwirkung.cta.description}
        surveyDate={content.mitwirkung.cta.date}
        hints={content.hero.hints}
      />
      <ProblemSection
        title={content.problem.title}
        intro={content.problem.intro}
        cards={[
          {
            title: content.problem.cards[0].headline,
            text: content.problem.cards[0].text,
          },
          {
            title: content.problem.cards[1].headline,
            text: content.problem.cards[1].text,
          },
          {
            title: content.problem.cards[2].headline,
            text: content.problem.cards[2].text,
          },
        ]}
      />
      <IdeaSection
        title={content.idea.title}
        items={[
          {
            headline: content.idea.cards[0].headline,
            sentence: content.idea.cards[0].text,
          },
          {
            headline: content.idea.cards[1].headline,
            sentence: content.idea.cards[1].text,
          },
          {
            headline: content.idea.cards[2].headline,
            sentence: content.idea.cards[2].text,
          },
        ]}
      />
      <StatusSection title={content.status.title} subtitle={content.status.intro} items={content.status.cards} />
      <AudienceSection title={content.audience.title} intro={content.audience.intro} items={content.audience.cards} />
      <MitwirkungSection
        title={content.mitwirkung.title}
        text={content.mitwirkung.text}
        href={content.mitwirkung.cta.href}
        buttonLabel={content.mitwirkung.cta.label}
        surveyBadge={content.mitwirkung.cta.badge}
        surveyDescription={content.mitwirkung.cta.description}
        surveyDate={content.mitwirkung.cta.date}
      />
      <FaqSection title={content.faq.title} items={content.faq.items} />
      <ContactCtaSection
        title={content.cta.title}
        text={content.cta.text}
        href={content.cta.button.href}
        buttonLabel={content.cta.button.label}
      />
    </>
  );
}
