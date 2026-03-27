import { Shield, CheckCircle2, Zap } from "lucide-react";

export function Trust() {
  const highlights = [
    {
      icon: Shield,
      title: "DSGVO",
      subtitle: "Datenschutz",
    },
    {
      icon: CheckCircle2,
      title: "Phase 0",
      subtitle: "Jetzt testen",
    },
    {
      icon: Zap,
      title: "24/7",
      subtitle: "Verfügbar",
    },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Sicher & Zuverlässig
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 font-semibold">
            Entwickelt mit Rettungsdiensten
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {highlights.map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm border-4 border-white/20 rounded-2xl p-8 text-center hover:border-green-400 transition-all">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4">
                <item.icon className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-3xl md:text-4xl font-black mb-2">{item.title}</div>
              <div className="text-xl text-gray-300 font-semibold">{item.subtitle}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm border-4 border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900/40 border-2 border-green-500 rounded-xl p-6">
              <h4 className="text-2xl font-black mb-4 text-green-300">✓ Verfügbar</h4>
              <ul className="text-lg text-white space-y-2 font-medium">
                <li>• Algorithmen</li>
                <li>• Medikamente</li>
                <li>• Mobile App</li>
              </ul>
            </div>
            <div className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6">
              <h4 className="text-2xl font-black mb-4 text-blue-300">⚡ Geplant</h4>
              <ul className="text-lg text-white space-y-2 font-medium">
                <li>• Offline-Sync</li>
                <li>• Org-Verwaltung</li>
                <li>• Versionen-UI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}