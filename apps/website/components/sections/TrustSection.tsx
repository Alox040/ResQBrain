import { CheckCircle2, Shield, Zap } from "lucide-react";

import { Container } from "../layout/Container";

export function TrustSection() {
  const highlights = [
    { icon: Shield, title: "DSGVO", subtitle: "Datenschutz" },
    { icon: CheckCircle2, title: "Phase 0", subtitle: "Jetzt testen" },
    { icon: Zap, title: "24/7", subtitle: "Verfügbar" },
  ];

  return (
    <section className="bg-gray-900 py-16 text-white">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-black md:text-6xl">Sicher & Zuverlässig</h2>
          <p className="text-xl font-semibold text-gray-300 md:text-2xl">Entwickelt mit Rettungsdiensten</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border-4 border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm transition-all hover:border-green-400"
            >
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
                <item.icon className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
              <div className="mb-2 text-3xl font-black md:text-4xl">{item.title}</div>
              <div className="text-xl font-semibold text-gray-300">{item.subtitle}</div>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border-4 border-white/20 bg-white/10 p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-green-500 bg-green-900/40 p-6">
              <h4 className="mb-4 text-2xl font-black text-green-300">Verfügbar</h4>
              <ul className="space-y-2 text-lg font-medium text-white">
                <li>• Algorithmen</li>
                <li>• Medikamente</li>
                <li>• Mobile App</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-blue-400 bg-blue-900/40 p-6">
              <h4 className="mb-4 text-2xl font-black text-blue-300">Geplant</h4>
              <ul className="space-y-2 text-lg font-medium text-white">
                <li>• Offline-Sync</li>
                <li>• Org-Verwaltung</li>
                <li>• Versionen-UI</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
