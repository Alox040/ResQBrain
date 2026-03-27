import DrugReferenceCard from "../_staging/DrugReferenceCard/DrugReferenceCard";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const sampleDosages = [
  { route: "i.v.", amount: "1 mg", concentration: "1:10.000" },
  { route: "i.m.", amount: "0,3-0,5 mg", concentration: "1:1.000" },
];

const sampleWarnings = ["Vorsicht bei Herzerkrankungen", "Kann Tachykardie verursachen"];
const sampleContraindications = ["Schwere Hypertonie", "Thyreotoxikose"];

export function DrugReferenceSection() {
  return (
    <Section id="drug-reference">
      <Container>
        <SectionHeader
          title="Medikamenten-Referenz"
          description="Beispielhafte Darstellung einer einsatznahen Dosierungsansicht mit Warnhinweisen und Kontraindikationen."
        />

        <div className="mx-auto max-w-3xl">
          <DrugReferenceCard
            name="Adrenalin"
            genericName="Epinephrin"
            category="Notfallmedikament"
            indication="Anaphylaxie, Reanimation"
            dosages={sampleDosages}
            warnings={sampleWarnings}
            contraindications={sampleContraindications}
          />
        </div>
      </Container>
    </Section>
  );
}
