import React from 'react';
import { Container, Section, H2, H3, BodyText, Grid, Card, CalmCTA, LabelText } from './Foundation';

export const TextSection = ({ label, title, content }: { label?: string, title: string, content: React.ReactNode }) => (
  <Section>
    <Container>
      <div className="max-w-3xl">
        {label && <LabelText>{label}</LabelText>}
        <H2>{title}</H2>
        <div className="space-y-4">
          {content}
        </div>
      </div>
    </Container>
  </Section>
);

export const CardGridSection = ({ label, title, description, items }: { label?: string, title: string, description?: string, items: { title: string, text: string }[] }) => (
  <Section>
    <Container>
      <div className="mb-12 max-w-2xl">
        {label && <LabelText>{label}</LabelText>}
        <H2>{title}</H2>
        {description && <BodyText>{description}</BodyText>}
      </div>
      <Grid>
        {items.map((item, idx) => (
          <Card key={idx}>
            <H3>{item.title}</H3>
            <BodyText className="!mb-0 text-sm md:text-base">{item.text}</BodyText>
          </Card>
        ))}
      </Grid>
    </Container>
  </Section>
);

export const InfoSection = ({ label, title, content, aside }: { label?: string, title: string, content: React.ReactNode, aside: React.ReactNode }) => (
  <Section className="bg-white/[0.01] border-y border-white/5">
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-7">
          {label && <LabelText>{label}</LabelText>}
          <H2>{title}</H2>
          <div className="space-y-4">
            {content}
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="p-8 border border-[#4f7db3]/20 bg-[#4f7db3]/5">
            {aside}
          </div>
        </div>
      </div>
    </Container>
  </Section>
);

export const CtaSection = ({ title, description, buttonText }: { title: string, description: string, buttonText: string }) => (
  <Section>
    <Container>
      <CalmCTA title={title} description={description} buttonText={buttonText} />
    </Container>
  </Section>
);

export const ExplanationSection = ({ steps }: { steps: { label: string, title: string, description: string }[] }) => (
  <Section>
    <Container>
      <div className="space-y-16">
        {steps.map((step, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
            <div className="md:col-span-3">
              <LabelText className="!text-white/40 !mb-0">{step.label}</LabelText>
            </div>
            <div className="md:col-span-9 max-w-2xl">
              <H3 className="!text-white/90 !text-2xl">{step.title}</H3>
              <BodyText className="!mb-0">{step.description}</BodyText>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);