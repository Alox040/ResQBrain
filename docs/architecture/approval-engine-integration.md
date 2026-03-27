# Approval Engine — Integrationsnotiz

## Einordnung

Die **Approval Engine** liegt unter `packages/domain/src/governance/approval/` und ist Teil des **Governance**-Moduls, nicht als eigener Top-Level-Slice neben Lifecycle oder Versioning.

- Öffentliche API: `@resqbrain/domain` als Namespace `Approval` (`export * as Approval from './governance/approval'`).
- Zusätzlich werden die gleichen Symbole über `governance` re-exportet (`export * from './approval'` in `governance/index.ts`), damit Governance als Entscheidungsquelle konsumierbar bleibt.

## Regeln (Einhaltung)

| Regel | Umsetzung |
|--------|------------|
| Keine Lifecycle-Mutation | `submitApprovalDecision` / `collectApprovalState` importieren kein Lifecycle; es gibt keinen `LifecycleState`-Output. |
| Keine Release-Logik | Keine Abhängigkeit zu `release/` oder ContentPackage-Release-Orchestrierung. |
| Governance als Quelle | Capability-Prüfung via `getCapabilityGrantingRoles`; Quorum via `evaluateQuorum` (`ApprovalResolutionPolicy`). |
| Audit nur bei Decision Submission | `auditRecord` nur im `allowed`-Zweig von `submitApprovalDecision`; kein Audit bei reinem `collectApprovalState`. |
| Tenant-scoped | Abgleich `actor`, `target` und `policy` auf dieselbe `organizationId` (`validateOrgIdPresent`). |
| Append-only (semantisch) | Neue Entscheidungen werden als neue Records übergeben; pro Actor wird für die Quorum-Bewertung die **letzte** aktive Entscheidung verwendet (siehe unten). |
| Keine impliziten Approvals | Kein automatisches `approve` ohne expliziten Submit. |
| Kein neuer Top-Level-Layer | Ordner unter `governance/`, nicht `src/approval/` auf Root-Ebene. |

## Quorum und Stale

- **Stale**: `detectStaleApproval` vergleicht `decision.versionId` mit `target.currentVersionId`. Veraltete Einträge fließen nicht in `evaluateQuorum` ein (nach Filterung und Abbildung auf `ApprovalDecision`).
- **Quorum**: `collectApprovalState` mappt aktive `ApprovalDecisionRecord`-Einträge auf `ApprovalDecision` und ruft **`evaluateQuorum`** auf — dieselbe Logik wie in der Governance-Policieschicht (`QuorumType`, `minimumReviewers`, etc.).
- **`evaluateApprovalQuorum`**: Dünner Pfad über `collectApprovalState` → identisches Quorum wie der Rest der Governance.

## Audit

Submission liefert `Omit<ApprovalDecisionAuditEvent, 'timestamp'>`; Persistierung mit Zeitstempel bleibt bei der Audit-Schicht (`stampAuditEventForPersistence`).

## Isolation / Compile

- `tsconfig.governance.json` umfasst `src/governance/**/*.ts` und damit die Approval Engine.
- Die Engine importiert **nicht** `lifecycle/`, `release/` oder `survey/`.

## Mögliche Guardrail-Verstöße / technische Schulden

1. **Zwei Record-Modelle**: Laufende Submissions nutzen `ApprovalDecisionRecord` (flach, auditfreundlich); die Quorum-Bewertung nutzt kurzzeitig `createApprovalDecision` mit synthetischen Feldern (`reviewedAt: new Date(0)`, Platzhalter-`changeRequests` bei `RequestChanges`). Persistenz der „echten“ Governance-Entität muss dieselben fachlichen Regeln einhalten, sonst divergiert Speicher vs. Engine.
2. **Actor-Deduplizierung**: Vor `evaluateQuorum` gilt **letzte Entscheidung pro Actor** (`Map` über `actorId`). `evaluateQuorum` selbst dedupliziert nicht — die Semantik „append-only Log, effektive Stimme = letzte aktive“ ist bewusst in der Engine.
3. **`ApprovalResolutionPolicy`**: Am Ende von `evaluateQuorum` existieren historisch überlappende Zweige (z. B. `SINGLE_REJECT`); das ist eine bestehende Governance-Implementierungswarnung, nicht durch die Approval Engine neu eingeführt.
