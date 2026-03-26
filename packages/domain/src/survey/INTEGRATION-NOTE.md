# Survey-Layer — Integrationsstand

Abgestimmt auf `docs/architecture/implementation-order-blueprint.md` (Phase G — isolierte Schicht), `docs/planning/MVP_SCOPE_LOCK.md` (§6) und `docs/planning/SURVEY_IMPORT_PLAN.md` (Phase A1).

## Umsetzung

- **Entitäten** unter `entities/`: `InsightType.ts` (`SurveyInsightKind`: demand / gap / issue / vote), `SurveyConfidence.ts`, `SurveyTargetEntityType.ts`, `SurveyInsight.ts` mit Factory `createSurveyInsight`.
- **Abhängigkeiten**: nur `shared/` und `tenant/` (Cross-Ref / Scope-Validierung). Keine Imports aus `governance/`, `lifecycle/`, `release/`.
- **Pflichtfelder laut Import-Plan**: `organizationId`, `governanceLocked` (typisiert als Literal `true`), Import-Metadaten (`sourceRef`, `importedAt`), Kernsignal (`insightType`, `confidence`, `value`, `targetEntityType`).
- **Append-only**: Domain stellt nur Erstellung über `createSurveyInsight` bereit; Rückgabe ist `Object.freeze` (kein Update-Pfad für importierte Rohdaten).
- **Isolation**: `pnpm exec tsc -p tsconfig.survey.json` — nur `shared` + `tenant` + `survey` (Tests ausgeschlossen).

## Abweichung vom Blueprint §2.12

Dort genannte `InsightStatus` / `InsightPriority` und das ältere `SurveyInsight`-Feldmodell sind durch **MVP_SCOPE_LOCK** und **SURVEY_IMPORT_PLAN** ersetzt (`confidence`, kein Status-/Priority-Enum in der Foundation).

## Tests

`src/survey/survey.entities.test.ts` — inkl. Grenzfall P-11 (kein Schreibpfad in Content-Lifecycle). Nutzt absichtlich `content/` nur im Test, nicht im Survey-Modul.
