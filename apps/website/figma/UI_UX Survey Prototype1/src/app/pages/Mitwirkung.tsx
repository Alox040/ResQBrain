import React from 'react';
import { Container, Section, H1, H2, H3, BodyText, LabelText, Grid, Card, CalmCTA, Button } from '../components/Foundation';
import { FileText, MessageSquare, Video, Stethoscope, GraduationCap, Building2, ClipboardEdit, ArrowRight } from 'lucide-react';

export const Mitwirkung = () => {
  return (
    <div className="animate-in fade-in duration-500 relative overflow-hidden">
      {/* Background Watermarks */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#29C5D9]/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#1E61D9]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Intro */}
      <Section className="pt-16 md:pt-24 lg:pt-32 border-b border-white/5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1E61D9]/[0.03] via-transparent to-transparent relative z-10">
        <Container>
          <div className="max-w-3xl">
            <LabelText className="mb-6">Mitwirkung</LabelText>
            <H1 className="!mb-6">Built by the field, for the field.</H1>
            <BodyText className="!text-lg md:!text-xl !mb-0">
              ResQBrain is an open initiative. We believe that critical medical infrastructure 
              should not be developed in a vacuum. It requires the direct, unfiltered input of 
              the paramedics, emergency physicians, and medical directors who will rely on it.
            </BodyText>
          </div>
        </Container>
      </Section>

      {/* 2. Survey Block */}
      <Section className="relative z-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-7">
              <LabelText>Active Research</LabelText>
              <H2>Clinical Workflow Survey</H2>
              <BodyText>
                We are currently gathering data on how different EMS agencies manage their standard 
                operating procedures. Your input helps us identify the most critical bottlenecks in 
                pre-hospital information retrieval.
              </BodyText>
              <BodyText className="!mb-8">
                The survey takes approximately 5 minutes and is completely anonymous. 
                No organizational data is required.
              </BodyText>
              <Button href="#" variant="ghost" icon={ArrowRight} className="!px-0">
                Start survey
              </Button>
            </div>
            <div className="lg:col-span-5">
              <div className="p-8 border border-white/5 bg-white/[0.02]">
                <ClipboardEdit className="text-[#1E61D9] mb-6" size={32} strokeWidth={1.5} />
                <H3>Current participation</H3>
                <div className="text-3xl font-light text-white mb-2">342</div>
                <LabelText className="!text-white/40 !mb-0">Verified EMS Professionals</LabelText>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Community Block */}
      <Section className="bg-white/[0.01] border-y border-white/5 relative z-10">
        <Container>
          <div className="mb-12 max-w-2xl">
            <LabelText>Open Channels</LabelText>
            <H2>Join the discussion.</H2>
            <BodyText>
              We maintain active communities across different platforms to ensure transparent 
              development and gather diverse feedback on architecture, UX, and medical logic.
            </BodyText>
          </div>
          
          <Grid>
            <Card className="flex flex-col border-[#1E61D9]/10 hover:border-[#1E61D9]/30 group">
              <MessageSquare className="text-[#1E61D9] mb-6 opacity-80 group-hover:opacity-100 transition-opacity" size={28} strokeWidth={1.5} />
              <H3>Discord Server</H3>
              <BodyText className="!mb-6 !text-sm flex-grow">
                Our primary hub for technical architecture discussions, offline-first sync strategies, and direct exchange with the development team.
              </BodyText>
              <a href="#" className="text-sm tracking-wide text-white/50 group-hover:text-white transition-colors uppercase mt-auto inline-block">
                Connect →
              </a>
            </Card>
            <Card className="flex flex-col border-[#29C5D9]/10 hover:border-[#29C5D9]/30 group">
              <FileText className="text-[#29C5D9] mb-6 opacity-80 group-hover:opacity-100 transition-opacity" size={28} strokeWidth={1.5} />
              <H3>Reddit Community</H3>
              <BodyText className="!mb-6 !text-sm flex-grow">
                Asynchronous discussions about EMS protocols, international standard comparisons, and feedback on feature proposals.
              </BodyText>
              <a href="#" className="text-sm tracking-wide text-white/50 group-hover:text-white transition-colors uppercase mt-auto inline-block">
                Subscribe →
              </a>
            </Card>
            <Card className="flex flex-col border-white/10 hover:border-white/30 group">
              <Video className="text-white/70 mb-6 opacity-80 group-hover:opacity-100 transition-opacity" size={28} strokeWidth={1.5} />
              <H3>TikTok Updates</H3>
              <BodyText className="!mb-6 !text-sm flex-grow">
                Short-form visual demonstrations of the latest prototype features, editor capabilities, and rapid UI concept tests.
              </BodyText>
              <a href="#" className="text-sm tracking-wide text-white/50 group-hover:text-white transition-colors uppercase mt-auto inline-block">
                Follow →
              </a>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* 4. Collaboration Block */}
      <Section className="relative z-10">
        <Container>
          <div className="mb-12 max-w-2xl">
            <LabelText>Institutional Collaboration</LabelText>
            <H2>Building with partners.</H2>
            <BodyText>
              To ensure the platform meets strict regulatory and practical requirements, 
              we are establishing pilot collaborations with forward-thinking organizations.
            </BodyText>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 md:p-8 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-6 md:items-center">
              <div className="p-4 bg-white/5 shrink-0">
                <Building2 className="text-[#1E61D9]" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <H3 className="!mb-1">EMS Agencies (Rettungsdienste)</H3>
                <BodyText className="!mb-0 !text-sm">Partnering for beta deployments and real-world stress testing of the offline synchronization engine.</BodyText>
              </div>
            </div>
            
            <div className="p-6 md:p-8 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-6 md:items-center">
              <div className="p-4 bg-white/5 shrink-0">
                <GraduationCap className="text-[#29C5D9]" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <H3 className="!mb-1">Universities & Academies</H3>
                <BodyText className="!mb-0 !text-sm">Collaborating on didactic integration to ensure the tool aligns with current paramedic training standards.</BodyText>
              </div>
            </div>
            
            <div className="p-6 md:p-8 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-6 md:items-center">
              <div className="p-4 bg-white/5 shrink-0">
                <Stethoscope className="text-white/70" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <H3 className="!mb-1">Medical Directors (ÄLRD)</H3>
                <BodyText className="!mb-0 !text-sm">Working groups dedicated to refining the editor interface for legally secure SOP authoring and version control.</BodyText>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. CTA */}
      <Section className="pb-24 relative z-10">
        <Container>
          <CalmCTA 
            title="Become a collaboration partner"
            description="If your organization is interested in participating in the early closed-beta phase, please reach out to our coordination team."
            buttonText="Mitwirken & Updates"
            href="/anmeldung"
          />
        </Container>
      </Section>
    </div>
  );
};