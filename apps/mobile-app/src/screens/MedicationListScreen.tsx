import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { Pressable } from 'react-native';
import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import {
  ContentBadge,
  FlatListSeparator,
  ListScreenEmptyPlaceholder,
  LookupListRow,
  SectionHeader,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { mapMedicationToViewModel } from '@/data/adapters/mapMedicationToViewModel';
import type { MedicationViewModel } from '@/data/adapters/viewModels';
import { medications } from '@/data/contentIndex';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { SPACING } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

type Nav = NativeStackNavigationProp<MedicationStackParamList, 'MedicationList'>;

const medicationListKeyExtractor = (item: MedicationViewModel): string =>
  item.id;

const FLAT_LIST_INITIAL_NUM_TO_RENDER = 14;
const FLAT_LIST_WINDOW_SIZE = 7;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.screenPaddingBottom,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  listHeader: {
    paddingBottom: SPACING.gapMd,
  },
});

function MedicationListHeader() {
  return (
    <View style={styles.listHeader}>
      <SectionHeader
        title="Medikamentenliste"
        description="Antippen für Dosierung, Hinweise und Algorithmen."
        size="comfortable"
      />
    </View>
  );
}

export function MedicationListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();

  const medicationRows = useMemo(
    () => medications.map(mapMedicationToViewModel),
    [medications],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('DoseCalculator')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Dosisrechner öffnen"
          style={{
            marginRight: 4,
            minWidth: 56,
            minHeight: 56,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="calculator-outline"
            size={26}
            color={colors.navHeaderText}
          />
        </Pressable>
      ),
    });
  }, [navigation, colors.navHeaderText]);

  const handlePress = useCallback(
    (medicationId: string) => {
      navigation.navigate('MedicationDetail', { medicationId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MedicationViewModel>) => {
      const primaryTag = item.tags[0];
      const tagCfg = primaryTag ? TAG_CONFIG[primaryTag] : undefined;
      const leading = tagCfg ? (
        <ContentBadge
          label={tagCfg.label}
          backgroundColor={tagCfg.backgroundColor}
          textColor={tagCfg.textColor}
        />
      ) : undefined;

      return (
        <LookupListRow
          title={item.label}
          subtitle={item.listSubtitle}
          onPress={() => handlePress(item.id)}
          accessibilityLabel={`${item.label}. ${item.listSubtitle}`}
          leading={leading}
        />
      );
    },
    [handlePress],
  );

  return (
    <ScreenContainer>
      <View style={styles.wrap}>
        <FlatList
          style={styles.list}
          data={medicationRows}
          keyExtractor={medicationListKeyExtractor}
          renderItem={renderItem}
          initialNumToRender={FLAT_LIST_INITIAL_NUM_TO_RENDER}
          windowSize={FLAT_LIST_WINDOW_SIZE}
          removeClippedSubviews
          ListHeaderComponent={MedicationListHeader}
          ListEmptyComponent={
            <ListScreenEmptyPlaceholder message="Keine Medikamente im Bundle vorhanden." />
          }
          ItemSeparatorComponent={FlatListSeparator}
          contentContainerStyle={[
            styles.content,
            medicationRows.length === 0 ? styles.contentEmpty : null,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
