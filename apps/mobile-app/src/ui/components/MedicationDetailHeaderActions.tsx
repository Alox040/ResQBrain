import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export type MedicationDetailHeaderActionsProps = {
  isFavorite: boolean;
  onOpenFeedback: () => void;
  onToggleFavorite: () => void;
};

const HEADER_HIT = 56;
const HEADER_ICON_SIZE = 28;

function MedicationDetailHeaderActionsComponent({
  isFavorite,
  onOpenFeedback,
  onToggleFavorite,
}: MedicationDetailHeaderActionsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <Pressable
        onPress={onOpenFeedback}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Feedback zu diesem Medikament senden"
        style={styles.button}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color={colors.navHeaderText}
        />
      </Pressable>
      <Pressable
        onPress={onToggleFavorite}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufuegen'
        }
        style={styles.button}
      >
        <Ionicons
          name={isFavorite ? 'star' : 'star-outline'}
          size={HEADER_ICON_SIZE}
          color="#fbbf24"
        />
      </Pressable>
    </View>
  );
}

export const MedicationDetailHeaderActions = memo(
  MedicationDetailHeaderActionsComponent,
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginRight: 4,
    minWidth: HEADER_HIT,
    minHeight: HEADER_HIT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
