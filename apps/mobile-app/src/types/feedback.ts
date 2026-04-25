export type FeedbackCategory = 'bug' | 'idea' | 'improvement';

export interface FeedbackContext {
  bundleId: string | null;
  platform: 'ios' | 'android';
  appVersion: string;
  timestamp: string;
}

export interface FeedbackEntry {
  category: FeedbackCategory | null;
  text: string;
  context: FeedbackContext;
}

export type Feedback = FeedbackEntry;
