const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

type Entry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = globalThis as typeof globalThis & {
  __mitwirkenRateLimitStore__?: Map<string, Entry>;
};

function getStore(): Map<string, Entry> {
  if (!rateLimitStore.__mitwirkenRateLimitStore__) {
    rateLimitStore.__mitwirkenRateLimitStore__ = new Map<string, Entry>();
  }

  return rateLimitStore.__mitwirkenRateLimitStore__;
}

export function isRateLimited(key: string): boolean {
  const store = getStore();
  const now = Date.now();
  const existingEntry = store.get(key);

  if (!existingEntry || existingEntry.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return false;
  }

  if (existingEntry.count >= MAX_REQUESTS) {
    return true;
  }

  existingEntry.count += 1;
  store.set(key, existingEntry);

  return false;
}
