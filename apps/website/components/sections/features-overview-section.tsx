import { SectionFrame } from "@/components/sections/section-frame";
import { ContentCard } from "@/components/ui/content-card";

const items = [
  {
    title: "Inhalte & Versionierung",
    body:
      "Medizinische und operative Inhalte (z. B. Algorithmen, Medikamente, Protokolle) werden als verwaltete Daten gedacht — mit klarem Lebenszyklus und Release-Einheiten, sobald die technische Basis steht.",
  },
  {
    title: "Organisation als Rahmen",
    body:
      "Jede Operation bleibt der Organisation zugeordnet. Ziel ist tenant-sichere Abgrenzung — keine stillen Querzugriffe über Mandantengrenzen hinweg.",
  },
  {
    title: "Ausspielung an die Praxis",
    body:
      "Langfristig: deterministische Pakete für Clients — z. B. für schnelle Suche und Einsatznutzung, inkl. Offline-Fähigkeit dort, wo es fachlich vorgesehen ist.",
  },
  {
    title: "Feedback & Priorisierung",
    body:
      "Umfrage- und Bedarfssignale können die Roadmap informieren, ersetzen aber keine fachliche Freigabe. Governance und medizinische Prüfung bleiben zentrale Prinzipien.",
  },
] as const;

export function FeaturesOverviewSection() {
  return (
    <SectionFrame
      id="funktionen"
      variant="band"
      eyebrow="Funktionen"
      title="Was ResQBrain langfristig leisten soll"
      description={
        <p>
          Die Plattform befindet sich in einer frühen Phase. Die folgenden Bausteine beschreiben die
          beabsichtigte Ausrichtung — nicht den Lieferumfang eines fertigen Produkts.
        </p>
      }
    >
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5">
        {items.map((item) => (
          <li key={item.title} className="min-w-0">
            <ContentCard title={item.title}>{item.body}</ContentCard>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
