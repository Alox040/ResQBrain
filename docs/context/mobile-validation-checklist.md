# Mobile app — validation checklist

Lightweight local workflow for `apps/mobile-app` (Expo + React Native). Use before PRs and releases.

## Commands to run (automated)

From repository root:

| Goal | Command |
|------|---------|
| **Fast static gate** (typecheck + nav checks, no Metro/export) | `cd apps/mobile-app && pnpm verify:static` |
| **Full local gate** (typecheck + nav checks + Android bundle) | `pnpm mobile:verify` |
| **Typecheck only** | `pnpm --filter @resqbrain/mobile-app exec tsc --noEmit` or `cd apps/mobile-app && pnpm typecheck` |
| **Screen registration** (JSX `name=` vs param list types) | `cd apps/mobile-app && pnpm verify:navigation` |
| **Route consistency** (`navigate` / nested `screen:` vs declared routes) | `cd apps/mobile-app && pnpm verify:nav-routes` |
| **Expo / dependency health** (may warn on duplicates or SDK drift) | `cd apps/mobile-app && pnpm verify:expo-doctor` or `pnpm mobile:verify:doctor` |
| **Bundler sanity** (no dev server; proves Metro can produce an Android export) | `cd apps/mobile-app && pnpm verify:expo-bundle` (same output dir as `export:android`) |

`verify:static` runs: `typecheck` → `verify:navigation` → `verify:nav-routes`.

`verify:local` runs: `verify:static` → `verify:expo-bundle`.

### Lint

There is **no ESLint configuration** in `apps/mobile-app` today. This is intentional for now: adding ESLint would require new dependencies and config surface area for limited immediate value. `pnpm --filter @resqbrain/mobile-app run lint` currently prints a reminder; the active lightweight quality gate is `verify:static`.

### Expo start (manual smoke)

Long-running dev server is **not** part of `verify:local` (CI-friendly).

1. `cd apps/mobile-app && pnpm start` (or `pnpm android` / `pnpm ios`).
2. Open in Expo Go or dev build; confirm the app boots without a red Metro error screen.
3. Optional: reload once (shake device → Reload) to catch stale cache issues.

---

## What to test manually

Use after data or navigation changes, or when touching lookup / adapters.

- **Root tabs** (see `AppNavigator.tsx`): Start (Home-Stack), Suche, Einstellungen, Medikamente, Algorithmen — **Favoriten** und **Verlauf** sind **keine** eigenen Root-Tabs (Start/Home inkl. Schnellzugriff; Verlauf als Screen im Home-Stack).
- **Stacks**: back navigation from detail returns to the expected list; nested opens from Home quick actions land on the correct screen.
- **Cross-tab deep links**: from a medication, open a related algorithm (and reverse); from search / favorites / history, open both kinds of content.
- **Lookup bundle**: list loads, detail shows content; broken related IDs show the unavailable row (no crash).
- **Persistence**: favorite toggle and history entries survive app restart (AsyncStorage).
- **Dose calculator**: med picker, weight input, and result or “no mg/kg” state behave as before.
- **Offline**: toggle airplane mode; confirm lookup content still loads (embedded bundle).

---

## Common failure points

| Symptom | Likely cause |
|--------|----------------|
| `tsc` errors on `navigate(...)` | Route name or params don’t match `RootTabParamList` / stack param lists in `AppNavigator.tsx` / `homeStackParamList.ts`. |
| `verify:navigation` fails | Added a `<*.Screen name="…">` but didn’t add the same key on the corresponding `*ParamList` type (or the reverse). |
| `verify:nav-routes` fails | Typo in `navigation.navigate('…')` or `screen: '…'` — string not present on any tab/stack param list. |
| `verify:expo-bundle` / `export:android` fails | Metro resolution error, bad import, or invalid JSON in `data/lookup-seed`. |
| `expo-doctor` exits non-zero | Dependency version drift (e.g. `@expo/vector-icons`), duplicate native deps, or `.expo/` not gitignored — advisory until fixed. |
| Red screen at runtime “invalid lookup bundle” | Seed JSON failed validation; run repo `pnpm dbrd:build` or fix seed files. |

---

## Release smoke test list

Run **`pnpm mobile:verify`** plus **manual Expo start** above, then:

1. Cold start: app opens on Start tab without error.
2. Search: query returns hits; open one medication and one algorithm.
3. Medikamente: open list → detail → related algorithm cross-ref (if present).
4. Algorithmen: open list → detail → related medication cross-ref (if present).
5. Favoriten: star an item on detail; appears in Favoriten; tap opens detail.
6. Verlauf: open a few items; Verlauf lists them; tap opens detail.
7. Home: at least one quick action opens the correct target (**Vitalwerte**, **Suche**, list shortcuts).
8. Dosisrechner: select med, enter weight, see result or explicit empty state.
9. Airplane mode: repeat a quick open of one medication and one algorithm (offline OK).

Record device/OS, commit hash, and any `expo-doctor` warnings accepted for that release.

---

## Maintenance

- **New screen**: register in `AppNavigator.tsx`, extend the relevant `*ParamList` type, run `pnpm verify:navigation` and `pnpm verify:nav-routes`.
- **New `navigate('…')` calls**: use names that exist on the param lists; `verify:nav-routes` only scans `src/**/*.tsx` outside `src/navigation/`.

Scripts live under `apps/mobile-app/scripts/`:

- `verify-navigation.mjs` — screen registration check  
- `verify-nav-routes.mjs` — navigation route consistency check  
