export type Medication = {
  id: string;
  name: string;
  subtitle: string;
  indication: string;
  dosageText: string;
  notes: string;
};

export const medications: Medication[] = [
  {
    id: 'adrenalin',
    name: 'Adrenalin',
    subtitle: 'Reanimation / Anaphylaxie',
    indication: 'Kreislaufstillstand, schwere Anaphylaxie und ausgepraegte Bradykardie.',
    dosageText: '1 mg i.v. oder i.o. nach Reanimationsalgorithmus; bei schwerer Anaphylaxie 0,5 mg i.m.',
    notes: 'Wirkung engmaschig ueberwachen und Gabe mit dem gewaehlten Algorithmus abgleichen.',
  },
  {
    id: 'amiodaron',
    name: 'Amiodaron',
    subtitle: 'Rhythmusstoerung',
    indication: 'Therapierefraktaere ventrikulaere Tachykardien und defibrillierbare Rhythmen im ALS-Kontext.',
    dosageText: '300 mg i.v. oder i.o. als Bolus; bei Bedarf spaeter 150 mg zusaetzlich.',
    notes: 'Auf Rhythmus, Blutdruck und moegliche Wechselwirkungen mit anderen Antiarrhythmika achten.',
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    subtitle: 'Sedierung / Krampfanfall',
    indication: 'Akuter Krampfanfall, Sedierung bei Unruhe und Unterstuetzung invasiver Massnahmen.',
    dosageText: '2,5 bis 5 mg i.v. langsam titriert oder 5 bis 10 mg buccal beziehungsweise nasal.',
    notes: 'Atemdepression mitdenken und durchgehendes Monitoring von Atmung und Vigilanz sicherstellen.',
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    subtitle: 'Analgesie',
    indication: 'Starke akute Schmerzen und Analgosedierung bei schmerzhaften Interventionen.',
    dosageText: '25 bis 50 Mikrogramm i.v. langsam titriert; Wiederholung nach klinischer Wirkung.',
    notes: 'Atemfrequenz, Vigilanz und die Kombination mit weiteren sedierenden Substanzen beachten.',
  },
  {
    id: 'ketamin',
    name: 'Ketamin',
    subtitle: 'Analgesie / Sedierung',
    indication: 'Starke Schmerzen, dissoziative Sedierung und kritische Atemwegssituationen.',
    dosageText: '10 bis 25 mg i.v. titriert zur Analgesie oder 1 bis 2 mg/kg i.v. zur Sedierung.',
    notes: 'Kreislaufreaktion, psychotrope Effekte und die weitere Teamkommunikation bei der Anwendung beachten.',
  },
];
