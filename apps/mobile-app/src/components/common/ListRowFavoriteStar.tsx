import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useFavoriteToggle } from '@/state/favoritesStore';
import type { ContentKind } from '@/types/content';

const ICON_SIZE = 24;
const STAR_COLOR = '#fbbf24';

export type ListRowFavoriteStarProps = {
  kind: ContentKind;
  id: string;
};

/**
 * Star control for lookup list rows; uses persisted favorites store.
 */
export function ListRowFavoriteStar({ kind, id }: ListRowFavoriteStarProps) {
  const { isFavorite, toggleFavorite } = useFavoriteToggle(id, kind);
  const onPress = useCallback(() => {
    void toggleFavorite();
  }, [toggleFavorite]);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'
      }
      style={styles.hit}
    >
      <Ionicons
        name={isFavorite ? 'star' : 'star-outline'}
        size={ICON_SIZE}
        color={STAR_COLOR}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
});
