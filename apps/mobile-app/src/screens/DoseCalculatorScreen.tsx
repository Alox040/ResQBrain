import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  EmptyState,
  FlatListSeparator,
  LookupListRow,
  SectionHeader,
  WarningCard,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { mapMedicationToViewModel } from '@/data/adapters/mapMedicationToViewModel';
import { medications } from '@/data/contentIndex';
import {
  computeWeightBasedDose,
  formatDoseNumber,
  parseDosageCalculatorSpec,
} from '@/features/doseCalculator/parseDosageForCalculator';
import type { Medication } from '@/types/content';
import { CARD, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

function firstMedicationWithSpec(): Medication | undefined {
  for (const m of medications) {
    if (parseDosageCalculatorSpec(m.dosage)) return m;
  }
  return medications[0];
}

export function DoseCalculatorScreen() {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createDoseStyles(colors, isDark),
    [colors, isDark],
  );
  const initial = useMemo(() => firstMedicationWithSpec(), []);
  const [selected, setSelected] = useState<Medication | undefined>(initial);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [weightText, setWeightText] = useState('');

  const weightKg = useMemo(() => {
    const t = weightText.trim().replace(',', '.');
    if (t === '') return NaN;
    const n = Number.parseFloat(t);
    return Number.isFinite(n) ? n : NaN;
  }, [weightText]);

  const selectedVm = useMemo(
    () => (selected ? mapMedicationToViewModel(selected) : undefined),
    [selected],
  );

  const spec = useMemo(
    () => (selected ? parseDosageCalculatorSpec(selected.dosage) : null),
    [selected],
  );

  const result = useMemo(() => {
    if (!spec || !Number.isFinite(weightKg) || weightKg <= 0) return null;
    return computeWeightBasedDose(weightKg, spec);
  }, [spec, weightKg]);

  const weightInvalid =
    weightText.trim() !== '' &&
    (!Number.isFinite(weightKg) || weightKg <= 0);

  if (medications.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          when={true}
          message="Keine Medikamente im Bundle."
          hint="Ohne Medikamentenstammdaten ist der Rechner nicht nutzbar."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.layoutRoot}>
        <View style={styles.stickyInputs}>
          <WarningCard
            title="Nur Orientierung"
            body="Dosis aus Dosistext — verbindlich ist das Medikamentenhandbuch. Einheiten und Kontraindikationen vor Gabe prüfen."
            tone="dosage"
            icon="warning-outline"
            accessibilityRole="text"
          />

          <View style={styles.block}>
            <Text style={styles.fieldLabel}>Medikament</Text>
            <Pressable
              onPress={() => setPickerOpen(true)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.medSelector,
                pressed && styles.medSelectorPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Medikament wählen. Aktuell ${selectedVm?.label ?? 'keins'}.`}
            >
              <View style={styles.medSelectorTextCol}>
                <Text style={styles.medSelectorTitle} numberOfLines={2}>
                  {selectedVm?.label ?? 'Medikament wählen'}
                </Text>
                {selected ? (
                  <Text style={styles.medSelectorHint} numberOfLines={2}>
                    {spec
                      ? 'mg/kg-Angabe im Dosistext gefunden'
                      : 'Keine mg/kg-Zeile im Dosistext — Rechner nicht möglich'}
                  </Text>
                ) : null}
              </View>
              <Ionicons name="chevron-down" size={26} color={colors.primary} />
            </Pressable>
          </View>

          <View style={styles.block}>
            <Text style={styles.fieldLabel}>Körpergewicht (kg)</Text>
            <TextInput
              value={weightText}
              onChangeText={setWeightText}
              placeholder="z. B. 70"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              selectionColor={colors.primary}
              style={[
                styles.weightInput,
                weightInvalid && styles.weightInputError,
              ]}
              accessibilityLabel="Körpergewicht in Kilogramm"
            />
            {weightInvalid ? (
              <Text style={styles.errorLine}>
                Bitte gültiges Gewicht &gt; 0 eingeben.
              </Text>
            ) : null}
          </View>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.contentBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.resultWrap}>
          {spec && Number.isFinite(weightKg) && weightKg > 0 && result ? (
            <>
              <Text style={styles.resultLabel}>Empfohlene Einzeldosis (Orientierung)</Text>
              <Text style={styles.resultValue} accessibilityRole="header">
                {formatDoseNumber(result.value, result.unit)}
              </Text>
              {result.wasClampedToMin || result.wasClampedToMax ? (
                <Text style={styles.clampHint}>
                  {result.wasClampedToMin && result.wasClampedToMax
                    ? 'Auf Mindest- und Höchstdosis begrenzt.'
                    : result.wasClampedToMin
                      ? 'Auf Mindestdosis begrenzt.'
                      : 'Auf Höchstdosis begrenzt.'}
                  {' '}
                  (Rohwert vor Begrenzung:{' '}
                  {formatDoseNumber(result.rawUncapped, result.unit)})
                </Text>
              ) : null}
            </>
          ) : selected && !spec ? (
            <View style={styles.noSpecCard}>
              <Text style={styles.noSpecTitle}>Keine mg/kg-Angabe erkannt</Text>
              <Text style={styles.noSpecBody}>
                Im Dosistext dieses Eintrags wurde keine Zeile wie „0,1 mg/kg“
                oder „1 µg/kg“ gefunden. Dosis bitte nach Handbuch festlegen.
              </Text>
            </View>
          ) : (
            <Text style={styles.resultPlaceholder}>
              Gewicht eingeben — Ergebnis erscheint automatisch.
            </Text>
          )}
        </View>

        {selected?.dosage ? (
          <View style={styles.dosageExcerpt}>
            <SectionHeader
              title="Dosistext (Auszug)"
              size="comfortable"
              description="Volltext in der Medikamenten-Detailansicht."
            />
            <Text style={styles.dosageExcerptText} selectable>
              {selected.dosage.length > 420
                ? `${selected.dosage.slice(0, 420)}…`
                : selected.dosage}
            </Text>
          </View>
        ) : null}
        </ScrollView>
      </View>

      <Modal
        visible={pickerOpen}
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <ScreenContainer>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medikament wählen</Text>
              <Pressable
                onPress={() => setPickerOpen(false)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Schließen"
              >
                <Text style={styles.modalClose}>Fertig</Text>
              </Pressable>
            </View>
            <FlatList
              style={styles.modalList}
              data={medications}
              keyExtractor={(m) => m.id}
              ItemSeparatorComponent={FlatListSeparator}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const vm = mapMedicationToViewModel(item);
                return (
                  <LookupListRow
                    title={vm.label}
                    subtitle={
                      parseDosageCalculatorSpec(item.dosage)
                        ? 'Rechner: mg/kg im Text'
                        : vm.listSubtitle
                    }
                    onPress={() => {
                      setSelected(item);
                      setPickerOpen(false);
                    }}
                    accessibilityLabel={vm.label}
                  />
                );
              }}
            />
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}

function createDoseStyles(colors: AppPalette, isDark: boolean) {
  return StyleSheet.create({
    layoutRoot: {
      flex: 1,
    },
    stickyInputs: {
      gap: SPACING.gapMd,
      paddingBottom: SPACING.gapMd,
      marginBottom: SPACING.gapSm,
      borderBottomWidth: StyleSheet.hairlineWidth * 2,
      borderBottomColor: colors.border,
      backgroundColor: colors.bg,
    },
    scrollBody: {
      flex: 1,
    },
    contentBody: {
      paddingBottom: SPACING.screenPaddingBottom,
      gap: SPACING.detailBlockGap,
    },
    block: {
      gap: SPACING.gapSm,
    },
    fieldLabel: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      letterSpacing: 0.2,
    },
    medSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: LAYOUT.minTap + 20,
      paddingVertical: 16,
      paddingHorizontal: SPACING.screenPadding,
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: SPACING.gapMd,
    },
    medSelectorPressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    medSelectorTextCol: {
      flex: 1,
      gap: 6,
      minWidth: 0,
    },
    medSelectorTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
    },
    medSelectorHint: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
    },
    weightInput: {
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      fontSize: 28,
      fontWeight: '700',
      paddingVertical: 18,
      paddingHorizontal: SPACING.screenPadding,
      color: colors.text,
      minHeight: LAYOUT.minTap + 12,
    },
    weightInputError: {
      borderColor: '#f87171',
      backgroundColor: isDark ? '#450a0a' : '#fef2f2',
    },
    errorLine: {
      ...TYPOGRAPHY.body,
      color: '#f87171',
      fontWeight: '700',
    },
    resultWrap: {
      ...CARD.shell,
      backgroundColor: colors.dosagePanelBg,
      minHeight: 148,
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.dosagePanelBorder,
    },
    resultLabel: {
      ...TYPOGRAPHY.sectionTitle,
      color: colors.primary,
      marginBottom: SPACING.gapSm,
    },
    resultValue: {
      fontSize: 36,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    clampHint: {
      marginTop: SPACING.gapMd,
      ...TYPOGRAPHY.body,
      color: colors.warningTitle,
      fontWeight: '700',
    },
    resultPlaceholder: {
      ...TYPOGRAPHY.body,
      color: colors.textMuted,
      fontWeight: '600',
    },
    noSpecCard: {
      gap: SPACING.gapSm,
    },
    noSpecTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
    },
    noSpecBody: {
      ...TYPOGRAPHY.body,
      color: colors.textMuted,
    },
    dosageExcerpt: {
      gap: SPACING.gapSm,
    },
    dosageExcerptText: {
      ...TYPOGRAPHY.body,
      color: colors.text,
    },
    modalBody: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.gapMd,
    },
    modalTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
    },
    modalClose: {
      ...TYPOGRAPHY.body,
      fontWeight: '800',
      color: colors.primary,
    },
    modalList: {
      flex: 1,
    },
  });
}
