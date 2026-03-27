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
    id: 'atropin',
    name: 'Atropin',
    indication: 'Symptomatische Bradykardie mit klinisch relevantem Perfusionsdefizit.',
    dosage: '0,5 mg i.v.; Wiederholung nach lokalem Standard bis zur maximalen Gesamtdosis.',
    notes:
      'Auf Herzfrequenz, Blutdruck und moegliche paradoxe Effekte bei zu niedriger Dosierung achten.',
  },
  {
    id: 'acetylsalicylsaeure',
    name: 'Acetylsalicylsaeure',
    indication: 'Akutes Koronarsyndrom ohne bekannte relevante Kontraindikation.',
    dosage: '150 bis 300 mg per os oder i.v. gemaess lokalem Standard.',
    notes:
      'Blutungsrisiko, Allergien und bereits erfolgte Eigenmedikation aktiv erfragen.',
  },
  {
    id: 'heparin',
    name: 'Heparin',
    indication:
      'Akutes Koronarsyndrom oder thromboembolische Verdachtslage nach Freigabe im Standardablauf.',
    dosage: 'Bolusgabe i.v. gemaess lokalem Standard und behandelndem Konzept.',
    notes:
      'Vor Gabe auf Blutungszeichen, Antikoagulation in der Anamnese und klare Indikationslage achten.',
  },
  {
    id: 'salbutamol',
    name: 'Salbutamol',
    indication: 'Bronchospasmus bei Asthma, COPD-Exazerbation oder obstruktiver Atemwegsproblematik.',
    dosage: '2,5 bis 5 mg vernebelt; Wiederholung nach klinischem Verlauf moeglich.',
    notes:
      'Herzfrequenz, Tremor und klinische Wirkung auf die Atemarbeit engmaschig beobachten.',
  },
  {
    id: 'ipratropium',
    name: 'Ipratropiumbromid',
    indication: 'Obstruktive Atemwegsproblematik als additive inhalative Therapie.',
    dosage: '0,5 mg vernebelt in Kombination mit Standardinhalation.',
    notes:
      'Besonders als Zusatz zu beta-agonistischer Therapie im standardisierten Ablauf vorgesehen.',
  },
  {
    id: 'prednisolon',
    name: 'Prednisolon',
    indication: 'Asthma, COPD-Exazerbation, Anaphylaxie oder andere entzundliche Akutsituationen.',
    dosage: '100 bis 250 mg i.v. gemaess Indikation und lokalem Standard.',
    notes:
      'Wirkeintritt nicht unmittelbar erwarten; Gabe dient der Ergaenzung des Gesamtmanagements.',
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
  {
    id: 'naloxon',
    name: 'Naloxon',
    indication: 'Verdacht auf opioidbedingte Atemdepression oder Intoxikation.',
    dosage:
      '0,1 bis 0,4 mg i.v. titriert; alternativ intranasal gemaess verfuegbarer Applikationsform.',
    notes:
      'Ziel ist ausreichende Spontanatmung, nicht zwingend vollstaendige Vigilanznormalisierung.',
  },
  {
    id: 'glukose',
    name: 'Glukose 40%',
    indication: 'Symptomatische Hypoglykaemie mit gesicherter oder hochwahrscheinlicher Unterzuckerung.',
    dosage: '10 bis 20 g i.v. langsam unter klinischer Kontrolle.',
    notes:
      'Venenzugang sichern, Paravasat vermeiden und Verlauf der Vigilanz nach Gabe dokumentieren.',
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
  {
    id: 'alg-4',
    title: 'Bradykardie',
    indication:
      'Symptomatische Bradykardie mit Hypotonie, Schocksymptomatik, Ischaemiezeichen oder eingeschraenkter Vigilanz.',
    steps: [
      {
        id: 'step-1',
        text: 'Bradykardie erkennen, Monitoring etablieren und klinische Relevanz anhand des Perfusionszustands einschaetzen.',
      },
      {
        id: 'step-2',
        text: 'Oxygenierung sichern, i.v.-Zugang vorbereiten und reversible Ursachen im Team benennen.',
      },
      {
        id: 'step-3',
        text: 'Atropin als vorgesehene Standardtherapie bereitlegen und Wirkung nach lokalem Ablauf kontrollieren.',
      },
      {
        id: 'step-4',
        text: 'Bei ausbleibender Stabilisierung externe Schrittmacher- oder Eskalationsstrategie vorbereiten.',
      },
    ],
    notes:
      'Der Ablauf bildet nur eine lineare Schrittfolge fuer Phase 0 ab.',
    warnings:
      'Instabile Patientenlage erfordert unmittelbare klinische Eskalation unabhaengig von der Anzeige.',
  },
  {
    id: 'alg-5',
    title: 'Tachykardie',
    indication:
      'Symptomatische Tachykardie mit Kreislaufbeeintraechtigung oder klinischem Verdacht auf relevante Rhythmusstoerung.',
    steps: [
      {
        id: 'step-1',
        text: 'Tachykardie identifizieren, 12-Kanal-EKG soweit moeglich anstreben und Vitalparameter sichern.',
      },
      {
        id: 'step-2',
        text: 'Instabilitaetszeichen aktiv pruefen und das Team auf moegliche elektrische Therapie vorbereiten.',
      },
      {
        id: 'step-3',
        text: 'Bei stabilem Verlauf den vorgesehenen Standardpfad fuer Monitoring, Zugang und Transport fortsetzen.',
      },
      {
        id: 'step-4',
        text: 'Nach jeder Intervention Rhythmus, Blutdruck und Beschwerdebild erneut bewerten.',
      },
    ],
    warnings:
      'Keine Feindifferenzierung oder Berechnung im Seed; klinische Interpretation bleibt ausserhalb der App.',
  },
  {
    id: 'alg-6',
    title: 'ACS',
    indication:
      'Brustschmerz oder Ischaemieverdacht im Sinne eines akuten Koronarsyndroms.',
    steps: [
      {
        id: 'step-1',
        text: 'ACS vermuten, Monitoring aufbauen und zielgerichtete Schmerzanamnese sowie Risikofaktoren erfassen.',
      },
      {
        id: 'step-2',
        text: '12-Kanal-EKG zeitnah ableiten und auffaellige Befunde im Team kommunizieren.',
      },
      {
        id: 'step-3',
        text: 'Standardmedikation wie Acetylsalicylsaeure gemaess vorbereitetem Ablauf bereithalten.',
      },
      {
        id: 'step-4',
        text: 'Transportziel und Voranmeldung anhand des klinischen Gesamteindrucks absichern.',
      },
    ],
    notes:
      'Nur statischer Ueberblick ueber den Basisablauf ohne Entscheidungsbaum.',
  },
  {
    id: 'alg-7',
    title: 'Asthma',
    indication:
      'Akute bronchiale Obstruktion mit Dyspnoe, Giemen oder erhoehter Atemarbeit.',
    steps: [
      {
        id: 'step-1',
        text: 'Atemnot erfassen, Lagerung optimieren und Monitoring inklusive Sauerstoffsituation herstellen.',
      },
      {
        id: 'step-2',
        text: 'Inhalative Standardtherapie mit Salbutamol vorbereiten und Applikation begleiten.',
      },
      {
        id: 'step-3',
        text: 'Ergaenzende Therapiebausteine wie Ipratropium oder Steroid gemaess Standardablauf hinzunehmen.',
      },
      {
        id: 'step-4',
        text: 'Verlauf von Atemarbeit, Sprechfaehigkeit und Oxygenierung engmaschig reevaluieren.',
      },
    ],
    warnings:
      'Verschlechterung bis zur Erschoepfung muss klinisch sofort eskaliert werden.',
  },
  {
    id: 'alg-8',
    title: 'COPD-Exazerbation',
    indication:
      'Akute Verschlechterung einer bekannten oder wahrscheinlichen COPD mit respiratorischer Belastung.',
    steps: [
      {
        id: 'step-1',
        text: 'Respiratorische Situation beurteilen, Monitoring etablieren und atemerleichternde Lagerung unterstuetzen.',
      },
      {
        id: 'step-2',
        text: 'Inhalative Standardtherapie vorbereiten und Wirkung auf Atemarbeit und Auskultation verfolgen.',
      },
      {
        id: 'step-3',
        text: 'Steroidgabe und weitere lokale Standardmassnahmen in den Ablauf integrieren.',
      },
      {
        id: 'step-4',
        text: 'Transportfaehigkeit, Eskalationsbedarf und Zielklinik fruehzeitig abstimmen.',
      },
    ],
  },
  {
    id: 'alg-9',
    title: 'Hypoglykaemie',
    indication:
      'Bewusstseinsstoerung, neurologische Auffaelligkeit oder vegetative Symptomatik bei Verdacht auf Unterzuckerung.',
    steps: [
      {
        id: 'step-1',
        text: 'Blutzucker bestimmen, Basisbeurteilung durchfuehren und Monitoring beginnen.',
      },
      {
        id: 'step-2',
        text: 'Bei bestaetigter oder hochwahrscheinlicher Hypoglykaemie Glukosegabe vorbereiten.',
      },
      {
        id: 'step-3',
        text: 'Nach Gabe Vigilanz, Schutzreflexe und klinische Besserung erneut beurteilen.',
      },
      {
        id: 'step-4',
        text: 'Ursachenhinweise, Nahrungsaufnahme und weiteren Versorgungsbedarf dokumentieren.',
      },
    ],
    warnings:
      'Persistierende Bewusstseinsstoerung trotz Korrektur erfordert weitere Ursachenabklaerung ausserhalb des Seeds.',
  },
  {
    id: 'alg-10',
    title: 'Opioidintoxikation',
    indication:
      'Verdacht auf Opioidintoxikation mit reduzierter Atemfrequenz, Miosis oder Vigilanzminderung.',
    steps: [
      {
        id: 'step-1',
        text: 'Atemweg und Atmung priorisieren, Monitoring aufbauen und Intoxikationshinweise erfassen.',
      },
      {
        id: 'step-2',
        text: 'Beatmungsunterstuetzung vorbereiten und Naloxon gemaess Standardablauf bereitlegen.',
      },
      {
        id: 'step-3',
        text: 'Klinische Wirkung auf Spontanatmung und Vigilanz nach jeder Gabe reevaluieren.',
      },
      {
        id: 'step-4',
        text: 'Wiederkehrende Atemdepression, Co-Intoxikation und Transportueberwachung mitdenken.',
      },
    ],
    notes:
      'Der Ablauf bleibt bewusst statisch und enthaelt keine titrierende Logik.',
    warnings:
      'Kurze Wirkdauer einzelner Antagonisierungsschritte beachten und Rueckfall in Atemdepression klinisch ueberwachen.',
  },
];

export const medicationLookup: Record<string, LookupMedication> = Object.fromEntries(
  medications.map((medication) => [medication.id, medication]),
);

export const algorithmLookup: Record<string, LookupAlgorithm> = Object.fromEntries(
  algorithms.map((algorithm) => [algorithm.id, algorithm]),
);
