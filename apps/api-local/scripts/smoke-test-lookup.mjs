const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001';
const organizationId = 'pilot-wache-001';
const algorithmId = 'alg-cpr-adult';
const medicationId = 'med-adrenalin';
const searchTerm = 'reanimation';

const checks = [
  {
    name: 'GET /api/algorithms',
    path: `/api/algorithms?organizationId=${encodeURIComponent(organizationId)}`,
    validate(body) {
      return (
        body != null &&
        Array.isArray(body.items) &&
        body.items.length > 0 &&
        typeof body.items[0]?.id === 'string'
      );
    },
  },
  {
    name: 'GET /api/algorithms/:id',
    path: `/api/algorithms/${encodeURIComponent(algorithmId)}?organizationId=${encodeURIComponent(organizationId)}`,
    validate(body) {
      return body != null && body.id === algorithmId && typeof body.title === 'string';
    },
  },
  {
    name: 'GET /api/medications',
    path: `/api/medications?organizationId=${encodeURIComponent(organizationId)}`,
    validate(body) {
      return (
        body != null &&
        Array.isArray(body.items) &&
        body.items.length > 0 &&
        typeof body.items[0]?.id === 'string'
      );
    },
  },
  {
    name: 'GET /api/medications/:id',
    path: `/api/medications/${encodeURIComponent(medicationId)}?organizationId=${encodeURIComponent(organizationId)}`,
    validate(body) {
      return body != null && body.id === medicationId && typeof body.name === 'string';
    },
  },
  {
    name: 'GET /api/search?searchTerm=...',
    path:
      `/api/search?organizationId=${encodeURIComponent(organizationId)}` +
      `&searchTerm=${encodeURIComponent(searchTerm)}`,
    validate(body) {
      return (
        body != null &&
        Array.isArray(body.items) &&
        body.items.some((item) => typeof item?.title === 'string')
      );
    },
  },
];

let failed = false;

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
    });

    if (response.status !== 200) {
      failed = true;
      console.error(`FAIL ${check.name} -> expected 200, got ${response.status}`);
      continue;
    }

    let body;

    try {
      body = await response.json();
    } catch (error) {
      failed = true;
      console.error(
        `FAIL ${check.name} -> response is not valid JSON: ${formatError(error)}`,
      );
      continue;
    }

    if (!check.validate(body)) {
      failed = true;
      console.error(
        `FAIL ${check.name} -> JSON shape check failed: ${JSON.stringify(body)}`,
      );
      continue;
    }

    console.log(`PASS ${check.name}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${check.name} -> request failed: ${formatError(error)}`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('PASS Smoke test complete');
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}
