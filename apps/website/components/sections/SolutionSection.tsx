import { CheckCircle2 } from "lucide-react";

import { Container } from "../layout/Container";

export function SolutionSection() {
  const solutions = [
    "Zentrale Verwaltung",
    "Mehrmandantenfähig",
    "Versionierung & Freigabe",
    "Schnelle Suche",
    "Offline verfügbar",
    "Mobile optimiert",
  ];

  return (
    <section className="bg-gray-900 py-16">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-black text-white md:text-6xl">Die Lösung</h2>
          <p className="mx-auto max-w-3xl text-2xl leading-tight font-bold text-gray-300 md:text-3xl">
            Eine Plattform.
            <br />
            Alles an einem Ort.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          {solutions.map((solution) => (
            <div
              key={solution}
              className="flex items-center gap-4 rounded-2xl border-4 border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all hover:border-green-400"
            >
              <CheckCircle2 className="h-10 w-10 flex-shrink-0 text-green-400" strokeWidth={3} />
              <p className="text-xl font-bold text-white md:text-2xl">{solution}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
