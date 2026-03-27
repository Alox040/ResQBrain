import { MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { Button } from "./ui/button";

export function Survey() {
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
  ];

  return (
    <section className="py-12 bg-yellow-50 border-y-8 border-yellow-400">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-yellow-400 text-gray-900 rounded-xl px-6 py-3 mb-4 border-4 border-yellow-500">
            <MessageSquare className="w-7 h-7" strokeWidth={3} />
            <span className="text-xl font-black">Ihre Meinung zählt</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Umfragen
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold">
            Helfen Sie uns besser zu werden
          </p>
        </div>

        {/* Survey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className={`rounded-2xl p-8 border-4 shadow-lg transition-all ${
                survey.status === "active"
                  ? "bg-white border-yellow-400 hover:border-yellow-500 hover:shadow-xl"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              {/* Status Badge */}
              <div className="mb-6">
                {survey.status === "active" ? (
                  <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-400 rounded-lg px-4 py-2">
                    <Clock className="w-5 h-5 text-green-700" strokeWidth={3} />
                    <span className="text-sm font-black text-green-800 uppercase">Aktiv</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gray-200 border-2 border-gray-400 rounded-lg px-4 py-2">
                    <CheckCircle2 className="w-5 h-5 text-gray-600" strokeWidth={3} />
                    <span className="text-sm font-black text-gray-700 uppercase">Fertig</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className={`text-2xl md:text-3xl font-black mb-4 ${
                survey.status === "active" ? "text-gray-900" : "text-gray-600"
              }`}>
                {survey.title}
              </h3>

              {/* Description */}
              <p className={`text-lg font-medium mb-6 ${
                survey.status === "active" ? "text-gray-700" : "text-gray-500"
              }`}>
                {survey.description}
              </p>

              {/* Duration */}
              <div className="mb-6">
                <div className={`inline-block px-4 py-2 rounded-lg border-2 ${
                  survey.status === "active"
                    ? "bg-yellow-100 border-yellow-300 text-yellow-900"
                    : "bg-gray-200 border-gray-300 text-gray-600"
                }`}>
                  <span className="text-base font-bold">⏱ {survey.duration}</span>
                </div>
              </div>

              {/* CTA Button */}
              {survey.status === "active" ? (
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-16 text-xl font-black rounded-xl border-4 border-yellow-600 shadow-lg"
                >
                  Teilnehmen
                  <MessageSquare className="ml-2 w-6 h-6" strokeWidth={3} />
                </Button>
              ) : (
                <Button 
                  disabled
                  className="w-full bg-gray-300 text-gray-500 h-16 text-xl font-black rounded-xl border-4 border-gray-400 cursor-not-allowed"
                >
                  Abgeschlossen
                  <CheckCircle2 className="ml-2 w-6 h-6" strokeWidth={3} />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6 border-t-4 border-yellow-300">
          <p className="text-lg text-gray-700 font-semibold mb-5">
            Haben Sie andere Anregungen?
          </p>
          <Button 
            variant="outline"
            className="bg-white border-yellow-600 text-gray-900 hover:bg-yellow-50 h-14 px-8 text-lg font-bold rounded-xl border-4"
          >
            Direktes Feedback senden
          </Button>
        </div>
      </div>
    </section>
  );
}