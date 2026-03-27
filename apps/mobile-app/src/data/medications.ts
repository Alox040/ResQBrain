import type { Medication } from '@/types/content';

export const medications: Medication[] = [
  // ─── Reanimation / Kreislauf ───────────────────────────────────────────────
  {
    id: 'adrenalin',
    kind: 'medication',
    label: 'Adrenalin',
    indication: 'Kreislaufstillstand, schwere Anaphylaxie, symptomatische Bradykardie.',
    tags: ['kreislauf', 'atemwege'],
    searchTerms: ['Epinephrin', 'EPI', 'Suprarenin'],
    dosage:
      'Kreislaufstillstand: 1 mg i.v./i.o. alle 3–5 min.\n' +
      'Anaphylaxie: 0,5 mg i.m. (Oberschenkel lateral).\n' +
      'Bradykardie: 0,05–0,1 mg i.v. titriert.',
    administration: 'i.v., i.o., i.m., intranasal',
    notes: 'Wirkung engmaschig überwachen. Bei Anaphylaxie Gabe nicht verzögern.',
    relatedAlgorithmIds: ['reanimation', 'anaphylaxie', 'bradykardie'],
  },
  {
    id: 'amiodaron',
    kind: 'medication',
    label: 'Amiodaron',
    indication: 'Therapierefraktäre VF/VT im ALS-Kontext.',
    tags: ['kreislauf'],
    searchTerms: ['Cordarex', 'Antiarrhythmikum', 'VF', 'VT'],
    dosage:
      'Nach 3. Defibrillation: 300 mg i.v./i.o. als Bolus.\n' +
      'Bei Bedarf 2. Dosis: 150 mg i.v./i.o.',
    administration: 'i.v., i.o.',
    contraindications: 'AV-Block II–III ohne Schrittmacherschutz, Sinusknotensyndrom.',
    notes: 'Auf Blutdruck und Wechselwirkungen mit anderen Antiarrhythmika achten.',
    relatedAlgorithmIds: ['reanimation', 'tachykardie'],
  },
  {
    id: 'atropin',
    kind: 'medication',
    label: 'Atropin',
    indication: 'Symptomatische Bradykardie mit Perfusionsdefizit.',
    tags: ['kreislauf'],
    searchTerms: ['Parasympatholytikum', 'Vagolytikum'],
    dosage:
      '0,5 mg i.v.; Wiederholung alle 3–5 min.\n' +
      'Maximaldosis: 3 mg gesamt.',
    administration: 'i.v., i.o.',
    contraindications: 'Tachyarrhythmie, Engwinkelglaukom (relativ).',
    notes: 'Paradoxe Bradykardie bei Unterdosierung (< 0,5 mg) möglich.',
    relatedAlgorithmIds: ['bradykardie'],
  },
  {
    id: 'acetylsalicylsaeure',
    kind: 'medication',
    label: 'Acetylsalicylsäure',
    indication: 'Akutes Koronarsyndrom (ACS) ohne relevante Kontraindikation.',
    tags: ['kreislauf'],
    searchTerms: ['ASS', 'Aspirin', 'ASA'],
    dosage: '150–300 mg p.o. (zerkaut) oder i.v. gemäß lokalem Standard.',
    administration: 'p.o. (zerkaut bevorzugt), i.v.',
    contraindications: 'Bekannte ASS-Allergie, aktive gastrointestinale Blutung, Kinder < 16 Jahre.',
    notes: 'Eigenmedikation und bestehende Antikoagulation aktiv erfragen.',
    relatedAlgorithmIds: ['acs'],
  },
  {
    id: 'heparin',
    kind: 'medication',
    label: 'Heparin',
    indication: 'ACS oder thromboembolische Verdachtslage nach Standardfreigabe.',
    tags: ['kreislauf'],
    searchTerms: ['UFH', 'Antikoagulation', 'unfraktioniertes Heparin'],
    dosage: 'Bolus i.v. gemäß lokalem Standard und Konzept.',
    administration: 'i.v.',
    contraindications: 'Aktive Blutung, bekannte HIT (heparininduzierte Thrombozytopenie).',
    notes: 'Vor Gabe Blutungszeichen und bestehende Antikoagulation prüfen.',
    relatedAlgorithmIds: ['acs'],
  },

  // ─── Atemwege / Obstruktion ───────────────────────────────────────────────
  {
    id: 'salbutamol',
    kind: 'medication',
    label: 'Salbutamol',
    indication: 'Bronchospasmus bei Asthma, COPD-Exazerbation, Obstruktion.',
    tags: ['atemwege'],
    searchTerms: ['Ventolin', 'Beta-2-Agonist', 'Bronchodilatator', 'Sultanol'],
    dosage: '2,5–5 mg vernebelt; Wiederholung nach klinischem Verlauf.',
    administration: 'inhalativ (Vernebler), MDI',
    notes: 'Herzfrequenz und Tremor beobachten.',
    relatedAlgorithmIds: ['asthma', 'copd-exazerbation'],
  },
  {
    id: 'ipratropium',
    kind: 'medication',
    label: 'Ipratropiumbromid',
    indication: 'Obstruktive Atemwegsproblematik als additive Inhalationstherapie.',
    tags: ['atemwege'],
    searchTerms: ['Atrovent', 'Anticholinergikum', 'Ipratropol'],
    dosage: '0,5 mg vernebelt in Kombination mit Beta-2-Agonist.',
    administration: 'inhalativ (Vernebler)',
    contraindications: 'Engwinkelglaukom (bei Vernebelung mit Gesichtsmaske).',
    relatedAlgorithmIds: ['asthma', 'copd-exazerbation'],
  },
  {
    id: 'prednisolon',
    kind: 'medication',
    label: 'Prednisolon',
    indication: 'Asthma, COPD-Exazerbation, Anaphylaxie, entzündliche Akutsituationen.',
    tags: ['atemwege', 'kreislauf'],
    searchTerms: ['Kortison', 'Steroid', 'Glukokortikoid', 'Solu-Decortin'],
    dosage: '100–250 mg i.v. gemäß Indikation und lokalem Standard.',
    administration: 'i.v.',
    notes: 'Wirkeintritt verzögert (> 30 min). Ergänzt das Gesamtmanagement.',
    relatedAlgorithmIds: ['asthma', 'copd-exazerbation', 'anaphylaxie'],
  },

  // ─── Analgesie / Sedierung ────────────────────────────────────────────────
  {
    id: 'midazolam',
    kind: 'medication',
    label: 'Midazolam',
    indication: 'Akuter Krampfanfall, Sedierung bei Agitation, Unterstützung invasiver Maßnahmen.',
    tags: ['neurologie', 'analgesie'],
    searchTerms: ['Dormicum', 'Benzodiazepin', 'Sedierung', 'BZD'],
    dosage:
      'Krampfanfall: 5–10 mg buccal/nasal oder 2,5–5 mg i.v. langsam titriert.\n' +
      'Sedierung: 1–2,5 mg i.v. titriert.',
    administration: 'buccal, nasal, i.v., i.o., i.m.',
    contraindications: 'Bekannte Überempfindlichkeit auf Benzodiazepine; Atemdepression ohne Beatmungsbereitschaft.',
    notes: 'Atemdepression möglich. Atmung und Vigilanz kontinuierlich monitoren.',
    relatedAlgorithmIds: ['krampfanfall'],
  },
  {
    id: 'fentanyl',
    kind: 'medication',
    label: 'Fentanyl',
    indication: 'Starke akute Schmerzen, Analgosedierung bei Interventionen.',
    tags: ['analgesie'],
    searchTerms: ['Opioid', 'Analgetikum', 'Fentadon'],
    dosage: '25–50 µg i.v. langsam titriert; Wiederholung nach Wirkung.',
    administration: 'i.v., i.o., intranasal',
    contraindications: 'Schwere Atemdepression ohne Beatmungsbereitschaft.',
    notes: 'Atemfrequenz und Vigilanz überwachen. Kombination mit Sedativa beachten.',
    relatedAlgorithmIds: [],
  },
  {
    id: 'ketamin',
    kind: 'medication',
    label: 'Ketamin',
    indication: 'Starke Schmerzen, dissoziative Sedierung, kritische Atemwegssituationen.',
    tags: ['analgesie', 'atemwege'],
    searchTerms: ['Ketanest', 'S-Ketamin', 'Dissoziativum'],
    dosage:
      'Analgesie: 0,1–0,5 mg/kg i.v. titriert.\n' +
      'Sedierung: 1–2 mg/kg i.v.',
    administration: 'i.v., i.o., i.m.',
    notes: 'Kreislaufreaktion und psychotrope Effekte berücksichtigen.',
    relatedAlgorithmIds: [],
  },

  // ─── Intoxikation / Stoffwechsel ──────────────────────────────────────────
  {
    id: 'naloxon',
    kind: 'medication',
    label: 'Naloxon',
    indication: 'Opioidbedingte Atemdepression oder Intoxikation.',
    tags: ['intoxikation', 'analgesie'],
    searchTerms: ['Narcan', 'Opioidantagonist', 'Antidot'],
    dosage:
      '0,1–0,4 mg i.v. titriert.\n' +
      'Alternativ: 0,4–2 mg intranasal.',
    administration: 'i.v., i.o., i.m., intranasal',
    notes: 'Ziel ist ausreichende Spontanatmung, nicht vollständige Vigilanznormalisierung.',
    relatedAlgorithmIds: ['opioidintoxikation'],
  },
  {
    id: 'glukose',
    kind: 'medication',
    label: 'Glukose 40 %',
    indication: 'Symptomatische Hypoglykämie mit gesicherter Unterzuckerung.',
    tags: ['stoffwechsel'],
    searchTerms: ['Dextrose', 'G40', 'Zucker', 'BZ', 'Glucose'],
    dosage: '10–20 g (25–50 ml G40) i.v. langsam unter klinischer Kontrolle.',
    administration: 'i.v.',
    notes: 'Venenzugang sichern, Paravasat vermeiden. Vigilanzverlauf nach Gabe dokumentieren.',
    relatedAlgorithmIds: ['hypoglykaemie'],
  },
];

export const medicationLookup: Record<string, Medication> = Object.fromEntries(
  medications.map((m) => [m.id, m]),
);
