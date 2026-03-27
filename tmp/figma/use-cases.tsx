import { Ambulance, GraduationCap, Building2, Stethoscope } from "lucide-react";

export function UseCases() {
  const useCases = [
    {
      icon: Ambulance,
      title: "Im Einsatz",
      description: "Schneller Zugriff direkt vor Ort",
    },
    {
      icon: GraduationCap,
      title: "Training",
      description: "Lernen mit aktuellen Inhalten",
    },
    {
      icon: Stethoscope,
      title: "Ärztliche Leitung",
      description: "Zentrale Leitlinienverwaltung",
    },
    {
      icon: Building2,
      title: "Organisationen",
      description: "Verwaltung für alle Standorte",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            Für wen?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold">
            Alle im Rettungsdienst
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border-4 border-blue-200 hover:border-blue-500 transition-all"
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-blue-500">
                  <useCase.icon className="w-9 h-9 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-xl text-gray-700 font-medium">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}