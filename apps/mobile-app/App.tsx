import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hydrateHistory } from '@/features/history/historyStore';
import { AppNavigator } from '@/navigation/AppNavigator';
import { hydrateFavorites } from '@/state/favoritesStore';
import { hydrateRecent } from '@/state/recentStore';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { getActiveLookupStore, initializeLookupStore, loadLookupSource } from '@/lookup/lookupSource';
import { initializeContent } from '@/data/contentIndex';

function AppNavigation() {
  const { navigationTheme, isDark } = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

function AppLoading() {
  const { colors } = useTheme();
  return (
    <View style={[styles.loadingRoot, { backgroundColor: colors.bg }]}>
      <Text style={[styles.loadingText, { color: colors.textMuted }]}>
        Initializing content...
      </Text>
    </View>
  );
}

export default function App() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      // Load lookup content first (cached → embedded seed).
      const bundle = await loadLookupSource();
      initializeLookupStore(bundle);
      initializeContent(getActiveLookupStore());
      // Restliche Stores für den Einsatz hydrieren.
      await Promise.all([
        hydrateFavorites(),
        hydrateHistory(),
        hydrateRecent(),
      ]);
      setReady(true);
    })();
  }, []);

  return (
    <ThemeProvider>
      {ready ? <AppNavigation /> : <AppLoading />}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
