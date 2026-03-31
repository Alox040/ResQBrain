import type { VitalAgeGroupSection } from './vitalReferenceTypes';

/**
 * Orientation values only — derived from common teaching ranges.
 * Organisation-specific targets (z. B. Ziel-MAP, SpO₂ bei CO₂-Retention) are not modeled here.
 */
export const VITAL_REFERENCE_SECTIONS: VitalAgeGroupSection[] = [
  {
    id: 'adult',
    label: 'Erwachsene',
    scope: 'ca. ab 12 Jahren (Ruhewerte, Orientierung)',
    cards: [
      {
        id: 'heart_rate',
        title: 'Herzfrequenz',
        unit: '/min',
        range: '60 – 100',
        hint: 'variabel bei Stress, Fieber, Medikation',
      },
      {
        id: 'respiratory_rate',
        title: 'Atemfrequenz',
        unit: '/min',
        range: '12 – 20',
        hint: 'bei Schub eher höher',
      },
      {
        id: 'systolic_bp',
        title: 'Blutdruck systolisch',
        unit: 'mmHg',
        range: 'ca. 90 – 140',
        hint: 'interindividuell stark; Schockzeichen beachten',
      },
      {
        id: 'diastolic_bp',
        title: 'Blutdruck diastolisch',
        unit: 'mmHg',
        range: 'ca. 60 – 90',
      },
      {
        id: 'spo2_room_air',
        title: 'SpO₂ (Raumluft)',
        unit: '%',
        range: '≥ 94',
        hint: 'Zielwerte nach Protokoll / Pathologie anpassen',
      },
      {
        id: 'temp_c',
        title: 'Körpertemperatur',
        unit: '°C',
        range: 'ca. 36,0 – 37,5',
        hint: 'Messort beachten (oral/rektal/tympanal)',
      },
    ],
  },
  {
    id: 'child',
    label: 'Kind',
    scope: 'ca. 1 – 12 Jahre (Orientierung)',
    cards: [
      {
        id: 'heart_rate',
        title: 'Herzfrequenz',
        unit: '/min',
        range: 'ca. 70 – 120',
        hint: 'jünger tendenziell höher',
      },
      {
        id: 'respiratory_rate',
        title: 'Atemfrequenz',
        unit: '/min',
        range: 'ca. 18 – 30',
      },
      {
        id: 'systolic_bp',
        title: 'RR systolisch (geschätzt)',
        unit: 'mmHg',
        range: 'ca. 90 + (2 × Alter J.)',
        hint: 'nur grobe Formel — Messung am Patienten',
      },
      {
        id: 'diastolic_bp',
        title: 'RR diastolisch',
        unit: 'mmHg',
        range: '55 – 75',
        hint: 'weit gefasst; Alter & Größe',
      },
      {
        id: 'spo2_room_air',
        title: 'SpO₂ (Raumluft)',
        unit: '%',
        range: '≥ 94',
        hint: 'Kind oft schneller desaturierend',
      },
      {
        id: 'temp_c',
        title: 'Körpertemperatur',
        unit: '°C',
        range: 'ca. 36,5 – 37,5',
      },
    ],
  },
  {
    id: 'infant',
    label: 'Säugling',
    scope: 'ca. 0 – 12 Monate (Orientierung)',
    cards: [
      {
        id: 'heart_rate',
        title: 'Herzfrequenz',
        unit: '/min',
        range: 'ca. 100 – 160',
        hint: 'Schlaf / Wach stark schwankend',
      },
      {
        id: 'respiratory_rate',
        title: 'Atemfrequenz',
        unit: '/min',
        range: 'ca. 30 – 60',
      },
      {
        id: 'systolic_bp',
        title: 'RR systolisch',
        unit: 'mmHg',
        range: 'ca. 70 – 90',
        hint: 'sehr alterabhängig; invasiv/nicht-invasiv',
      },
      {
        id: 'diastolic_bp',
        title: 'RR diastolisch',
        unit: 'mmHg',
        range: 'ca. 50 – 65',
      },
      {
        id: 'spo2_room_air',
        title: 'SpO₂ (Raumluft)',
        unit: '%',
        range: '≥ 94',
        hint: 'Apnoe-Episoden beachten',
      },
      {
        id: 'temp_c',
        title: 'Körpertemperatur',
        unit: '°C',
        range: 'ca. 36,5 – 37,5',
      },
    ],
  },
];
