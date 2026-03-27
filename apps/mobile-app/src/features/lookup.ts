export type LookupMedication = {
  id: string;
  name: string;
  indication: string;
  dosage: string;
  notes: string;
};

export type LookupAlgorithmStep = {
  id: string;
  text: string;
};

export type LookupAlgorithm = {
  id: string;
  title: string;
  indication: string;
  steps: LookupAlgorithmStep[];
  notes?: string;
  warnings?: string;
};

export const medications: LookupMedication[] = [
  {
    id: 'adrenalin',
    name: 'Adrenalin',
    indication:
      'Kreislaufstillstand, schwere Anaphylaxie und ausgepraegte Bradykardie.',
    dosage:
      '1 mg i.v. oder i.o. nach Reanimationsalgorithmus; bei schwerer Anaphylaxie 0,5 mg i.m.',
    notes:
      'Wirkung engmaschig ueberwachen und Gabe mit dem gewaehlten Algorithmus abgleichen.',
  },
  {
    id: 'amiodaron',
    name: 'Amiodaron',
    indication:
      'Therapierefraktaere ventrikulaere Tachykardien und defibrillierbare Rhythmen im ALS-Kontext.',
    dosage:
      '300 mg i.v. oder i.o. als Bolus; bei Bedarf spaeter 150 mg zusaetzlich.',
    notes:
      'Auf Rhythmus, Blutdruck und moegliche Wechselwirkungen mit anderen Antiarrhythmika achten.',
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    indication:
      'Akuter Krampfanfall, Sedierung bei Unruhe und Unterstuetzung invasiver Massnahmen.',
    dosage:
      '2,5 bis 5 mg i.v. langsam titriert oder 5 bis 10 mg buccal beziehungsweise nasal.',
    notes:
      'Atemdepression mitdenken und durchgehendes Monitoring von Atmung und Vigilanz sicherstellen.',
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    indication:
      'Starke akute Schmerzen und Analgosedierung bei schmerzhaften Interventionen.',
    dosage:
      '25 bis 50 Mikrogramm i.v. langsam titriert; Wiederholung nach klinischer Wirkung.',
    notes:
      'Atemfrequenz, Vigilanz und die Kombination mit weiteren sedierenden Substanzen beachten.',
  },
  {
    id: 'ketamin',
    name: 'Ketamin',
    indication:
      'Starke Schmerzen, dissoziative Sedierung und kritische Atemwegssituationen.',
    dosage:
      '10 bis 25 mg i.v. titriert zur Analgesie oder 1 bis 2 mg/kg i.v. zur Sedierung.',
    notes:
      'Kreislaufreaktion, psychotrope Effekte und die weitere Teamkommunikation bei der Anwendung beachten.',
  },
];

export const algorithms: LookupAlgorithm[] = [
  {
    id: 'alg-1',
    title: 'Reanimation',
    indication:
      'Kreislaufstillstand mit sofortigem Bedarf an strukturiertem ALS-Basisablauf.',
    steps: [
      {
        id: 'step-1',
        text: 'Reanimationsbeginn mit qualitativ hochwertigen Thoraxkompressionen und Monitoring.',
      },
      {
        id: 'step-2',
        text: 'Rhythmuspruefung, Defibrillation bei schockbarem Rhythmus und klare Teamrollen.',
      },
      {
        id: 'step-3',
        text: 'Medikamentengabe und wiederholte Reevaluation im festen Zyklus.',
      },
    ],
    notes:
      'Alle Massnahmen werden entlang eines festen Ablaufs angezeigt, ohne Dosierungs- oder Entscheidungslogik.',
    warnings:
      'Nicht als Echtzeit-Entscheidungshilfe fuer Sonderfaelle verwenden.',
  },
  {
    id: 'alg-2',
    title: 'Anaphylaxie',
    indication:
      'Akute schwere allergische Reaktion mit Atemwegs-, Atmungs- oder Kreislaufbeteiligung.',
    steps: [
      {
        id: 'step-1',
        text: 'Anaphylaxie erkennen, Hilfe nachfordern und Atemweg sowie Oxygenierung sichern.',
      },
      {
        id: 'step-2',
        text: 'Adrenalin und weitere Standardmassnahmen gemaess vorbereitetem Ablauf bereitstellen.',
      },
      {
        id: 'step-3',
        text: 'Verlauf eng ueberwachen und Transport- beziehungsweise Eskalationsbedarf absichern.',
      },
    ],
    notes:
      'Der Screen dient nur zur strukturierten Schrittanzeige mit statischem Inhalt.',
    warnings:
      'Bei rascher Verschlechterung nicht auf den Screen vertrauen, sondern Eskalationspfade sofort umsetzen.',
  },
  {
    id: 'alg-3',
    title: 'Krampfanfall',
    indication:
      'Akuter Krampfanfall oder postiktale instabile Situation mit Schutz- und Sicherungsbedarf.',
    steps: [
      {
        id: 'step-1',
        text: 'Patientenschutz, Basisbeurteilung und kontinuierliches Monitoring etablieren.',
      },
      {
        id: 'step-2',
        text: 'Antikonvulsive Standardtherapie vorbereiten und Atemweg mitdenken.',
      },
      {
        id: 'step-3',
        text: 'Nach dem Ereignis Reevaluation, Ursachenfokus und sicheren Weitertransport organisieren.',
      },
    ],
    warnings:
      'Atemdepression und wiederkehrende Anfaelle muessen parallel klinisch beobachtet werden.',
  },
];

export const medicationLookup: Record<string, LookupMedication> = Object.fromEntries(
  medications.map((medication) => [medication.id, medication]),
);

export const algorithmLookup: Record<string, LookupAlgorithm> = Object.fromEntries(
  algorithms.map((algorithm) => [algorithm.id, algorithm]),
);
