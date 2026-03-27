import { Ambulance, Building2, GraduationCap, Stethoscope } from "lucide-react";

import { Container } from "../layout/Container";

export function UseCasesSection() {
  const useCases = [
    { icon: Ambulance, title: "Im Einsatz", description: "Schneller Zugriff direkt vor Ort" },
    { icon: GraduationCap, title: "Training", description: "Lernen mit aktuellen Inhalten" },
    { icon: Stethoscope, title: "Ärztliche Leitung", description: "Zentrale Leitlinienverwaltung" },
    { icon: Building2, title: "Organisationen", description: "Verwaltung für alle Standorte" },
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-6xl">Für wen?</h2>
          <p className="text-xl font-semibold text-gray-700 md:text-2xl">Alle im Rettungsdienst</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-2xl border-4 border-blue-200 bg-white p-8 transition-all hover:border-blue-500"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border-2 border-blue-500 bg-blue-600">
                  <useCase.icon className="h-9 w-9 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-black text-gray-900 md:text-3xl">{useCase.title}</h3>
                  <p className="text-xl font-medium text-gray-700">{useCase.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
