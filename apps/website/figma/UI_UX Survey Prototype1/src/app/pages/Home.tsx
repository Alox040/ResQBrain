import React, { useState } from 'react';
import { Container, Section, H1, H2, H3, BodyText, LabelText, Grid, Card, CalmCTA, Button } from '../components/Foundation';
import { TextSection, ExplanationSection } from '../components/Templates';
import { 
  FileText, 
  Brain, 
  RefreshCw, 
  Activity, 
  Stethoscope, 
  GraduationCap, 
  ChevronDown, 
  ClipboardList, 
  Github, 
  Mail 
} from 'lucide-react';

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="border-b border-white/5 py-6">
      <button 
        onClick={() => setOpen(!open)} 
        className="flex w-full items-center justify-between text-left cursor-pointer group"
      >
        <H3 className="!mb-0 !text-white/90 !font-normal group-hover:text-white transition-colors">
          {question}
        </H3>
        <ChevronDown 
          className={`text-white/30 transition-transform duration-300 ml-4 shrink-0 ${open ? 'rotate-180' : ''}`} 
          size={20}
        />
      </button>
      {open && (
        <div className="pt-4 pr-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <BodyText className="!mb-0">{answer}</BodyText>
        </div>
      )}
    </div>
  );
};

export const Home = () => {
  return (
    <div className="animate-in fade-in duration-500 relative overflow-hidden">
      
      {/* Background Watermarks */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[#29C5D9]/[0.02] to-[#1E61D9]/[0.01] blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-20%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#1E61D9]/[0.02] to-transparent blur-[100px] pointer-events-none" />

      {/* 1. Hero Section */}
      <Section className="pt-16 md:pt-24 lg:pt-32 relative z-10">
        <Container>
          <div className="max-w-3xl">
            <LabelText className="mb-6">ResQBrain Project</LabelText>
            <H1 className="!mb-6">Structuring medical guidelines for emergency services.</H1>
            <BodyText className="!text-lg md:!text-xl !mb-10">
              A collaborative initiative to create a clear, accessible, and offline-capable 
              platform for standard operating procedures in pre-hospital care.
            </BodyText>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">
                Read the concept
              </Button>
              <Button variant="outline">
                View current status
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Problem Section */}
      <Section>
        <Container>
          <div className="mb-12 max-w-2xl">
            <LabelText>The Challenge</LabelText>
            <H2>Information overload in critical moments.</H2>
            <BodyText>
              Emergency medical services operate in highly dynamic environments. Currently, 
              medical guidelines (SOPs) are often distributed as non-interactive PDFs or paper manuals, 
              creating friction when time is critical.
            </BodyText>
          </div>
          
          <Grid>
            <Card className="flex flex-col">
              <FileText className="text-[#1E61D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Fragmented Information</H3>
              <BodyText className="!mb-0 !text-sm flex-grow">
                Guidelines are scattered across different formats, physical folders, and siloed apps, 
                making quick and reliable retrieval difficult under stress.
              </BodyText>
            </Card>
            <Card className="flex flex-col">
              <Brain className="text-[#1E61D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Cognitive Overload</H3>
              <BodyText className="!mb-0 !text-sm flex-grow">
                Locating the right passage in long documents under time pressure increases
                cognitive load and the risk of missing critical details.
              </BodyText>
            </Card>
            <Card className="flex flex-col">
              <RefreshCw className="text-[#1E61D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Update Synchronization</H3>
              <BodyText className="!mb-0 !text-sm flex-grow">
                Ensuring all operational personnel across a region are acting on the exact same, 
                most recently approved medical guidelines is an administrative challenge.
              </BodyText>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* 3. Project Idea Section */}
      <TextSection 
        label="The Approach"
        title="A unified, offline-first knowledge base."
        content={
          <>
            <BodyText>
              ResQBrain translates static medical documents into a structured, machine-readable format. 
              Instead of searching through pages of a PDF, responders can access structured source documents 
              and approved reference texts quickly.
            </BodyText>
            <BodyText>
              The system is designed strictly as an offline-first reference tool. It synchronizes 
              discreetly in the background when an internet connection is available, ensuring absolute 
              reliability in rural areas or deep inside concrete structures where cellular connectivity fails.
            </BodyText>
          </>
        }
      />

      {/* 4. Status Section */}
      <div className="bg-white/[0.01] border-y border-white/5">
        <ExplanationSection 
          steps={[
            { 
              label: "Phase 1: Current", 
              title: "Data Modeling", 
              description: "Defining a standard schema that can represent complex medical documents and cross-references in a consistent, reviewable structure." 
            },
            { 
              label: "Phase 2: Upcoming", 
              title: "Editor Prototype", 
              description: "Building the web-based backend interface for medical directors to input, review, and formally version-control their local guidelines." 
            },
            { 
              label: "Phase 3: Planned", 
              title: "Field Application", 
              description: "Developing the highly optimized, offline-first mobile interface tailored specifically for active duty paramedics and emergency physicians." 
            }
          ]}
        />
      </div>

      {/* 5. Audience Section */}
      <Section>
        <Container>
          <div className="mb-12 max-w-2xl">
            <LabelText>Target Audience</LabelText>
            <H2>Designed for the entire rescue chain.</H2>
          </div>
          
          <Grid>
            <Card>
              <Activity className="text-[#29C5D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Paramedics & EMTs</H3>
              <BodyText className="!mb-0 !text-sm">
                Fast, reliable, and distraction-free access to approved reference content when needed.
              </BodyText>
            </Card>
            <Card>
              <Stethoscope className="text-[#29C5D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Medical Directors</H3>
              <BodyText className="!mb-0 !text-sm">
                Centralized control over guideline drafting, transparent approval workflows, and immediate fleet-wide deployment of updates.
              </BodyText>
            </Card>
            <Card>
              <GraduationCap className="text-[#29C5D9] mb-6" size={28} strokeWidth={1.5} />
              <H3>Educators</H3>
              <BodyText className="!mb-0 !text-sm">
                A transparent system to align academy training and simulation scenarios directly with the active field protocols.
              </BodyText>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* 6. Mitwirkung (Participation) Section */}
      <Section className="bg-white/[0.01] border-y border-white/5">
        <Container>
          <div className="mb-12 max-w-2xl">
            <LabelText>Participation</LabelText>
            <H2>Help shape the foundation.</H2>
            <BodyText>
              We are actively seeking input from field professionals to ensure the system solves 
              actual problems without adding administrative burden. This project relies on the 
              experience of those who will use it.
            </BodyText>
          </div>
          
          <Grid>
            <Card className="flex flex-col border-[#1E61D9]/20 hover:border-[#1E61D9]/40">
              <ClipboardList className="text-[#1E61D9] mb-4" size={24} strokeWidth={1.5} />
              <H3>Clinical Survey</H3>
              <BodyText className="!mb-6 !text-sm flex-grow">
                Share your experience with current SOP formats and highlight your biggest pain points in the field.
              </BodyText>
              <a href="#" className="text-sm tracking-wide text-[#1E61D9] hover:text-white transition-colors uppercase mt-auto inline-block">
                Take the survey →
              </a>
            </Card>
            <Card className="flex flex-col border-[#1E61D9]/20 hover:border-[#1E61D9]/40">
              <Github className="text-[#1E61D9] mb-4" size={24} strokeWidth={1.5} />
              <H3>Architecture Feedback</H3>
              <BodyText className="!mb-6 !text-sm flex-grow">
                Review our data models, contribute to the open technical discussion, and help refine the offline sync strategies.
              </BodyText>
              <a href="#" className="text-sm tracking-wide text-[#1E61D9] hover:text-white transition-colors uppercase mt-auto inline-block">
                View repository →
              </a>
            </Card>
            <Card className="flex flex-col border-[#1E61D9]/20 hover:border-[#1E61D9]/40">
              <Mail className="text-[#1E61D9] mb-4" size={24} strokeWidth={1.5} />
              <H3>Early Adopters</H3>
              <BodyText className="!mb-6 !text-sm flex-grow">
                Register your EMS organization's interest in participating in future beta testing and pilot implementation phases.
              </BodyText>
              <a href="#" className="text-sm tracking-wide text-[#1E61D9] hover:text-white transition-colors uppercase mt-auto inline-block">
                Contact us →
              </a>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* 7. FAQ Section */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            <LabelText className="text-center mb-4">Clarifications</LabelText>
            <H2 className="text-center !mb-12">Frequently asked questions</H2>
            
            <div className="border-t border-white/5">
              <FaqItem 
                question="Is this a commercial SaaS product?" 
                answer="No. ResQBrain is currently an independent research and development project focused entirely on improving pre-hospital care infrastructure without commercial incentives." 
              />
              <FaqItem 
                question="Does the application require an active internet connection?" 
                answer="Absolutely not. An offline-first architecture is our primary technical requirement. Devices sync in the background when connected, but the system functions 100% offline during operations." 
              />
              <FaqItem 
                question="Will this replace clinical judgment?" 
                answer="Never. The system is designed purely as an informational reference tool to reduce cognitive load. The medical provider on scene always makes the final clinical decision." 
              />
              <FaqItem 
                question="Where do the medical guidelines come from?" 
                answer="The platform itself does not provide medical content. It provides the technological structure for local medical directors and organizations to publish their own verified, legally binding guidelines to their respective teams." 
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 8. CTA Section */}
      <Section className="pb-24">
        <Container>
          <CalmCTA 
            title="Ready to contribute?"
            description="If you have technical expertise in offline-first architectures or clinical experience in EMS protocol development, we would like to hear from you."
            buttonText="Contact project lead"
          />
        </Container>
      </Section>
    </div>
  );
};