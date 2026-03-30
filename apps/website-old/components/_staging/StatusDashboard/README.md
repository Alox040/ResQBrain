# StatusDashboard

Staging-Komponente, aktuell nicht produktiv integriert.

## Export

`StatusDashboard` ist ein **Default Export**.

```tsx
import StatusDashboard from "./StatusDashboard";
```

## Verwendung

```tsx
import StatusDashboard from "./StatusDashboard";

export function Example() {
  return (
    <StatusDashboard
      systems={[
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
          status: "error",
          lastUpdate: "Vor 5 Min",
          details: "Verbindung unterbrochen",
        },
      ]}
      showSync={true}
      onSync={() => console.log("Sync triggered")}
    />
  );
}
```

## API (Props)

- `systems?`: `SystemStatus[]`
  - `name`: `string`
  - `status`: `"online" | "offline" | "syncing" | "error"`
  - `lastUpdate?`: `string`
  - `details?`: `string`
- `showSync?`: `boolean` (Default: `true`)
- `onSync?`: `() => void`
