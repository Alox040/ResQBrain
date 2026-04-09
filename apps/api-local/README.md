# API Local

Minimaler lokaler Host fuer die read-only Lookup-API.

## Start

```bash
pnpm --dir apps/api-local start
```

Oder im Watch-Modus:

```bash
pnpm --dir apps/api-local dev
```

Standard-Port ist `3001`. Alternativ:

```bash
PORT=3100 pnpm --dir apps/api-local start
```

## Smoke Test

Das Smoke-Skript erwartet einen laufenden lokalen Server.

```bash
node apps/api-local/scripts/smoke-test-lookup.mjs
```

Alternativ mit abweichender Basis-URL:

```bash
API_BASE_URL=http://localhost:3100 node apps/api-local/scripts/smoke-test-lookup.mjs
```

Hinweis: Die Search-Route verwendet `searchTerm` als Query-Parameter.
