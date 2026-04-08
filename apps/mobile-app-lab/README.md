# mobile-app-lab

Fully isolated UI sandbox for mobile app design exploration.

## Rules

- Do not import anything from `apps/mobile-app`.
- Do not modify `apps/mobile-app`.
- This folder is UI sandbox only (no production app coupling).

## Structure

- `figma-export/` - raw Figma exports and references.
- `src/components/` - reusable UI components for experiments.
- `src/screens/` - screen-level compositions.
- `src/navigation/` - sandbox navigation prototypes.
- `src/hooks/` - UI-only hooks for local experiments.
- `src/theme/` - colors, spacing, typography, and tokens for lab use.
- `src/assets/` - icons, images, and local UI assets.
- `experiments/` - temporary prototypes and throwaway explorations.
- `mapping/` - design-to-code mapping notes.

## Expo compatibility

The folder layout follows common Expo React Native conventions so an Expo app entrypoint can be added later without restructuring.

