import { CheckCircle2 } from "lucide-react";

export function Solution() {
  const solutions = [
    "Zentrale Verwaltung",
    "Mehrmandantenfähig",
    "Versionierung & Freigabe",
    "Schnelle Suche",
    "Offline verfügbar",
    "Mobile optimiert",
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Die Lösung
          </h2>
          <p className="text-2xl md:text-3xl text-gray-300 font-bold max-w-3xl mx-auto leading-tight">
            Eine Plattform.<br/>
            Alles an einem Ort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {solutions.map((solution, index) => (
            <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border-4 border-white/20 rounded-2xl p-6 hover:border-green-400 transition-all">
              <CheckCircle2 className="w-10 h-10 text-green-400 flex-shrink-0" strokeWidth={3} />
              <p className="text-white text-xl md:text-2xl font-bold">{solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}