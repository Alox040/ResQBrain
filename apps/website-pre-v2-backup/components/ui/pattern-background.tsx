type PatternBackgroundPosition =
  | "top-right"
  | "top-left"
  | "center-right"
  | "center-left"
  | "bottom-right"
  | "bottom-left";

type PatternBackgroundSize = "sm" | "md" | "lg" | "xl";

type PatternBackgroundProps = {
  pattern: string;
  opacity?: number;
  position?: PatternBackgroundPosition;
  size?: PatternBackgroundSize;
  className?: string;
};

const positionClasses: Record<PatternBackgroundPosition, string> = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "center-right": "top-1/2 right-0 -translate-y-1/2",
  "center-left": "top-1/2 left-0 -translate-y-1/2",
  "bottom-right": "right-0 bottom-0",
  "bottom-left": "bottom-0 left-0",
};

/**
 * Größen-Presets für dekorative SVG-Hintergründe.
 * Die Werte sind bewusst zurückhaltend, damit Pattern als Akzent wirken.
 */
export const patternBackgroundSizeClasses: Record<PatternBackgroundSize, string> = {
  sm: "h-20 w-20 sm:h-24 sm:w-24",
  md: "h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44",
  lg: "h-40 w-40 sm:h-52 sm:w-52 lg:h-64 lg:w-64",
  xl: "h-52 w-52 sm:h-64 sm:w-64 lg:h-80 lg:w-80",
};

function toPublicPatternPath(pattern: string): string {
  if (pattern.startsWith("/")) {
    return pattern;
  }

  if (pattern.startsWith("svgs/")) {
    return `/${pattern}`;
  }

  return `/svgs/patterns/${pattern}`;
}

function clampOpacity(value: number): number {
  if (Number.isNaN(value)) {
    return 0.2;
  }

  return Math.min(1, Math.max(0, value));
}

export function PatternBackground({
  pattern,
  opacity = 0.2,
  position = "top-right",
  size = "md",
  className = "",
}: PatternBackgroundProps) {
  const safeOpacity = clampOpacity(opacity);
  const patternPath = toPublicPatternPath(pattern);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 bg-contain bg-center bg-no-repeat ${positionClasses[position]} ${patternBackgroundSizeClasses[size]} ${className}`.trim()}
      style={{
        opacity: safeOpacity,
        backgroundImage: `url(${patternPath})`,
      }}
    />
  );
}
