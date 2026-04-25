import React, { useCallback, useEffect, useState } from 'react';
import {
  feedbackConstraints,
  submitFeedback,
} from './submitFeedback';
import type { FeedbackCategory } from '@/types/feedback';
import { FeedbackSheetUI } from '@/ui/components/FeedbackSheetUI';

export type FeedbackSheetProps = {
  visible: boolean;
  bundleId: string | null;
  /** Optional origin, e.g. detail screen + entity id (appended to shared feedback). */
  contextNote?: string | null;
  onClose: () => void;
};

export function FeedbackSheet({
  visible,
  bundleId,
  contextNote = null,
  onClose,
}: FeedbackSheetProps) {
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback(() => {
    setCategory(null);
    setText('');
    setError(null);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [reset, visible]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await submitFeedback({
        category,
        text,
        bundleId,
        contextNote,
      });
      handleClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Feedback konnte nicht geteilt werden.';
      setError(message);
      setIsSubmitting(false);
    }
  }, [bundleId, category, contextNote, handleClose, text]);

  return (
    <FeedbackSheetUI
      visible={visible}
      category={category}
      text={text}
      error={error}
      isSubmitting={isSubmitting}
      maxLength={feedbackConstraints.maxLength}
      onCategoryChange={(nextCategory) => {
        setCategory((current) =>
          current === nextCategory ? null : nextCategory,
        );
      }}
      onTextChange={(value) => {
        setText(value);
        if (error) {
          setError(null);
        }
      }}
      onSubmit={() => {
        void handleSubmit();
      }}
      onClose={handleClose}
    />
  );
}
