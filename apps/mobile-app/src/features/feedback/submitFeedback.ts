import { Platform, Share, type ShareAction, type ShareContent, type ShareOptions } from 'react-native';
import type { FeedbackCategory, FeedbackContext, FeedbackEntry } from '@/types/feedback';

const appConfig = require('../../../app.json') as {
  expo?: {
    version?: string;
  };
};

const APP_VERSION =
  typeof appConfig.expo?.version === 'string' ? appConfig.expo.version : '0.1.0';

const MAX_FEEDBACK_LENGTH = 500;

export type SubmitFeedbackInput = {
  category: FeedbackCategory | null;
  text: string;
  bundleId: string | null;
  /** Optional screen/content hint, e.g. current detail entity (included in shared text). */
  contextNote?: string | null;
};

type ShareFn = (
  content: ShareContent,
  options?: ShareOptions,
) => Promise<ShareAction>;

export function validateFeedbackText(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length < 1) return 'Bitte gib mindestens 1 Zeichen ein.';
  if (trimmed.length > MAX_FEEDBACK_LENGTH) {
    return `Feedback darf maximal ${MAX_FEEDBACK_LENGTH} Zeichen haben.`;
  }
  return null;
}

export function createFeedbackContext(
  bundleId: string | null,
  timestamp = new Date().toISOString(),
): FeedbackContext {
  return {
    bundleId,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    appVersion: APP_VERSION,
    timestamp,
  };
}

export function createFeedbackEntry(input: SubmitFeedbackInput): FeedbackEntry {
  return {
    category: input.category,
    text: input.text.trim(),
    context: createFeedbackContext(input.bundleId),
  };
}

function formatCategory(category: FeedbackCategory | null): string {
  if (category === 'bug') return 'Bug';
  if (category === 'idea') return 'Idee';
  if (category === 'improvement') return 'Verbesserung';
  return '-';
}

function formatPlatform(platform: FeedbackContext['platform']): string {
  return platform === 'ios' ? 'iOS' : 'Android';
}

export function serializeFeedback(
  entry: FeedbackEntry,
  contextNote?: string | null,
): string {
  const bundleLabel = entry.context.bundleId ?? '-';
  const ctx = contextNote?.trim();

  const lines: string[] = [
    '[ResQBrain Feedback]',
    `Kategorie: ${formatCategory(entry.category)}`,
    '---',
  ];

  if (ctx) {
    lines.push(`Kontext: ${ctx}`);
    lines.push('---');
  }

  lines.push(entry.text);
  lines.push('---');
  lines.push(
    `Bundle: ${bundleLabel} | ${formatPlatform(entry.context.platform)} | App ${entry.context.appVersion} | ${entry.context.timestamp}`,
  );

  return lines.join('\n');
}

export async function submitFeedback(
  input: SubmitFeedbackInput,
  shareImpl: ShareFn = Share.share,
) {
  const validationError = validateFeedbackText(input.text);
  if (validationError) {
    throw new Error(validationError);
  }

  const entry = createFeedbackEntry(input);
  const message = serializeFeedback(entry, input.contextNote ?? null);
  const result = await shareImpl({ message }, {
    dialogTitle: 'ResQBrain Feedback senden',
    subject: 'ResQBrain Feedback',
  });

  return {
    entry,
    message,
    result,
  };
}

export const feedbackConstraints = {
  maxLength: MAX_FEEDBACK_LENGTH,
} as const;
