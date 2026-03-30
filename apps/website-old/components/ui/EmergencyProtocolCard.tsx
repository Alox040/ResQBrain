import { AlertCircle, Clock, FileText } from "lucide-react";

export type EmergencyProtocolPriority = "critical" | "high" | "standard";

type EmergencyProtocolCardProps = {
  title: string;
  category: string;
  lastUpdated: string;
  priority: EmergencyProtocolPriority;
  steps?: number;
  version?: string;
};

const priorityConfig: Record<
  EmergencyProtocolPriority,
  { bg: string; border: string; badge: string; label: string }
> = {
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

export function EmergencyProtocolCard({
  title,
  category,
  lastUpdated,
  priority,
  steps,
  version = "1.0",
}: EmergencyProtocolCardProps) {
  const config = priorityConfig[priority];

  return (
    <div className={`${config.bg} rounded-2xl border-4 ${config.border} p-6 transition-all hover:shadow-2xl`}>
      <div className="mb-5 flex items-start justify-between">
        <div className={`${config.badge} rounded-lg border-2 border-white/30 px-4 py-2`}>
          <span className="text-sm font-black uppercase">{config.label}</span>
        </div>
        {priority === "critical" ? (
          <AlertCircle className="h-8 w-8 text-red-600" strokeWidth={3} aria-hidden="true" />
        ) : null}
      </div>

      <div className="mb-3">
        <span className="text-sm font-bold uppercase tracking-wide text-gray-600">{category}</span>
      </div>

      <h3 className="mb-5 text-2xl font-black leading-tight text-gray-900 md:text-3xl">{title}</h3>

      <div className="mb-5 flex flex-wrap gap-3">
        {steps ? (
          <div className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white/60 px-3 py-2">
            <FileText className="h-5 w-5 text-gray-700" strokeWidth={2.5} aria-hidden="true" />
            <span className="text-sm font-bold text-gray-900">{steps} Schritte</span>
          </div>
        ) : null}
        <div className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white/60 px-3 py-2">
          <Clock className="h-5 w-5 text-gray-700" strokeWidth={2.5} aria-hidden="true" />
          <span className="text-sm font-bold text-gray-900">{lastUpdated}</span>
        </div>
        <div className="rounded-lg border-2 border-gray-300 bg-white/60 px-3 py-2">
          <span className="text-sm font-bold text-gray-900">v{version}</span>
        </div>
      </div>

      <div className="border-t-2 border-gray-300 pt-4">
        <span className="text-lg font-black text-gray-900">Notfallprotokoll</span>
      </div>
    </div>
  );
}
