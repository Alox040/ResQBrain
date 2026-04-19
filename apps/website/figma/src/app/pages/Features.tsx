import { Check } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Mandantenfähigkeit",
      description: "Klare Trennung von Daten. Jeder Rettungsdienstbereich sieht und pflegt ausschließlich seine eigenen Vorgaben."
    },
    {
      title: "Strukturierte Daten statt PDFs",
      description: "Inhalte werden nicht als statische Dokumente, sondern in strukturierten Formularen erfasst, was gezielte Such- und Filterfunktionen ermöglicht."
    },
    {
      title: "Historisierung",
      description: "Jede veröffentlichte Änderung erzeugt eine neue Version. Ältere Versionen bleiben archiviert und aufrufbar."
    },
    {
      title: "Medikamentendatenbank",
      description: "Basis-Datenbank für Standard-Präparate (Wirkstoff, Handelsname), die von Organisationen um eigene Dosierungsrichtlinien erweitert werden kann."
    },
    {
      title: "Rollen- und Rechtesystem",
      description: "Unterscheidung zwischen Administratoren (Technik), Redakteuren (Medizinische Pflege) und Lesern (Einsatzkräfte)."
    },
    {
      title: "Offline-Fähigkeit (Geplant)",
      description: "Für den Einsatz auf dem Fahrzeug muss die App auch im Funkloch zuverlässig den letzten synchronisierten Stand anzeigen können."
    }
  ];

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-6">Geplante Features</h1>
      <p className="text-lg text-zinc-400 mb-16 max-w-2xl">
        Eine Übersicht der Kernfunktionen, die im Rahmen der ersten Entwicklungsphase evaluiert und priorisiert werden.
      </p>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="h-6 w-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-zinc-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
