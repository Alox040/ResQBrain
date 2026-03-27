import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { cn } from "@/lib/cn";

function AppMockup() {
  return (
    <div className="w-full max-w-84 justify-self-center lg:justify-self-end" aria-hidden="true">
      <Card padding="none" className="p-3">
        <div className="mb-2 flex h-6 items-center justify-center">
          <span className="h-1 w-13 rounded-full bg-border" />
        </div>
        <div className="min-h-56 rounded-lg bg-surface-muted p-3 md:p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[0.7rem] font-semibold tracking-wide text-foreground">Medikamente</span>
            <span className="h-5 w-5 rounded-md border border-border bg-surface" />
          </div>
          <div className="flex flex-col gap-2.5">
            {[0.92, 0.78, 0.85].map((w, i) => (
              <div key={i} className="rounded-lg border border-border/80 bg-surface p-2.5">
                <div className="h-1.5 rounded-full bg-border" style={{ width: `${w * 100}%` }} />
                <div className="mt-1.5 h-1 w-[55%] rounded-full bg-border/70" />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full",
                  i === 0 ? "bg-muted" : "bg-border opacity-50",
                )}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function HeroSection() {
  return (
    <Section
      id="top"
      flush
      className="pt-[clamp(5rem,12vw,8rem)] pb-[clamp(3.5rem,8vw,6rem)]"
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.42fr)] lg:items-center">
          <div className="max-w-xl">
            <h1 className="m-0 text-[clamp(3rem,9.5vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground">
              ResQBrain
            </h1>
            <p className="muted mt-6 max-w-md text-[clamp(1.05rem,2vw,1.25rem)] leading-normal md:mt-8">
              Referenz auf dem Geraet: Medikamente, Algorithmen, SOP. Je Organisation. Versioniert.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Button variant="primary" href="/#cta" className="w-full sm:w-auto">
                Pilot
              </Button>
              <Button variant="outline" href="/#cta" className="w-full sm:w-auto">
                Kontakt
              </Button>
            </div>
          </div>

          <AppMockup />
        </div>
      </Container>
    </Section>
  );
}
