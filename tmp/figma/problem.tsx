import { AlertCircle, Clock, FileQuestion, Users } from "lucide-react";

export function Problem() {
  const problems = [
    {
      icon: Clock,
      title: "Zeitdruck",
      description: "Info schwer zu finden",
    },
    {
      icon: FileQuestion,
      title: "Alte Protokolle",
      description: "Unterschiedliche Versionen",
    },
    {
      icon: Users,
      title: "Keine Standards",
      description: "Jede Org anders",
    },
    {
      icon: AlertCircle,
      title: "Keine Offline",
      description: "Wissen nicht verfügbar",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            Das Problem
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold">
            Im Notfall keine Zeit zu verlieren
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 border-4 border-gray-200 hover:border-red-500 transition-all"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center border-2 border-red-200">
                    <problem.icon className="w-9 h-9 text-red-600" strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-xl text-gray-700 font-medium">
                    {problem.description}
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