import { Search, BookOpen, GitBranch, Users, Smartphone, Shield } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Schnellsuche",
      description: "Finden in Sekunden",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "Algorithmen",
      description: "Alle Protokolle",
      color: "indigo",
    },
    {
      icon: GitBranch,
      title: "Versionen",
      description: "Immer aktuell",
      color: "purple",
    },
    {
      icon: Users,
      title: "Multi-Org",
      description: "Für alle Träger",
      color: "pink",
    },
    {
      icon: Smartphone,
      title: "Mobile",
      description: "In der Tasche",
      color: "green",
    },
    {
      icon: Shield,
      title: "Sicher",
      description: "DSGVO-konform",
      color: "red",
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-700", border: "border-blue-300" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-700", border: "border-indigo-300" },
    purple: { bg: "bg-purple-50", icon: "text-purple-700", border: "border-purple-300" },
    pink: { bg: "bg-pink-50", icon: "text-pink-700", border: "border-pink-300" },
    green: { bg: "bg-green-50", icon: "text-green-700", border: "border-green-300" },
    red: { bg: "bg-red-50", icon: "text-red-700", border: "border-red-300" },
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            Funktionen
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold">
            Alles was Sie brauchen
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorMap[feature.color];
            return (
              <div
                key={index}
                className={`${colors.bg} rounded-2xl p-6 border-4 ${colors.border} hover:scale-105 transition-transform`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <feature.icon className={`w-12 h-12 ${colors.icon}`} strokeWidth={2.5} />
                  <h3 className="text-xl md:text-2xl font-black text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}