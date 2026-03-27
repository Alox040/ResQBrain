import { Bell, Building2, Database, GitBranch, Share2, Wifi } from "lucide-react";

import { Container } from "../layout/Container";

export function RoadmapSection() {
  const features = [
    {
      icon: Wifi,
      name: "Offline-Sync",
      description: "Alle Daten immer verfügbar",
      status: "in-progress",
    },
    {
      icon: Building2,
      name: "Org-Verwaltung",
      description: "Verwaltung für Standorte",
      status: "in-progress",
    },
    {
      icon: GitBranch,
      name: "Versionen-UI",
      description: "Änderungen nachverfolgen",
      status: "testing",
    },
    {
      icon: Share2,
      name: "Content-Sharing",
      description: "Protokolle teilen",
      status: "planned",
    },
    {
      icon: Bell,
      name: "Benachrichtigungen",
      description: "Updates sofort erhalten",
      status: "planned",
    },
    {
      icon: Database,
      name: "Backup & Export",
      description: "Daten sichern",
      status: "planned",
    },
  ];

  const statusConfig = {
    "in-progress": {
      label: "In Arbeit",
      color: "bg-blue-100 border-blue-400 text-blue-900",
      dot: "bg-blue-600",
    },
    testing: {
      label: "Testing",
      color: "bg-purple-100 border-purple-400 text-purple-900",
      dot: "bg-purple-600",
    },
    planned: {
      label: "Geplant",
      color: "bg-gray-200 border-gray-400 text-gray-700",
      dot: "bg-gray-500",
    },
  } as const;

  return (
    <section className="border-y-4 border-blue-200 bg-gradient-to-br from-indigo-50 to-blue-50 py-12">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-4xl font-black text-gray-900 md:text-5xl">Geplante Funktionen</h2>
          <p className="text-xl font-semibold text-gray-700 md:text-2xl">In Entwicklung für Sie</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const status = statusConfig[feature.status as keyof typeof statusConfig];
            return (
              <div
                key={feature.name}
                className="rounded-2xl border-4 border-blue-200 bg-white p-6 shadow-md transition-all hover:border-blue-400"
              >
                <div className="mb-5">
                  <div className={`inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 ${status.color}`}>
                    <div className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
                    <span className="text-sm font-black uppercase">{status.label}</span>
                  </div>
                </div>

                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-100">
                    <feature.icon className="h-7 w-7 text-blue-700" strokeWidth={2.5} />
                  </div>
                  <h3 className="pt-1 text-2xl leading-tight font-black text-gray-900">{feature.name}</h3>
                </div>

                <p className="text-lg font-medium text-gray-700">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 border-t-4 border-blue-200 pt-8">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${config.dot}`} />
                <span className="text-base font-bold text-gray-700">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
