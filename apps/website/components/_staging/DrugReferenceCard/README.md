# DrugReferenceCard

**Status:** Staging - Not integrated

## Purpose
Quick medication reference card for emergency personnel showing dosages, warnings, and contraindications with high readability under stress.

## Features
- Drug name and generic name
- Category badge
- Clear indication
- Multiple dosage routes
- Concentration information
- Color-coded warnings (yellow)
- Color-coded contraindications (red)
- Large, readable dosage amounts
- Professional medical layout

## Usage

```tsx
import DrugReferenceCard from "./DrugReferenceCard";

<DrugReferenceCard
  name="Adrenalin"
  genericName="Epinephrin"
  category="Notfallmedikament"
  indication="Anaphylaxie, Reanimation"
  dosages={[
    {
      route: "i.v.",
      amount: "1 mg",
      concentration: "1:10.000"
    },
    {
      route: "i.m.",
      amount: "0,3-0,5 mg",
      concentration: "1:1.000"
    }
  ]}
  warnings={[
    "Vorsicht bei Herzerkrankungen",
    "Kann Tachykardie verursachen"
  ]}
  contraindications={[
    "Schwere Hypertonie",
    "Thyreotoxikose"
  ]}
/>
```

## Props

- `name` (`string`): Drug brand/common name
- `genericName` (`string`, optional): Generic pharmaceutical name
- `indication` (`string`): Primary medical indication
- `dosages` (`{ route: string; amount: string; concentration?: string }[]`): Array of dosage objects
- `contraindications` (`string[]`, optional): Array of contraindications
- `warnings` (`string[]`, optional): Array of warnings
- `category` (`string`): Drug category/class

## Export API

- `default export`: `DrugReferenceCard`

```tsx
import DrugReferenceCard from "./DrugReferenceCard";
```

## Design Optimizations
- Dosage amounts in extra large font (text-3xl)
- Color-coded sections for quick scanning
- Warnings in yellow, contraindications in red
- High contrast borders (border-4)
- Clear visual hierarchy
- Mobile-responsive layout
- Icons for quick section identification
