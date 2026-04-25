import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AccordionPanel,
  ButtonSecondary,
  DetailBodyText,
  DetailContentHero,
  EmptyState,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { SPACING } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type MedicationDetailSection = {
  title: string;
  content: string;
  defaultExpanded?: boolean;
  muted?: boolean;
};

export type MedicationDetailScreenUIProps = {
  title: string;
  description: string;
  categoryLabel?: string | null;
  sections: MedicationDetailSection[];
  isLoading: boolean;
  error?: {
    message: string;
    hint: string;
  } | null;
  onRetry?: () => void;
};

export default function MedicationDetailScreenUI({
  title,
  description,
  categoryLabel = null,
  sections,
  isLoading,
  error = null,
  onRetry,
}: MedicationDetailScreenUIProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Medikament wird geladen...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <EmptyState
            when={true}
            message={error.message}
            hint={error.hint}
            action={
              onRetry ? (
                <ButtonSecondary
                  label="Erneut versuchen"
                  onPress={onRetry}
                />
              ) : undefined
            }
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DetailContentHero
          title={title}
          categoryLabel={categoryLabel}
          indication={description}
        />

        {sections.map((section) => (
          <AccordionPanel
            key={section.title}
            title={section.title}
            defaultExpanded={section.defaultExpanded}
          >
            <DetailBodyText
              variant="relaxed"
              style={section.muted ? styles.mutedText : undefined}
            >
              {section.content}
            </DetailBodyText>
          </AccordionPanel>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      paddingBottom: SPACING.screenPaddingBottom + SPACING.gapSm,
      gap: SPACING.detailBlockGap,
    },
    stateWrap: {
      flex: 1,
      justifyContent: 'center',
      minHeight: 300,
      paddingHorizontal: SPACING.screenPadding,
    },
    loadingText: {
      marginTop: SPACING.gapMd,
      textAlign: 'center',
      color: colors.textMuted,
    },
    mutedText: {
      color: colors.textMuted,
    },
  });
}
