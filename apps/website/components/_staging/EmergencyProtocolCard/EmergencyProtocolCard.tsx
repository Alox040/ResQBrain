import { FileText, Clock, AlertCircle } from "lucide-react";

interface EmergencyProtocolCardProps {
  title: string;
  category: string;
  lastUpdated: string;
  priority: "critical" | "high" | "standard";
  steps?: number;
  version?: string;
}

export default function EmergencyProtocolCard({
  title,
  category,
  lastUpdated,
  priority,
  steps,
  version = "1.0",
}: EmergencyProtocolCardProps) {
  const priorityConfig = {
    critical: {
      bg: "bg-red-50",
      border: "border-red-500",
      badge: "bg-red-600 text-white",
      label: "KRITISCH",
    },
    high: {
      bg: "bg-orange-50",
      border: "border-orange-500",
      badge: "bg-orange-600 text-white",
      label: "WICHTIG",
    },
    standard: {
      bg: "bg-blue-50",
      border: "border-blue-400",
      badge: "bg-blue-600 text-white",
      label: "STANDARD",
    },
  };

  const config = priorityConfig[priority];

  return (
    <div
      className={`${config.bg} rounded-2xl p-6 border-4 ${config.border} hover:shadow-2xl transition-all`}
    >
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-5">
        <div className={`${config.badge} px-4 py-2 rounded-lg border-2 border-white/30`}>
          <span className="text-sm font-black uppercase">{config.label}</span>
        </div>
        {priority === "critical" && (
          <AlertCircle className="w-8 h-8 text-red-600" strokeWidth={3} />
        )}
      </div>

      {/* Category */}
      <div className="mb-3">
        <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
          {category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-5 leading-tight">
        {title}
      </h3>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-3 mb-5">
        {steps && (
          <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-lg border-2 border-gray-300">
            <FileText className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
            <span className="text-sm font-bold text-gray-900">{steps} Schritte</span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-lg border-2 border-gray-300">
          <Clock className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
          <span className="text-sm font-bold text-gray-900">{lastUpdated}</span>
        </div>
        <div className="bg-white/60 px-3 py-2 rounded-lg border-2 border-gray-300">
          <span className="text-sm font-bold text-gray-900">v{version}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t-2 border-gray-300">
        <span className="text-lg font-black text-gray-900">Notfallprotokoll</span>
      </div>
    </div>
  );
}
