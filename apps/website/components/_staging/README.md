# Staging Components

**Status:** NOT INTEGRATED - Isolated for future use

## Purpose
These components are designed for ResQBrain but not yet integrated into the main application. They are optimized for emergency medical personnel (paramedics, EMTs) with focus on:

- Fast information scanning
- Minimal cognitive load
- Large touch targets (64px+)
- High contrast readability
- One-hand mobile usage
- Critical information first
- Minimal visual clutter

## Available Components

### 1. QuickSearchWidget
Fast search interface for protocols, drugs, and guidelines.
- **Path:** `/apps/website/components/_staging/QuickSearchWidget/`
- **Use Case:** Main search, header widget, dashboard
- **Key Features:** Recent searches, popular searches, one-hand usage

### 2. AlertBanner
Critical alerts and notifications with high visibility.
- **Path:** `/apps/website/components/_staging/AlertBanner/`
- **Use Case:** System alerts, updates, warnings
- **Key Features:** 4 severity levels, dismissible, action buttons

### 3. StatusDashboard
System health and sync status monitoring.
- **Path:** `/apps/website/components/_staging/StatusDashboard/`
- **Use Case:** Settings page, system overview
- **Key Features:** Real-time status, sync controls, offline monitoring

## Design System

### Colors
- **Critical/Error:** Red (#DC2626)
- **Warning:** Yellow (#EAB308)
- **Info:** Blue (#2563EB)
- **Success:** Green (#16A34A)
- **Primary:** Indigo (#4F46E5)

### Touch Targets
- Minimum: 48px (12 in Tailwind)
- Recommended: 64px (h-16)
- Critical actions: 80px (h-20)

### Typography
- Titles: text-2xl to text-4xl, font-black
- Body: text-lg to text-xl, font-semibold/font-medium
- Small text: text-base minimum

### Spacing
- Cards: p-6 (24px)
- Gaps: gap-4 to gap-6 (16-24px)
- Sections: py-12 to py-16 (48-64px)

### Borders
- Standard: border-4
- Emphasis: border-6 to border-8
- Subtle: border-2

## Integration Guidelines

When integrating these components:

1. **Import a staging component**
   ```tsx
   import QuickSearchWidget from "@/components/_staging/QuickSearchWidget/QuickSearchWidget";
   ```

2. **Maintain high contrast**
   - Ensure parent containers don't reduce contrast
   - Keep border-4 for touch feedback

3. **Preserve touch targets**
   - Don't reduce button heights below h-14
   - Maintain spacing for thumb-reachable areas

4. **Test under stress**
   - Bright sunlight readability
   - Gloved hand usage
   - One-hand operation
   - Quick scanning

5. **Keep minimal**
   - Remove unnecessary text
   - Use icons for quick recognition
   - Prioritize critical info

## Development Notes

- All components use Tailwind CSS v4
- Icons from lucide-react
- No external dependencies beyond React
- TypeScript with strict props
- Mobile-first responsive design
- Accessibility considerations for screen readers

## Next Steps

1. User testing with paramedics/EMTs
2. Performance optimization
3. Offline functionality integration
4. Animation and transition refinement
5. Accessibility audit
6. Dark mode variants (for night shifts)

---

**Created:** 2026-03-27  
**For:** ResQBrain Phase 0 MVP  
**Target Users:** Rettungsdienst, Notfallsanitäter, Paramedics, EMTs
