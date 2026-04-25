import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ButtonPrimary, ButtonSecondary, EmptyState } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { FeedbackSheet } from '@/features/feedback';
import { getBundleDebugInfo, type BundleDebugInfo } from '@/lookup/bundleDebugInfo';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    root: {
      flex: 1,
      gap: SPACING.gapMd,
      paddingBottom: SPACING.screenPaddingBottom,
    },
    card: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SPACING.radius,
      padding: SPACING.gapMd,
      backgroundColor: colors.surface,
      gap: SPACING.gapSm,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: colors.text,
    },
    row: {
      gap: 4,
    },
    label: {
      ...TYPOGRAPHY.sectionTitle,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    value: {
      ...TYPOGRAPHY.body,
      color: colors.text,
    },
    stateWrap: {
      flex: 1,
      justifyContent: 'center',
      minHeight: 240,
    },
  });
}

function formatSource(source: BundleDebugInfo['source'] | null): string {
  if (!source) return '-';
  if (source === 'updated') return 'updated';
  if (source === 'cached') return 'cached';
  return 'embedded';
}

function formatTimestamp(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function SettingsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [debugInfo, setDebugInfo] = useState<BundleDebugInfo | null>(null);
  const [hasDebugInfoError, setHasDebugInfoError] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const info = await getBundleDebugInfo();
      setDebugInfo(info);
      setHasDebugInfoError(false);
    } catch {
      setDebugInfo(null);
      setHasDebugInfoError(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <ScreenContainer>
      <View style={styles.root}>
        {hasDebugInfoError ? (
          <View style={styles.card}>
            <View style={styles.stateWrap}>
              <EmptyState
                when={true}
                message="Daten konnten nicht geladen werden"
                action={
                  <ButtonSecondary
                    label="Erneut versuchen"
                    onPress={() => {
                      void refresh();
                    }}
                  />
                }
              />
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>Bundle Debug Info</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Bundle version</Text>
              <Text style={styles.value}>{debugInfo?.version ?? '-'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Bundle source</Text>
              <Text style={styles.value}>{formatSource(debugInfo?.source ?? null)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Last update</Text>
              <Text style={styles.value}>{formatTimestamp(debugInfo?.lastUpdate ?? null)}</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.title}>Feedback</Text>
          <Text style={styles.value}>
            Teile Bugs, Ideen oder Verbesserungen direkt ueber den nativen
            Share-Dialog.
          </Text>
          <ButtonPrimary
            label="Feedback senden"
            onPress={() => {
              setFeedbackVisible(true);
            }}
          />
        </View>
      </View>

      <FeedbackSheet
        visible={feedbackVisible}
        bundleId={debugInfo?.version ?? null}
        onClose={() => {
          setFeedbackVisible(false);
        }}
      />
    </ScreenContainer>
  );
}
