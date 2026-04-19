import { ExternalLink } from "lucide-react";

export function Links() {
  const links = [
    { name: "Deutscher Rat für Wiederbelebung (GRC)", url: "#" },
    { name: "DIVI - Deutsche Interdisziplinäre Vereinigung für Intensiv- und Notfallmedizin", url: "#" },
    { name: "Ärztlicher Leiter Rettungsdienst (ÄLRD) Bundesverband", url: "#" },
    { name: "Open Source in der Medizin (Übersicht)", url: "#" },
  ];

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-6">Links & Ressourcen</h1>
      <p className="text-lg text-zinc-400 mb-12 max-w-2xl">
        Eine unvollständige Sammlung von Leitlinien, relevanten Verbänden und Referenzprojekten.
      </p>

      <ul className="space-y-4">
        {links.map((link, idx) => (
          <li key={idx}>
            <a 
              href={link.url}
              className="group flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 transition-colors"
            >
              <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-50">{link.name}</span>
              <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400" />
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-zinc-600 mt-8">
        Hinweis: Dies sind Platzhalter-Links zu beispielhaften Organisationen, die für das Projekt thematisch relevant sein könnten. Es besteht keine offizielle Partnerschaft.
      </p>
    </div>
  );
}
