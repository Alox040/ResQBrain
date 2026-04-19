# Git hooks

Hooks in diesem Ordner sind **nicht** aktiv, solange Git nicht darauf zeigt.

Einmalig pro Clone:

```bash
git config core.hooksPath .githooks
```

- **pre-commit:** `scripts/check-mdr-boundary.js`
- **pre-push:** `pnpm exec tsx scripts/mdr-check.ts` (HIGH-Befunde brechen den Push ab)

`pnpm` muss für den Git-Prozess im `PATH` liegen (z. B. unter Windows die Shell-Umgebung, in der `pnpm` installiert ist).
