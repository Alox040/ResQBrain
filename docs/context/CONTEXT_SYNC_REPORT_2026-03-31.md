# Context Sync Report — 2026-03-31

## Scope

- `README.md`
- `docs/context/**`
- `docs/context-export/**` (reviewed as comparison baseline)

## Updated files

- `README.md`
- `docs/context/project-overview.md`
- `docs/context/current-phase.md`
- `docs/context/roadmap-status.md`
- `docs/context/next-steps.md`
- `docs/context/WORK_SESSION.md`
- `docs/context/GLOBAL_PROJECT_SNAPSHOT.md`

## Contradictions found

1. `docs/context/WORK_SESSION.md` reported old branch/commit/deploy status that does not match current repo snapshot.
2. `docs/context/project-overview.md` stated "keine Dosierungsberechnung im UI", but `apps/mobile-app/src/screens/DoseCalculatorScreen.tsx` exists and is wired in navigator.
3. `docs/context/next-steps.md` listed algorithm detail/home quick-access as missing, but matching implemented screens and navigation files are present.
4. Legacy export docs (`docs/context-export/**`) include statements about locally executed build/test runs that were not re-verified in this synchronization pass.

## Unverifiable claims (explicitly marked as UNVERIFIED in synced docs)

- Live deployment/production state (website/mobile) outside repository files.
- "Last successful build" statements that require a fresh command run or CI evidence.
- External survey operation status beyond static URL/config presence in repo.

## Verification basis

- Root: `package.json`, `pnpm-workspace.yaml`, `vercel.json`, directory structure.
- Website: `apps/website/package.json`, `apps/website/vercel.json`, `apps/website/app/**`.
- Website legacy copy: `apps/website-old/package.json`, `apps/website-old/vercel.json`.
- Mobile: `apps/mobile-app/package.json`, `apps/mobile-app/src/**`.
- Domain package: `packages/domain/package.json`, `packages/domain/src/**`.
- Data: `data/lookup-seed/**`.
- Existing docs: `README.md`, `docs/context/**`, `docs/context-export/**`.

## Manual follow-up (only if needed)

- Re-run build/verification commands and refresh `docs/context-export/**` run-based claims if those exports are still consumed operationally.
