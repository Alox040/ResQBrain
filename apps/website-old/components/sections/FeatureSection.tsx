import { BookOpen, GitBranch, Search, Shield, Smartphone, Users } from "lucide-react";
import { Container } from "../layout/Container";

export function FeatureSection() {
  const features = [
    { icon: Search, title: "Schnellsuche", description: "Finden in Sekunden", color: "blue" },
    { icon: BookOpen, title: "Algorithmen", description: "Alle Protokolle", color: "indigo" },
    { icon: GitBranch, title: "Versionen", description: "Immer aktuell", color: "purple" },
    { icon: Users, title: "Multi-Org", description: "Für alle Träger", color: "pink" },
    { icon: Smartphone, title: "Mobile", description: "In der Tasche", color: "green" },
    { icon: Shield, title: "Sicher", description: "DSGVO-konform", color: "red" },
  ] as const;

  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-700", border: "border-blue-300" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-700", border: "border-indigo-300" },
    purple: { bg: "bg-purple-50", icon: "text-purple-700", border: "border-purple-300" },
    pink: { bg: "bg-pink-50", icon: "text-pink-700", border: "border-pink-300" },
    green: { bg: "bg-green-50", icon: "text-green-700", border: "border-green-300" },
    red: { bg: "bg-red-50", icon: "text-red-700", border: "border-red-300" },
  };

  return (
    <section className="bg-white py-16">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-6xl">Funktionen</h2>
          <p className="text-xl font-semibold text-gray-700 md:text-2xl">Alles was Sie brauchen</p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const colors = colorMap[feature.color];
            return (
              <div
                key={feature.title}
                className={`${colors.bg} ${colors.border} rounded-2xl border-4 p-6 transition-transform hover:scale-105`}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <feature.icon className={`h-12 w-12 ${colors.icon}`} strokeWidth={2.5} />
                  <h3 className="text-xl font-black text-gray-900 md:text-2xl">{feature.title}</h3>
                  <p className="text-lg font-semibold text-gray-700">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
