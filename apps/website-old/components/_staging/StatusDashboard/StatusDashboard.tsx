import { Wifi, WifiOff, Database, AlertCircle, CheckCircle, Clock, Download } from "lucide-react";

interface SystemStatus {
  name: string;
  status: "online" | "offline" | "syncing" | "error";
  lastUpdate?: string;
  details?: string;
}

interface StatusDashboardProps {
  systems?: SystemStatus[];
  showSync?: boolean;
  onSync?: () => void;
}

export default function StatusDashboard({
  systems = [
    {
      name: "Datenbank",
      status: "online",
      lastUpdate: "Vor 2 Min",
      details: "Alle Protokolle aktuell",
    },
    {
      name: "Offline-Daten",
      status: "syncing",
      lastUpdate: "Jetzt",
      details: "42 von 50 Protokolle",
    },
    {
      name: "Server",
      status: "online",
      lastUpdate: "Vor 1 Min",
      details: "Verbindung stabil",
    },
  ],
  showSync = false,
  onSync,
}: StatusDashboardProps) {
  const statusConfig = {
    online: {
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border-green-400",
      badge: "bg-green-600 text-white",
      label: "ONLINE",
      iconColor: "text-green-600",
    },
    offline: {
      icon: WifiOff,
      bg: "bg-gray-50",
      border: "border-gray-400",
      badge: "bg-gray-600 text-white",
      label: "OFFLINE",
      iconColor: "text-gray-600",
    },
    syncing: {
      icon: Download,
      bg: "bg-blue-50",
      border: "border-blue-400",
      badge: "bg-blue-600 text-white",
      label: "SYNC",
      iconColor: "text-blue-600",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-red-50",
      border: "border-red-400",
      badge: "bg-red-600 text-white",
      label: "FEHLER",
      iconColor: "text-red-600",
    },
  };
  const showSyncButton = showSync && typeof onSync === "function";

  return (
    <div className="bg-white rounded-2xl border-4 border-gray-300 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 p-6 border-b-4 border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-white" strokeWidth={2.5} />
            <h2 className="text-3xl font-black text-white">System-Status</h2>
          </div>
          {showSyncButton && (
            <button
              onClick={onSync}
              type="button"
              aria-label="Sync systems"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-black border-3 border-blue-500 transition-all"
            >
              <Download className="w-5 h-5" strokeWidth={3} />
              Sync
            </button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="p-6 space-y-4">
        {systems.map((system, index) => {
          const config = statusConfig[system.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={index}
              className={`${config.bg} rounded-xl p-5 border-4 ${config.border}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${config.border}`}>
                  <StatusIcon 
                    className={`w-8 h-8 ${config.iconColor} ${
                      system.status === "syncing" ? "animate-bounce" : ""
                    }`}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">
                      {system.name}
                    </h3>
                    <div className={`${config.badge} px-3 py-1 rounded-lg border-2 border-white/30 flex-shrink-0`}>
                      <span className="text-xs font-black uppercase">{config.label}</span>
                    </div>
                  </div>

                  {system.details && (
                    <p className="text-base font-semibold text-gray-700 mb-2">
                      {system.details}
                    </p>
                  )}

                  {system.lastUpdate && (
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Clock className="w-4 h-4" strokeWidth={2.5} />
                      <span>{system.lastUpdate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t-4 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-green-600" strokeWidth={2.5} />
            <span className="text-sm font-bold text-gray-700">
              Verbindung stabil
            </span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">
            Letztes Update: Jetzt
          </span>
        </div>
      </div>
    </div>
  );
}
