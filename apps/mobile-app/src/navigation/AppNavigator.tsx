import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { AlgorithmDetailScreen } from '@/screens/AlgorithmDetailScreen';
import { MedicationDetailScreen } from '@/screens/MedicationDetailScreen';
import { AlgorithmListScreen } from '@/screens/AlgorithmListScreen';
import { VitalReferenceScreen } from '@/features/references/VitalReferenceScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MedicationListAdapter } from '@/features/lookup/adapters/MedicationListAdapter';
import { SearchScreen } from '@/screens/SearchScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import { useTheme } from '@/theme/ThemeContext';
import { TYPOGRAPHY } from '@/theme';
import type { ContentCategory } from '@/types/content';

export type { HomeStackParamList };

export type MedicationStackParamList = {
  MedicationListScreen: undefined;
};

export type AlgorithmStackParamList = {
  AlgorithmListScreen:
    | {
        category?: ContentCategory;
      }
    | undefined;
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Settings: undefined;
  MedicationTab: NavigatorScreenParams<MedicationStackParamList>;
  AlgorithmTab: NavigatorScreenParams<AlgorithmStackParamList>;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  MedicationDetail: {
    medicationId: string;
  };
  AlgorithmDetail: {
    algorithmId: string;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MedicationStack = createNativeStackNavigator<MedicationStackParamList>();
const AlgorithmStack = createNativeStackNavigator<AlgorithmStackParamList>();

function useStackScreenOptions() {
  const { colors } = useTheme();
  return useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.navHeaderBg },
      headerTintColor: colors.navHeaderText,
      headerTitleStyle: {
        ...TYPOGRAPHY.title,
        color: colors.navHeaderText,
      },
      headerBackTitleVisible: false,
      contentStyle: { backgroundColor: colors.bg },
    }),
    [colors],
  );
}

function HomeStackNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Verlauf' }}
      />
      <HomeStack.Screen
        name="VitalReference"
        component={VitalReferenceScreen}
        options={{ title: 'Vitalwerte' }}
      />
    </HomeStack.Navigator>
  );
}

function MedicationStackNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <MedicationStack.Navigator screenOptions={screenOptions}>
      <MedicationStack.Screen
        name="MedicationListScreen"
        component={MedicationListAdapter}
        options={{ title: 'Medikamente' }}
      />
    </MedicationStack.Navigator>
  );
}

function AlgorithmStackNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <AlgorithmStack.Navigator screenOptions={screenOptions}>
      <AlgorithmStack.Screen
        name="AlgorithmListScreen"
        component={AlgorithmListScreen}
        options={{ title: 'Algorithmen' }}
      />
    </AlgorithmStack.Navigator>
  );
}

function TabsNavigator() {
  const { colors } = useTheme();

  const tabOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.navHeaderBg },
      headerTintColor: colors.navHeaderText,
      headerTitleStyle: {
        ...TYPOGRAPHY.title,
        color: colors.navHeaderText,
      },
      tabBarStyle: { backgroundColor: colors.tabBarBg },
      tabBarActiveTintColor: colors.tabActive,
      tabBarInactiveTintColor: colors.tabInactive,
    }),
    [colors],
  );

  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: 'Start',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Suche',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Einstellungen',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MedicationTab"
        component={MedicationStackNavigator}
        options={{
          title: 'Medikamente',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AlgorithmTab"
        component={AlgorithmStackNavigator}
        options={{
          title: 'Algorithmen',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="git-branch-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const screenOptions = useStackScreenOptions();

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="Tabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{ title: 'Medikament' }}
      />
      <RootStack.Screen
        name="AlgorithmDetail"
        component={AlgorithmDetailScreen}
        options={{ title: 'Algorithmus' }}
      />
    </RootStack.Navigator>
  );
}
