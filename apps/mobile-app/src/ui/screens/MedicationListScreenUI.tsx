import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { ButtonSecondary, EmptyState } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { SPACING } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';
import { Header } from '@/ui/components/Header';
import { ListItem } from '@/ui/components/ListItem';
import { SearchBar } from '@/ui/components/SearchBar';

export type MedicationListScreenUIItem = {
  id: string;
  title: string;
  subtitle?: string;
};

export type MedicationListScreenUIProps = {
  items: MedicationListScreenUIItem[];
  onItemPress: (id: string) => void;
  searchValue: string;
  onSearchChange: (text: string) => void;
  isLoading: boolean;
  error?: {
    message: string;
    hint: string;
  } | null;
  onRetry?: () => void;
};

const FLAT_LIST_INITIAL_NUM_TO_RENDER = 12;
const FLAT_LIST_MAX_TO_RENDER_PER_BATCH = 8;
const FLAT_LIST_WINDOW_SIZE = 6;

type MedicationRowProps = {
  item: MedicationListScreenUIItem;
  onItemPress: (id: string) => void;
};

const MedicationRow = React.memo(function MedicationRow({
  item,
  onItemPress,
}: MedicationRowProps) {
  const handlePress = React.useCallback(() => {
    onItemPress(item.id);
  }, [item.id, onItemPress]);

  return (
    <ListItem
      title={item.title}
      subtitle={item.subtitle}
      onPress={handlePress}
    />
  );
});

export default function MedicationListScreenUI({
  items,
  onItemPress,
  searchValue,
  onSearchChange,
  isLoading,
  error = null,
  onRetry,
}: MedicationListScreenUIProps) {
  const { colors } = useTheme();
  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<MedicationListScreenUIItem>) => (
      <MedicationRow item={item} onItemPress={onItemPress} />
    ),
    [onItemPress],
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.stateText, { color: colors.textMuted }]}>
            Medikamente werden geladen...
          </Text>
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
      <View style={styles.root}>
        <Header
          title="Medikamente"
          subtitle="Eintrag antippen fuer Details."
        />

        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Medikament suchen"
        />

        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={FLAT_LIST_INITIAL_NUM_TO_RENDER}
          maxToRenderPerBatch={FLAT_LIST_MAX_TO_RENDER_PER_BATCH}
          windowSize={FLAT_LIST_WINDOW_SIZE}
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}

function keyExtractor(item: MedicationListScreenUIItem): string {
  return item.id;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  stateWrap: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    paddingHorizontal: SPACING.screenPadding,
  },
  stateText: {
    marginTop: SPACING.gapMd,
    textAlign: 'center',
  },
});
