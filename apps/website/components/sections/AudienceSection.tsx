import { Container } from "../layout/Container";

const audiences = [
  {
    title: "Rettungsdienste",
    text: "Brauchen schnelle, robuste Zugriffe auf freigegebenes Einsatzwissen.",
  },
  {
    title: "Aerztliche Leitungen",
    text: "Wollen Aenderungen nachvollziehbar pruefen und verantwortet freigeben.",
  },
  {
    title: "Ausbildung und Qualitaetsmanagement",
    text: "Profitieren von konsistenten Inhalten und sauber dokumentierten Versionen.",
  },
];

export function AudienceSection() {
  return (
    <section id="audience" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Zielgruppen</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Entwickelt fuer operative Teams und fachliche Verantwortung.
          </h2>
          <p className="muted" style={{ marginTop: "1rem" }}>
            Die Plattform adressiert sowohl den Einsatz vor Ort als auch Governance, Pflege und
            Weiterentwicklung medizinischer Inhalte.
          </p>
        </div>

        <div className="card-grid card-grid-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="card">
              <h3 style={{ fontSize: "1.15rem" }}>{audience.title}</h3>
              <p className="muted" style={{ marginTop: "0.8rem" }}>
                {audience.text}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
