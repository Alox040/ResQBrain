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

async function runBackgroundBundleUpdate(
  bundleUrl: string,
  currentDebugInfo: {
    version: string | null;
    source: 'embedded' | 'cached' | 'updated' | 'fallback';
    lastUpdate: string | null;
    pendingUpdate: boolean;
  },
): Promise<void> {
  const updateCheck = await checkForBundleUpdate(bundleUrl);
  if (updateCheck.status !== 'update-available') {
    return;
  }

  console.log('update available');

  const applyResult = await applyBundleUpdate(bundleUrl);
  if (applyResult.status === 'updated') {
    console.log('update downloaded');
    await setBundleDebugInfo({
      ...currentDebugInfo,
      lastUpdate: new Date().toISOString(),
      pendingUpdate: true,
    });
  }
}

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
      let pendingUpdate = persistedDebugInfo?.pendingUpdate ?? false;

      // 1) Load resolver (updated -> cached -> embedded fallback).
      const resolved = await resolveLookupBundle();
      if (pendingUpdate && resolved.source === 'updated') {
        console.log('update applied');
        pendingUpdate = false;
      }

      // 2) Initialize content index with the active bundle.
      initializeContent(buildLookupRamStore(resolved.bundle));
      await setBundleDebugInfo({
        version: resolved.version,
        source: resolved.source,
        lastUpdate,
        pendingUpdate,
      });

      // Restliche Stores für den Einsatz hydrieren.
      await Promise.all([
        hydrateFavorites(),
        hydrateHistory(),
        hydrateRecent(),
      ]);
      setReady(true);

      // 3) Start silent update in background; active bundle stays unchanged for this launch.
      if (bundleUrl) {
        void runBackgroundBundleUpdate(bundleUrl, {
          version: resolved.version,
          source: resolved.source,
          lastUpdate,
          pendingUpdate,
        });
      }
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
