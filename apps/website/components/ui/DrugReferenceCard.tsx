import { AlertTriangle, Info, Pill, Syringe } from "lucide-react";

interface Dosage {
  route: string;
  amount: string;
  concentration?: string;
}

interface DrugReferenceCardProps {
  name: string;
  genericName?: string;
  indication: string;
  dosages: Dosage[];
  contraindications?: string[];
  warnings?: string[];
  category: string;
}

export default function DrugReferenceCard({
  name,
  genericName,
  indication,
  dosages,
  contraindications = [],
  warnings = [],
  category,
}: DrugReferenceCardProps) {
  return (
    <div className="bg-white rounded-2xl border-4 border-indigo-400 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-6 border-b-4 border-indigo-700">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-14 h-14 bg-indigo-700 rounded-xl flex items-center justify-center shrink-0">
            <Pill className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-indigo-200 uppercase mb-1">{category}</div>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">{name}</h3>
            {genericName && (
              <p className="text-lg font-semibold text-indigo-200 mt-1">
                {genericName}
              </p>
            )}
          </div>
        </div>
        <div className="bg-indigo-700 rounded-lg p-4 border-2 border-indigo-600">
          <p className="text-lg font-bold text-white">
            <span className="text-indigo-300">Indikation:</span> {indication}
          </p>
        </div>
      </div>

      {/* Dosages */}
      <div className="p-6 bg-gray-50 border-b-4 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Syringe className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />
          <h4 className="text-2xl font-black text-gray-900 uppercase">Dosierung</h4>
        </div>
        <div className="space-y-3">
          {dosages.map((dosage, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border-4 border-indigo-200"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="text-lg font-black text-indigo-700 uppercase">
                  {dosage.route}
                </span>
                <span className="text-2xl md:text-3xl font-black text-gray-900">
                  {dosage.amount}
                </span>
              </div>
              {dosage.concentration && (
                <p className="text-base font-semibold text-gray-600">
                  Konzentration: {dosage.concentration}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-6 bg-yellow-50 border-b-4 border-yellow-300">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-700" strokeWidth={3} />
            <h4 className="text-xl font-black text-gray-900 uppercase">Warnungen</h4>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-700 font-black shrink-0">&bull;</span>
                <span className="text-base font-semibold text-gray-900">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contraindications */}
      {contraindications.length > 0 && (
        <div className="p-6 bg-red-50 border-b-4 border-red-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-black text-lg">!</span>
            </div>
            <h4 className="text-xl font-black text-gray-900 uppercase">Kontraindikationen</h4>
          </div>
          <ul className="space-y-2">
            {contraindications.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-red-600 font-black shrink-0">&times;</span>
                <span className="text-base font-semibold text-gray-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-4 bg-gray-100 border-t-4 border-gray-300">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
          <Info className="w-5 h-5" strokeWidth={2.5} />
          <span>Immer aktuelle Fachinformation beachten</span>
        </div>
      </div>
    </div>
  );
}
