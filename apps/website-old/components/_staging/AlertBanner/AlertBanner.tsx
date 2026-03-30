import { AlertTriangle, Info, CheckCircle, X, ChevronRight } from "lucide-react";

interface AlertBannerProps {
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AlertBanner({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
  actionLabel,
  onAction,
}: AlertBannerProps) {
  const typeConfig = {
    critical: {
      bg: "bg-red-600",
      border: "border-red-700",
      text: "text-white",
      icon: AlertTriangle,
      iconBg: "bg-red-700",
    },
    warning: {
      bg: "bg-yellow-500",
      border: "border-yellow-600",
      text: "text-gray-900",
      icon: AlertTriangle,
      iconBg: "bg-yellow-600",
    },
    info: {
      bg: "bg-blue-600",
      border: "border-blue-700",
      text: "text-white",
      icon: Info,
      iconBg: "bg-blue-700",
    },
    success: {
      bg: "bg-green-600",
      border: "border-green-700",
      text: "text-white",
      icon: CheckCircle,
      iconBg: "bg-green-700",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;
  const showDismissButton = dismissible && typeof onDismiss === "function";

  return (
    <div
      className={`${config.bg} ${config.text} rounded-2xl border-4 ${config.border} shadow-2xl overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`${config.iconBg} rounded-xl p-3 flex-shrink-0`}>
            <Icon className="w-8 h-8" strokeWidth={3} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl md:text-3xl font-black mb-2 leading-tight">
              {title}
            </h3>
            <p className="text-lg md:text-xl font-semibold leading-snug">
              {message}
            </p>

            {/* Action Button */}
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className={`mt-4 flex items-center gap-2 px-5 py-3 rounded-xl font-black text-lg border-3 transition-all ${
                  type === "warning"
                    ? "bg-gray-900 text-white border-gray-800 hover:bg-gray-800"
                    : "bg-white/20 border-white/30 hover:bg-white/30"
                }`}
              >
                {actionLabel}
                <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Dismiss Button */}
          {showDismissButton && (
            <button
              onClick={onDismiss}
              type="button"
              aria-label="Dismiss alert"
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                type === "warning"
                  ? "bg-yellow-600 hover:bg-yellow-700 text-gray-900"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <X className="w-6 h-6" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Optional Progress Bar for Critical Alerts */}
      {type === "critical" && (
        <div className="h-2 bg-red-700">
          <div className="h-full bg-red-400 animate-pulse" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
