import { AlertCircle, Clock, FileQuestion, Users } from "lucide-react";

import { Container } from "../layout/Container";

export function ProblemSection() {
  const problems = [
    { icon: Clock, title: "Zeitdruck", description: "Info schwer zu finden" },
    { icon: FileQuestion, title: "Alte Protokolle", description: "Unterschiedliche Versionen" },
    { icon: Users, title: "Keine Standards", description: "Jede Org anders" },
    { icon: AlertCircle, title: "Keine Offline", description: "Wissen nicht verfügbar" },
  ];

  return (
    <section className="bg-white py-16">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-6xl">Das Problem</h2>
          <p className="text-xl font-semibold text-gray-700 md:text-2xl">Im Notfall keine Zeit zu verlieren</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border-4 border-gray-200 bg-gray-50 p-8 transition-all hover:border-red-500"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-red-200 bg-red-100">
                    <problem.icon className="h-9 w-9 text-red-600" strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-black text-gray-900">{problem.title}</h3>
                  <p className="text-xl font-medium text-gray-700">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
