# QuickSearchWidget

**Status:** Staging - Not integrated

## Purpose
Fast search interface for emergency protocols, medications, and guidelines optimized for one-hand usage under stress.

## Features
- Large search input with clear button
- Recent searches quick access
- Popular searches pills
- Focus state with enhanced border
- Keyboard-friendly
- Touch-optimized buttons
- Visual feedback on interaction

## Usage

```tsx
import QuickSearchWidget from "./QuickSearchWidget";

<QuickSearchWidget
  onSearch={(query) => console.log("Searching:", query)}
  recentSearches={["Reanimation", "Anaphylaxie", "Adrenalin"]}
  popularSearches={["ACS", "Schlaganfall", "Intubation", "STEMI"]}
/>
```

## Props

- `onSearch?`: Called when a search is triggered
- `recentSearches?`: Recent search terms shown as quick actions
- `popularSearches?`: Popular search terms shown as quick actions

## Design Optimizations
- Large touch targets (min 48px)
- High contrast focus states
- One-hand thumb-reachable pills
- Minimal cognitive load with categories
- Quick clear button for fast resets
- Mobile-first responsive design
