# Lifecycle Engine — Integrationsnotiz

## Rolle im Modul

- **`transitionLifecycle`** (`services/ContentLifecycleEngine.ts`) ist die einzige Orchestrierung: Ruft ausschließlich **`evaluateTransitionPolicy`** aus `policies/TransitionPolicy.ts` auf.
- **Governance** (Capabilities, `governance/evaluateTransition` o. ä.) ist **nicht** in der Engine eingebunden — fachliche/rollenbasierte Freigaben bleiben beim Aufrufer; die Engine wiederholt keine zweite Autorisierungsschicht.

## Audit

- Bei **erlaubtem** Ergebnis liefert die Engine ein **`auditRecord: Omit<LifecycleAuditEvent, 'timestamp'>`** (Persistenz/Timestamp bleiben beim Adapter).
- Verweigerte Übergänge liefern **keinen** Audit-Datensatz (`auditRecord` fehlt).
- **Release:** Wenn die Transition-Policy strukturell `operation: 'release'` liefert, **lehnt die Engine explizit ab** (`RELEASE_EXECUTION_NOT_IMPLEMENTED_IN_LIFECYCLE_ENGINE`) — keine Release-Orchestrierung, kein stiller Erfolg.

## Isolierte Kompilierung & Tests

- Typecheck nur Lifecycle + Shared: `npm run compile:lifecycle` (`tsconfig.lifecycle.json`).
- Tests: `npm run test:lifecycle` (Engine, Transitions, Invarianten).

## Barrel-Exporte

- `lifecycle/index.ts` re-exportiert `./services` → **`transitionLifecycle`** und zugehörige Typen sind unter `import * as Lifecycle from '@resqbrain/domain'` bzw. `./lifecycle` erreichbar.
