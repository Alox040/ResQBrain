import { CheckCircle2, Clock, MessageSquare } from "lucide-react";

import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function SurveysSection() {
  const surveys = [
    {
      id: 1,
      title: "Einsatz-Feedback",
      description: "Wie nutzen Sie Protokolle im Einsatz?",
      status: "active",
      duration: "2 Min",
    },
    {
      id: 2,
      title: "Feature-Wünsche",
      description: "Welche Funktionen fehlen Ihnen?",
      status: "active",
      duration: "3 Min",
    },
    {
      id: 3,
      title: "App-Usability",
      description: "Bedienung unter Stress",
      status: "completed",
      duration: "Abgeschlossen",
    },
  ] as const;

  return (
    <section className="border-y-8 border-yellow-400 bg-yellow-50 py-12">
      <Container>
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-xl border-4 border-yellow-500 bg-yellow-400 px-6 py-3 text-gray-900">
            <MessageSquare className="h-7 w-7" strokeWidth={3} />
            <span className="text-xl font-black">Ihre Meinung zählt</span>
          </div>
          <h2 className="mb-3 text-4xl font-black text-gray-900 md:text-5xl">Umfragen</h2>
          <p className="text-xl font-semibold text-gray-700 md:text-2xl">Helfen Sie uns besser zu werden</p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className={`rounded-2xl border-4 p-8 shadow-lg transition-all ${
                survey.status === "active"
                  ? "border-yellow-400 bg-white hover:border-yellow-500 hover:shadow-xl"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="mb-6">
                {survey.status === "active" ? (
                  <div className="inline-flex items-center gap-2 rounded-lg border-2 border-green-400 bg-green-100 px-4 py-2">
                    <Clock className="h-5 w-5 text-green-700" strokeWidth={3} />
                    <span className="text-sm font-black text-green-800 uppercase">Aktiv</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-400 bg-gray-200 px-4 py-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-600" strokeWidth={3} />
                    <span className="text-sm font-black text-gray-700 uppercase">Fertig</span>
                  </div>
                )}
              </div>

              <h3
                className={`mb-4 text-2xl font-black md:text-3xl ${
                  survey.status === "active" ? "text-gray-900" : "text-gray-600"
                }`}
              >
                {survey.title}
              </h3>

              <p
                className={`mb-6 text-lg font-medium ${
                  survey.status === "active" ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {survey.description}
              </p>

              <div className="mb-6">
                <div
                  className={`inline-block rounded-lg border-2 px-4 py-2 ${
                    survey.status === "active"
                      ? "border-yellow-300 bg-yellow-100 text-yellow-900"
                      : "border-gray-300 bg-gray-200 text-gray-600"
                  }`}
                >
                  <span className="text-base font-bold">⏱ {survey.duration}</span>
                </div>
              </div>

              {survey.status === "active" ? (
                <Button className="h-16 w-full rounded-xl border-4 border-yellow-600 bg-yellow-500 text-xl font-black text-gray-900 shadow-lg hover:bg-yellow-600">
                  Teilnehmen
                  <MessageSquare className="ml-2 h-6 w-6" strokeWidth={3} />
                </Button>
              ) : (
                <Button
                  disabled
                  className="h-16 w-full cursor-not-allowed rounded-xl border-4 border-gray-400 bg-gray-300 text-xl font-black text-gray-500"
                >
                  Abgeschlossen
                  <CheckCircle2 className="ml-2 h-6 w-6" strokeWidth={3} />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="border-t-4 border-yellow-300 pt-6 text-center">
          <p className="mb-5 text-lg font-semibold text-gray-700">Haben Sie andere Anregungen?</p>
          <Button
            variant="outline"
            className="h-14 rounded-xl border-4 border-yellow-600 bg-white px-8 text-lg font-bold text-gray-900 hover:bg-yellow-50"
          >
            Direktes Feedback senden
          </Button>
        </div>
      </Container>
    </section>
  );
}
