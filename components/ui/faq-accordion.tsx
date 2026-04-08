"use client";

import { useState } from "react";

type FaqAccordionItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: readonly FaqAccordionItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() =>
                setOpenIndex((currentIndex) =>
                  currentIndex === index ? null : index
                )
              }
            >
              <span className="text-base font-semibold text-[var(--color-text-primary)]">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="text-xl font-light text-[var(--color-accent)]"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen ? (
              <div className="px-6 pb-6">
                <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)]">
                  {item.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
