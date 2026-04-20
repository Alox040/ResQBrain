import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { ButtonSecondary, EmptyState } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import {
  loadMedicationList,
  type LookupListRowItem,
} from '@/features/lookup/listData';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import MedicationListScreenUI, {
  type MedicationListScreenRowViewModel,
} from '@/ui/screens/MedicationListScreenUI';
import { useTheme } from '@/theme/ThemeContext';
import { TAG_CONFIG } from '@/utils/tagConfig';
import {
  filterByListCategory,
  type ListCategoryFilter,
} from '@/utils/listCategoryFilter';

type Nav = NativeStackNavigationProp<
  MedicationStackParamList,
  'MedicationListScreen'
>;

type LoadingStyles = {
  stateWrap: {
    flex: number;
    justifyContent: 'center';
  };
  loadingText: {
    marginTop: number;
    textAlign: 'center';
  };
};

const loadingStyles: LoadingStyles = {
  stateWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
};

function buildEmptyMessage(hasAnyItems: boolean): string {
  return hasAnyItems
    ? 'Fuer diese Kategorie sind keine Medikamente im Bundle vorhanden.'
    : 'Keine Medikamente im Bundle vorhanden.';
}

function mapMedicationRowToViewModel(
  item: LookupListRowItem,
  onPress: () => void,
): MedicationListScreenRowViewModel {
  const primaryTag = item.tags[0];
  const tagCfg = primaryTag ? TAG_CONFIG[primaryTag] : undefined;

  return {
    id: item.id,
    title: item.label,
    subtitle: item.listSubtitle,
    tag: tagCfg?.label,
    onPress,
  };
}

export function MedicationListAdapter() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const [categoryFilter, setCategoryFilter] =
    useState<ListCategoryFilter>('all');
  const [medicationRows, setMedicationRows] = useState<LookupListRowItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await loadMedicationList();
      setMedicationRows(items);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Medikamente konnten nicht geladen werden.';
      setErrorMessage(message);
      setMedicationRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredMedicationRows = useMemo(
    () => filterByListCategory(medicationRows, categoryFilter),
    [medicationRows, categoryFilter],
  );

  const medicationItems = useMemo(
    () =>
      filteredMedicationRows.map((item) =>
        mapMedicationRowToViewModel(item, () => {
          navigation.navigate('MedicationDetail', { medicationId: item.id });
        }),
      ),
    [filteredMedicationRows, navigation],
  );

  const emptyMessage = buildEmptyMessage(medicationRows.length > 0);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={loadingStyles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[loadingStyles.loadingText, { color: colors.textMuted }]}>
            Medikamente werden geladen...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (errorMessage) {
    return (
      <ScreenContainer>
        <View style={loadingStyles.stateWrap}>
          <EmptyState
            when={true}
            message={errorMessage}
            hint="Offline-Bundle pruefen oder App neu starten."
            action={
              <ButtonSecondary
                label="Erneut versuchen"
                onPress={() => {
                  void loadData();
                }}
              />
            }
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <MedicationListScreenUI
      items={medicationItems}
      categoryFilter={categoryFilter}
      onCategoryFilterChange={setCategoryFilter}
      emptyMessage={emptyMessage}
    />
  );
}

export default MedicationListAdapter;
