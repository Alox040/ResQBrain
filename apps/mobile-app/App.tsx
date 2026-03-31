import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hydrateHistory } from '@/features/history/historyStore';
import { AppNavigator } from '@/navigation/AppNavigator';
import { hydrateFavorites } from '@/state/favoritesStore';
import { hydrateRecent } from '@/state/recentStore';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { buildLookupRamStore } from '@/lookup/loadLookupBundle';
import { applyBundleUpdate, checkForBundleUpdate } from '@/lookup/bundleUpdateService';
import { resolveLookupBundle } from '@/lookup/sourceResolver';
import { getBundleDebugInfo, setBundleDebugInfo } from '@/lookup/bundleDebugInfo';
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
      const bundleUrl = process.env.EXPO_PUBLIC_LOOKUP_BUNDLE_URL;
      const persistedDebugInfo = await getBundleDebugInfo();
      let lastUpdate = persistedDebugInfo?.lastUpdate ?? null;

      // 1) Load resolver (updated -> cached -> embedded fallback).
      let resolved = await resolveLookupBundle();

      // 2) Check update and 3) apply bundle (if newer remote version exists).
      if (bundleUrl) {
        const updateCheck = await checkForBundleUpdate(bundleUrl);
        if (updateCheck.status === 'update-available') {
          const applyResult = await applyBundleUpdate(bundleUrl);
          if (applyResult.status === 'updated') {
            resolved = await resolveLookupBundle();
            lastUpdate = new Date().toISOString();
          }
        }
      }

      // 4) Initialize content index with the active bundle.
      initializeContent(buildLookupRamStore(resolved.bundle));
      await setBundleDebugInfo({
        version: resolved.version,
        source: resolved.source,
        lastUpdate,
      });

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
