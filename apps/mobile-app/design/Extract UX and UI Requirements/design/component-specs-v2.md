# ResQBrain - Component Specifications v2
## UX Refinement - Design System

**Status:** Draft - Not Integrated  
**Version:** 2.0  
**Date:** March 27, 2026

---

## Design Tokens

### Spacing System (4px base unit)

```css
--spacing-xs: 4px;    /* 0.25rem */
--spacing-sm: 8px;    /* 0.5rem */
--spacing-md: 12px;   /* 0.75rem */
--spacing-lg: 16px;   /* 1rem */
--spacing-xl: 20px;   /* 1.25rem */
--spacing-2xl: 24px;  /* 1.5rem */
--spacing-3xl: 32px;  /* 2rem */
--spacing-4xl: 40px;  /* 2.5rem */
```

**Usage:**
- Card padding: `--spacing-xl` (20px)
- Section spacing: `--spacing-lg` (16px)
- List item padding: `--spacing-lg` (16px vertical), `--spacing-xl` (20px horizontal)
- Component margins: `--spacing-lg` (16px)

### Typography Scale

```css
/* Font Sizes (Refined for Emergency Use) */
--font-size-6xl: 56px;   /* Critical dosage - INCREASED */
--font-size-5xl: 48px;   /* Emergency dosage */
--font-size-4xl: 44px;   /* Pediatric dosage */
--font-size-3xl: 36px;   /* Step numbers (collapsed) */
--font-size-2xl: 28px;   /* Page heading - INCREASED */
--font-size-xl: 20px;    /* Section heading - INCREASED */
--font-size-lg: 18px;    /* Body text - INCREASED */
--font-size-base: 16px;  /* Secondary body */
--font-size-sm: 14px;    /* Labels */
--font-size-xs: 12px;    /* Captions */

/* Line Heights */
--line-height-tight: 1.25;   /* Headings */
--line-height-normal: 1.5;   /* Body text - INCREASED */
--line-height-relaxed: 1.75; /* Descriptive text */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Letter Spacing */
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;  /* Category headers */
```

### Tap Target Sizes

```css
/* Minimum Touch Targets (WCAG AAA + Emergency Optimization) */
--tap-minimum: 48px;    /* Absolute minimum */
--tap-primary: 56px;    /* Primary actions - INCREASED */
--tap-list-item: 72px;  /* List items - INCREASED */
--tap-tab-bar: 64px;    /* Tab bar items */
```

**Application:**
- All interactive elements: 48×48px minimum
- Primary buttons (Next, Save, etc.): 56×56px
- List items: Full width × 72px height
- Tab bar: Full width/3 × 64px height
- Icon buttons: 48×48px

### Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;  /* Standard card radius */
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;
```

**Consistency Rule:** All cards use `--radius-md` (12px)

### Border Widths

```css
--border-default: 1px;     /* Standard separators */
--border-emphasis: 2px;    /* Emphasized elements */
--border-critical: 3px;    /* Critical information */
```

**Application:**
- Standard cards: 1px
- Critical dosage cards: 3px
- Warning banners: 2px
- List separators: 1px

### Color System (Dark Mode Emergency)

```css
/* Backgrounds */
--color-bg-primary: #000000;      /* True black (OLED) */
--color-bg-card: #18181b;         /* zinc-900 */
--color-bg-elevated: #27272a;     /* zinc-800 */
--color-bg-overlay: rgba(0,0,0,0.8);

/* Text */
--color-text-primary: #ffffff;    /* White (21:1 on black) */
--color-text-secondary: #a1a1aa;  /* zinc-400 */
--color-text-tertiary: #71717a;   /* zinc-500 */
--color-text-disabled: #52525b;   /* zinc-600 */

/* Critical Colors */
--color-critical: #dc2626;        /* red-600 */
--color-critical-bg: #450a0a;     /* red-950 */
--color-critical-light: #fca5a5;  /* red-300 */

/* Warning Colors */
--color-warning: #f59e0b;         /* amber-500 */
--color-warning-bg: #451a03;      /* amber-950 */
--color-warning-light: #fcd34d;   /* amber-300 */

/* Interactive */
--color-interactive: #dc2626;     /* red-600 (emergency context) */
--color-interactive-hover: #b91c1c; /* red-700 */
--color-interactive-active: #991b1b; /* red-800 */

/* Borders */
--color-border-default: #27272a;  /* zinc-800 */
--color-border-subtle: #18181b;   /* zinc-900 */
--color-border-critical: #dc2626; /* red-600 */
```

---

## Component Specifications

### 1. Status Bar

**Dimensions:** Full width × 32px  
**Background:** `#000000` (true black)  
**Content:** Time (left), Offline badge (right)

```css
.status-bar {
  height: 32px;
  padding: 12px 24px 8px;
  background: #000000;
}

.offline-badge {
  background: #fbbf24; /* amber-400 */
  color: #000000;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 700;
  animation: pulse 2s infinite;
}
```

**Improvement:** Pulsing animation on badge for high visibility

---

### 2. Header (Refined)

**Dimensions:** Full width × 56px minimum  
**Background:** `#000000`  
**Border:** Bottom 1px `#27272a`

```css
.header {
  min-height: 56px;
  padding: 12px 16px;
  background: #000000;
  border-bottom: 1px solid #27272a;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-back-button {
  min-width: 48px;
  min-height: 48px;
  padding: 8px;
  margin-left: -8px; /* Align to edge */
  color: #dc2626;
  font-size: 16px;
  font-weight: 600;
}

.header-back-icon {
  width: 24px;
  height: 24px;
  stroke-width: 3px; /* Thicker for visibility */
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-action {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}

.header-action-icon {
  width: 28px;
  height: 28px;
}
```

**Improvements:**
- Back button: 48×48px tap target, red color for emergency context
- Thicker back icon (3px stroke)
- Larger favorite icon (28px)
- Centered title with absolute positioning

---

### 3. Search Bar (Refined)

**Dimensions:** Full width × 56px (primary action size)  
**Border:** 2px `#dc2626` with 50% opacity

```css
.search-bar {
  min-height: 56px;
  padding: 16px 20px;
  background: #27272a; /* zinc-800 */
  border-radius: 12px;
  border: 2px solid rgba(220, 38, 38, 0.5);
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-bar:focus-within {
  border-color: #dc2626;
}

.search-icon {
  width: 28px;
  height: 28px;
  color: #dc2626;
  stroke-width: 2.5px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  outline: none;
}

.search-input::placeholder {
  color: #71717a; /* zinc-500 */
}

.search-clear {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
  margin-right: -12px;
}
```

**Improvements:**
- Height: 56px (up from 48px) for easier thumb reach
- Icon: 28px (up from 24px)
- Auto-focus on mount
- Red border for emergency priority
- Larger clear button tap target

**Auto-Focus Behavior:**
```tsx
<input autoFocus />
```

---

### 4. List Item (Refined)

**Dimensions:** Full width × 72px minimum  
**Padding:** 20px horizontal, 16px vertical

```css
.list-item {
  min-height: 72px;
  padding: 16px 20px;
  background: #000000;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #27272a;
  transition: background-color 0.15s;
}

.list-item:hover,
.list-item:active {
  background: #18181b; /* zinc-900 */
}

.list-item.critical {
  background: rgba(69, 10, 10, 0.2); /* red-950 20% */
  border-left: 4px solid #dc2626;
}

.list-item-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.list-item-content {
  flex: 1;
  min-width: 0;
}

.list-item-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-subtitle {
  font-size: 14px;
  color: #71717a; /* zinc-500 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-dosage {
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
  color: #f87171; /* red-400 */
  margin-top: 4px;
}

.list-item-chevron {
  width: 28px;
  height: 28px;
  color: #52525b; /* zinc-600 */
  stroke-width: 2px;
  flex-shrink: 0;
}
```

**Improvements:**
- Height: 72dp (up from 64dp) - 12.5% increase
- Dosage shown inline for medications
- Larger icons (28px from 20px)
- Title: 20px (up from 18px)
- Critical items: Red left border + tinted background

---

### 5. Card (Unified Design)

**Padding:** 20px (consistent)  
**Border Radius:** 12px (consistent)  
**Border Width:** 1px standard, 3px critical

```css
.card {
  padding: 20px;
  border-radius: 12px;
  background: #18181b; /* zinc-900 */
  border: 1px solid #27272a; /* zinc-800 */
}

.card-critical {
  background: #450a0a; /* red-950 */
  border: 3px solid #dc2626; /* red-600 */
}

.card-warning {
  background: #451a03; /* amber-950 */
  border: 2px solid #f59e0b; /* amber-500 */
}
```

**Improvements:**
- Removed multiple border styles (now only 1px or 3px)
- Removed shadow variations (single level only)
- Consistent padding (20px)
- Consistent radius (12px)

---

### 6. Dosage Block (Emergency Optimized)

**Font Size:** 56px (6xl) - INCREASED from 36px  
**Border:** 3px red  
**Padding:** 24px

```css
.dosage-block {
  padding: 24px;
  background: #450a0a; /* red-950 */
  border: 3px solid #dc2626; /* red-600 */
  border-radius: 12px;
}

.dosage-label {
  font-size: 12px;
  font-weight: 700;
  color: #f87171; /* red-400 */
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.dosage-value {
  font-family: monospace;
  font-size: 56px; /* INCREASED */
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 8px;
}

.dosage-interval {
  font-size: 18px;
  font-weight: 600;
  color: #fecaca; /* red-200 */
  line-height: 1.4;
}
```

**Visual Impact:**
- 56% larger than v1 (36px → 56px)
- Monospace font prevents misreading
- AAA contrast ratio (16:1)
- 3px border for maximum prominence

**Pediatric Dosage:**
```css
.dosage-value-pediatric {
  font-size: 44px; /* Slightly smaller but still prominent */
}
```

---

### 7. Algorithm Step (Refined)

**Current Step Number:** 60px  
**Collapsed Step Number:** 28px  
**Progress Bar:** 8px height

```css
.algorithm-step-current {
  padding: 20px;
  background: #450a0a; /* red-950 */
  border: 3px solid #dc2626; /* red-600 */
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3);
}

.step-number-current {
  font-family: monospace;
  font-size: 60px;
  font-weight: 700;
  color: #f87171; /* red-400 */
  line-height: 1;
}

.step-title-current {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  margin-bottom: 8px;
}

.step-description-current {
  font-size: 18px;
  color: #fecaca; /* red-200 */
  line-height: 1.6;
}

.step-next-button {
  min-height: 56px;
  padding: 16px 24px;
  background: #dc2626;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  border-radius: 12px;
  margin-top: 16px;
  width: 100%;
}

/* Collapsed/Upcoming Steps */
.algorithm-step-collapsed {
  padding: 16px;
  min-height: 72px;
  background: #18181b; /* zinc-900 */
  border: 1px solid #27272a;
  border-radius: 12px;
}

.step-number-collapsed {
  font-family: monospace;
  font-size: 28px;
  font-weight: 700;
  color: #71717a; /* zinc-500 */
}

.step-title-collapsed {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 8px; /* INCREASED from 2px */
  background: #27272a; /* zinc-800 */
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 8px;
  background: #dc2626;
  border-radius: 9999px;
  transition: width 0.3s ease;
}
```

**Improvements:**
- Current step number: 60px (25% larger)
- Progress bar: 8px (4× thicker for visibility)
- "Next Step" button: 56px height
- Shadow on current step for depth
- Collapsed steps: Expandable (future)

---

### 8. Tab Bar (3-Tab Layout)

**Height:** 64px  
**Tab Width:** 33.33% each

```css
.tab-bar {
  height: 64px;
  padding: 8px;
  background: #000000;
  border-top: 1px solid #27272a;
  display: flex;
  justify-content: space-around;
}

.tab-item {
  flex: 1;
  max-width: 33.33%;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border-radius: 12px;
  transition: background-color 0.15s;
}

.tab-item:active {
  background: #18181b;
}

.tab-icon {
  width: 28px;
  height: 28px;
}

.tab-icon.active {
  color: #dc2626;
  stroke-width: 2.5px;
}

.tab-icon.inactive {
  color: #71717a; /* zinc-500 */
  stroke-width: 2px;
}

.tab-label {
  font-size: 13px;
  font-weight: 700;
}

.tab-label.active {
  color: #dc2626;
}

.tab-label.inactive {
  color: #71717a;
}
```

**Tab Configuration:**
- Home: Home icon
- Lookup: Search icon (combines Medications + Algorithms)
- Saved: Star icon

**Improvements:**
- Reduced from 4 to 3 tabs (33% larger tap area)
- Icons: 28px (up from 24px)
- Label: 13px (up from 11px)
- Thicker stroke on active (2.5px)

---

### 9. Warning Banner

**Border:** 2px  
**Padding:** 16px

```css
.warning-banner {
  padding: 16px;
  background: #451a03; /* amber-950 */
  border: 2px solid #f59e0b; /* amber-500 */
  border-radius: 12px;
  display: flex;
  align-items: start;
  gap: 12px;
}

.warning-icon {
  width: 24px;
  height: 24px;
  color: #fbbf24; /* amber-400 */
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.warning-description {
  font-size: 16px;
  color: #fde68a; /* amber-200 */
  line-height: 1.6;
}
```

**Contraindication Variant:**
```css
.warning-banner-critical {
  background: #450a0a; /* red-950 */
  border: 2px solid #dc2626; /* red-600 */
}

.warning-icon-critical {
  color: #f87171; /* red-400 */
}

.warning-description-critical {
  color: #fecaca; /* red-200 */
}
```

---

### 10. Alphabet Jump Bar (Condensed)

**Height:** 32px  
**Button Size:** 24×24px

```css
.alphabet-bar {
  padding: 8px 16px;
  background: #000000;
  border-bottom: 1px solid #27272a;
  position: sticky;
  top: 76px; /* Below search */
  z-index: 10;
}

.alphabet-buttons {
  display: flex;
  gap: 4px;
  justify-content: space-between;
}

.alphabet-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #27272a; /* zinc-800 */
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #71717a; /* zinc-500 */
  transition: all 0.15s;
}

.alphabet-button:hover,
.alphabet-button:active {
  background: #dc2626;
  color: #ffffff;
}
```

**Improvement:** Condensed to single row, smaller buttons (24px), less visual weight

---

## Thumb Reach Zones

### Zone Classification

```
┌─────────────────────────┐  ← Top of screen
│                         │
│   SAFE ZONE (20%)      │  Read-only, passive content
│                         │
├─────────────────────────┤
│                         │
│   STRETCH ZONE (30%)   │  Secondary actions, less frequent
│                         │
├─────────────────────────┤
│                         │
│   EASY ZONE (30%)      │  Primary actions, frequent use
│                         │  ← SEARCH BAR, QUICK ACCESS
├─────────────────────────┤
│                         │
│   NATURAL ZONE (20%)   │  Navigation, tabs, back button
│                         │  ← TAB BAR
└─────────────────────────┘  ← Bottom of screen
```

### Component Placement by Zone

**Natural Zone (Bottom 20%):**
- Tab bar
- Bottom sheet actions (future)
- Floating action button (future)

**Easy Zone (20-50% from bottom):**
- Search bar
- Quick access buttons
- List items (top portion)
- Primary action buttons

**Stretch Zone (50-80% from bottom):**
- List items (middle/top)
- Secondary actions
- Content cards

**Safe Zone (Top 20%):**
- Header/title
- Status bar
- Read-only information

---

## Accessibility Compliance

### Contrast Ratios (WCAG AAA)

| Element | Foreground | Background | Ratio | Grade |
|---------|-----------|------------|-------|-------|
| Critical dosage | #ffffff | #450a0a | 16:1 | AAA |
| Body text | #ffffff | #000000 | 21:1 | AAA |
| Secondary text | #a1a1aa | #000000 | 9.7:1 | AAA |
| Tertiary text | #71717a | #000000 | 5.2:1 | AA |
| Warning text | #fde68a | #451a03 | 11:1 | AAA |
| Critical border | #dc2626 | #000000 | 5.3:1 | AA |

### Touch Target Compliance

| Element | Size | WCAG Level |
|---------|------|------------|
| List items | 72dp | AAA+ |
| Primary buttons | 56dp | AAA+ |
| Tab bar items | 64dp | AAA+ |
| Icon buttons | 48dp | AAA |
| Text links | 48dp min | AAA |

### Color Independence

All colored elements must have non-color indicators:

- **Critical items:** Red border + AlertTriangle icon
- **Favorites:** Star icon (filled/unfilled)
- **Warnings:** Warning icon + "WARNING" text
- **Progress:** Percentage text + bar

---

## Performance Specifications

### Transition Timing

```css
/* Instant transitions for local data */
.instant {
  transition-duration: 0ms;
}

/* Quick feedback */
.quick {
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

/* Smooth animations */
.smooth {
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}
```

**Application:**
- Screen transitions: 0ms (instant)
- Button hover: 150ms
- List item hover: 150ms
- Progress bar: 300ms

### Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #18181b 0%,
    #27272a 50%,
    #18181b 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Usage:** First load only, maximum 300ms visibility

---

## Implementation Checklist

### Phase 1 (High Priority)
- [ ] Update dosage font to 56px
- [ ] Increase list item height to 72dp
- [ ] Add auto-focus to search bars
- [ ] Show dosage inline in medication lists
- [ ] Reduce tabs from 4 to 3
- [ ] Update all tap targets to minimum 48dp
- [ ] Implement 4px spacing system

### Phase 2 (Medium Priority)
- [ ] Unify card styles (12px radius, 20px padding)
- [ ] Update algorithm step numbers to 60px
- [ ] Increase progress bar to 8px
- [ ] Condense alphabet jump bar
- [ ] Update border widths (1px/3px only)
- [ ] Implement skeleton states

### Phase 3 (Nice to Have)
- [ ] Add step completion tracking
- [ ] Implement long-press quick actions
- [ ] Add swipe gestures
- [ ] Optimize for tablet screens
- [ ] Add haptic feedback

---

**Last Updated:** March 27, 2026  
**Status:** Draft - Pending Implementation
