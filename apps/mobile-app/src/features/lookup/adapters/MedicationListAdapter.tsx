import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  loadMedicationList,
  type LookupListRowItem,
} from '@/features/lookup/listData';
import { toLookupUiErrorState } from '@/lookup/lookupErrors';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import MedicationListScreenUI, {
  type MedicationListScreenUIItem,
} from '@/ui/screens/MedicationListScreenUI';

type Nav = NativeStackNavigationProp<
  MedicationStackParamList,
  'MedicationListScreen'
>;

function matchesSearch(item: LookupListRowItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return true;
  }

  const title = item.label.toLowerCase();
  const subtitle = item.listSubtitle.toLowerCase();

  return (
    title.includes(normalizedQuery) ||
    subtitle.includes(normalizedQuery)
  );
}

function mapMedicationItem(item: LookupListRowItem): MedicationListScreenUIItem {
  return {
    id: item.id,
    title: item.label,
    subtitle: item.listSubtitle,
  };
}

export function MedicationListAdapter() {
  const navigation = useNavigation<Nav>();
  const [searchValue, setSearchValue] = useState('');
  const [medicationRows, setMedicationRows] = useState<LookupListRowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<{
    message: string;
    hint: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const items = await loadMedicationList();
      setMedicationRows(items);
    } catch (error) {
      setMedicationRows([]);
      setErrorState(toLookupUiErrorState(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const items = useMemo(
    () =>
      medicationRows
        .filter((item) => matchesSearch(item, searchValue))
        .map(mapMedicationItem),
    [medicationRows, searchValue],
  );

  const handleItemPress = useCallback(
    (id: string) => {
      navigation.navigate('MedicationDetail', { medicationId: id });
    },
    [navigation],
  );

  return (
    <MedicationListScreenUI
      items={items}
      onItemPress={handleItemPress}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      isLoading={isLoading}
      error={errorState}
      onRetry={() => {
        void loadData();
      }}
    />
  );
}

export default MedicationListAdapter;
