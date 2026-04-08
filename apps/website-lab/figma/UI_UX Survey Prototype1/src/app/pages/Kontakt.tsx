import React from 'react';
import { Container, Section, H1, H2, H3, BodyText, LabelText, Grid, Card, Button } from '../components/Foundation';
import { Mail, Building2, GraduationCap, Handshake, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export const Kontakt = () => {
  return (
    <div className="animate-in fade-in duration-500 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#1E61D9]/[0.02] rounded-full blur-[100px] pointer-events-none" />
      
      {/* 1. Intro */}
      <Section className="pt-16 md:pt-24 lg:pt-32 border-b border-white/5 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#29C5D9]/[0.03] via-transparent to-transparent relative z-10">
        <Container>
          <div className="max-w-3xl">
            <LabelText className="mb-6">Contact</LabelText>
            <H1 className="!mb-6">Get in touch.</H1>
            <BodyText className="!text-lg md:!text-xl !mb-0">
              ResQBrain is an independent, non-commercial initiative. We welcome direct inquiries 
              regarding institutional collaboration, technical contributions, and early adoption partnerships.
            </BodyText>
          </div>
        </Container>
      </Section>

      {/* 2. Contact Block */}
      <Section className="relative z-10">
        <Container>
          <div className="max-w-4xl">
            <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-[#1E61D9]/20 bg-[#1E61D9]/[0.02]">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <Mail className="text-[#1E61D9]" size={24} strokeWidth={1.5} />
                  <H3 className="!mb-0 !text-[#1E61D9]">Project Coordination</H3>
                </div>
                <BodyText className="!mb-0 !text-sm max-w-lg">
                  For official inquiries, partnership requests, or media contact. 
                  We aim to review and respond to institutional requests within 48 hours.
                </BodyText>
              </div>
              <Button 
                href="mailto:contact@resqbrain.org"
                variant="secondary"
                icon={ArrowRight}
                className="shrink-0"
              >
                Send Email
              </Button>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 3. Collaboration */}
      <Section className="bg-white/[0.01] border-y border-white/5 relative z-10">
        <Container>
          <div className="mb-12 max-w-2xl">
            <LabelText>Partnerships</LabelText>
            <H2>Collaboration areas.</H2>
            <BodyText>
              We are actively building a network of field experts to ensure the platform 
              remains practically relevant and structurally sound.
            </BodyText>
          </div>

          <Grid>
            <Card>
              <Building2 className="text-[#29C5D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>EMS Organizations</H3>
              <BodyText className="!mb-0 !text-sm">
                Reach out if your agency is interested in participating as an early beta-tester 
                for the offline synchronization and field application prototype.
              </BodyText>
            </Card>
            <Card>
              <GraduationCap className="text-[#29C5D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Paramedic Schools</H3>
              <BodyText className="!mb-0 !text-sm">
                We partner with academies to integrate the tool into simulation training, 
                bridging the gap between theoretical education and active duty.
              </BodyText>
            </Card>
            <Card>
              <Handshake className="text-[#29C5D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Medical Directors</H3>
              <BodyText className="!mb-0 !text-sm">
                Collaborate with us on refining the editor prototype to ensure it meets the 
                legal, hierarchical, and structural requirements for SOP authoring.
              </BodyText>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* 4. Community */}
      <Section className="pb-24 relative z-10">
        <Container>
          <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center p-8 border border-white/5 bg-[#070d1c]">
              <div className="p-4 bg-white/5 shrink-0 rounded-none">
                <MessageSquare className="text-white/60" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <H3 className="!mb-2 !text-white/90">General discussions & feedback</H3>
                <BodyText className="!mb-4 !text-sm">
                  For technical architecture questions, UX feedback, or general protocol discussions, 
                  please use our public community channels. This allows other professionals to benefit 
                  from and contribute to the conversation.
                </BodyText>
                <Link to="/links" className="text-sm tracking-wide text-white/50 hover:text-white transition-colors uppercase inline-flex items-center gap-2 group">
                  View community channels
                  <ArrowRight size={16} className="text-white/30 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};