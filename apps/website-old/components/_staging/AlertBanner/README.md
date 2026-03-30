# AlertBanner

**Status:** Staging - not integrated

## Export API

`AlertBanner.tsx` exports `AlertBanner` as **default export**.

```tsx
import AlertBanner from "./AlertBanner";
```

## Usage

```tsx
import AlertBanner from "./AlertBanner";

export function Example() {
  return (
    <AlertBanner
      type="critical"
      title="Notfall-Update"
      message="Neue Reanimations-Leitlinie verfugbar"
      actionLabel="Jetzt ansehen"
      onAction={() => console.log("Action clicked")}
      onDismiss={() => console.log("Dismissed")}
    />
  );
}
```

## Props

- `type`: `"critical" | "warning" | "info" | "success"` (required)
- `title`: `string` (required)
- `message`: `string` (required)
- `dismissible`: `boolean` (optional, default: `true`)
- `onDismiss`: `() => void` (optional)
- `actionLabel`: `string` (optional; shown only together with `onAction`)
- `onAction`: `() => void` (optional; action button renders only with `actionLabel`)
