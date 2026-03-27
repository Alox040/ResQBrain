# EmergencyProtocolCard

**Status:** Staging - Not integrated

## Usage

```tsx
import EmergencyProtocolCard from "./EmergencyProtocolCard";

<EmergencyProtocolCard
  title="Reanimation Erwachsene"
  category="Notfall"
  lastUpdated="Heute"
  priority="critical"
  steps={8}
  version="2.1"
/>
```

## Props

- `title`: Protocol title
- `category`: Protocol category
- `lastUpdated`: Last update label
- `priority`: "critical" | "high" | "standard"
- `steps?`: Number of steps
- `version?`: Version label (default: `"1.0"`)
