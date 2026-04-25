import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { VITAL_REFERENCE_SECTIONS } from './vitalReferenceData';
import type { AgeGroupId } from './vitalReferenceTypes';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import VitalReferenceScreenUI, {
  type VitalReferenceScreenUIItem,
  type VitalReferenceScreenUISection,
} from '@/ui/screens/VitalReferenceScreenUI';

type Props = NativeStackScreenProps<HomeStackParamList, 'VitalReference'>;

export function VitalReferenceScreen({ navigation }: Props) {
  const [ageId, setAgeId] = useState<AgeGroupId>('adult');

  const section = useMemo(
    () => VITAL_REFERENCE_SECTIONS.find((item) => item.id === ageId)!,
    [ageId],
  );

  const sections = useMemo<VitalReferenceScreenUISection[]>(
    () =>
      VITAL_REFERENCE_SECTIONS.map((item) => ({
        id: item.id,
        label: item.label,
        scope: item.scope,
      })),
    [],
  );

  const referenceItems = useMemo<VitalReferenceScreenUIItem[]>(
    () =>
      section.cards.map((card) => ({
        id: card.id,
        title: card.title,
        unit: card.unit,
        range: card.range,
        hint: card.hint,
      })),
    [section.cards],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Vitalwerte' });
  }, [navigation]);

  const handleSelectSection = useCallback((nextId: string) => {
    setAgeId(nextId as AgeGroupId);
  }, []);

  return (
    <VitalReferenceScreenUI
      title="Altersgruppe"
      sections={sections}
      selectedSectionId={ageId}
      onSelectSection={handleSelectSection}
      selectedScope={section.scope}
      referenceItems={referenceItems}
      warningTitle="Nur Orientierung"
      warningBody="Kein Ersatz fuer klinische Beurteilung oder lokale Zielwerte. Offline-Referenz - Leitfaden und Gesamtbild im Blick."
    />
  );
}
