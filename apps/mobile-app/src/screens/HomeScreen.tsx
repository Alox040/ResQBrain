import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Label } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

type QuickItem = {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  navigate: () => void;
};

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const quickItems: QuickItem[] = [
    {
      key: 'search',
      title: 'Suche',
      subtitle: 'Medikamente, Protokolle und Begriffe schnell finden',
      icon: 'search',
      iconColor: COLORS.primary,
      backgroundColor: COLORS.primaryMutedBg,
      navigate: () => navigation.navigate('Search'),
    },
    {
      key: 'meds',
      title: 'Medikamente',
      subtitle: 'Dosierungen, Hinweise und Standardpräparate',
      icon: 'medical',
      iconColor: '#0f766e',
      backgroundColor: '#ccfbf1',
      navigate: () =>
        navigation.navigate('MedicationList', { screen: 'MedicationList' }),
    },
    {
      key: 'algo',
      title: 'Algorithmen',
      subtitle: 'Strukturierte Abläufe für häufige Notfallsituationen',
      icon: 'git-network-outline',
      iconColor: '#9a3412',
      backgroundColor: '#ffedd5',
      navigate: () =>
        navigation.navigate('AlgorithmList', { screen: 'AlgorithmList' }),
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>ResQBrain</Text>
          <Text style={styles.title}>Schneller Zugriff auf Notfallwissen</Text>
          <Text style={styles.subtitle}>
            Medikamente, Algorithmen und Suche in einer klaren mobilen Oberfläche.
          </Text>
        </View>

        <View style={styles.sectionBlock}>
          <Label text="Schnellzugriff" style={styles.sectionHeading} />

          <View style={styles.quickList}>
            {quickItems.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${item.subtitle}`}
                onPress={item.navigate}
                style={({ pressed }) => [
                  styles.quickTile,
                  pressed && styles.quickTilePressed,
                ]}
              >
                <View
                  style={[
                    styles.quickIconWrap,
                    { backgroundColor: item.backgroundColor },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={26}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.quickTextCol}>
                  <Text style={styles.quickTitle}>{item.title}</Text>
                  <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={COLORS.textMuted}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="flash-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoValue}>Sofort nutzbar</Text>
            <Text style={styles.infoLabel}>Lesbare Karten, klare Typografie</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="phone-portrait-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoValue}>Touch</Text>
            <Text style={styles.infoLabel}>Große Ziele, wenig Fehlbedienung</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const QUICK_TILE_MIN = 88;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.screenPaddingBottom,
    gap: SPACING.screenPadding,
  },
  heroCard: {
    ...CARD.base,
    paddingVertical: SPACING.screenPadding,
    gap: SPACING.gapSm,
  },
  eyebrow: {
    ...TYPOGRAPHY.sectionTitle,
  },
  title: {
    ...TYPOGRAPHY.title,
    lineHeight: 30,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
    color: '#4b5563',
  },
  sectionBlock: {
    gap: SPACING.gapMd,
  },
  sectionHeading: {
    ...TYPOGRAPHY.sectionTitle,
    fontSize: 13,
    marginBottom: 2,
  },
  quickList: {
    gap: SPACING.gapMd,
  },
  quickTile: {
    minHeight: QUICK_TILE_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gapMd,
    ...CARD.base,
    paddingVertical: 14,
  },
  quickTilePressed: {
    backgroundColor: COLORS.primaryMutedBg,
    borderColor: '#bfdbfe',
  },
  quickIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTextCol: {
    flex: 1,
    gap: 4,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  quickSubtitle: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.gapMd,
  },
  infoCard: {
    flex: 1,
    gap: SPACING.gapSm,
    paddingVertical: SPACING.screenPadding,
    ...CARD.base,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  infoLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textMuted,
  },
});
