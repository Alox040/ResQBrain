import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";

export function HeroSection() {
  return (
    <SectionFrame id="hero">
      <Container maxWidth="wide">
        <div className="home-surface">
          <h1 className="home-title">Sichere medizinische Information. Klar und verlaesslich.</h1>
          <p className="home-subtitle">
            ResQBrain unterstuetzt Rettungsdienste mit ruhigen, gut lesbaren Inhalten fuer den
            Alltag und fuer kritische Momente.
          </p>
        </div>
      </Container>
    </SectionFrame>
  );
}
