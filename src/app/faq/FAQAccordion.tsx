"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <span
                className={cn(
                  "text-base font-medium pr-4 transition-colors",
                  isOpen ? "" : "",
                )}
                style={{
                  color: isOpen ? "var(--accent)" : "var(--heading)",
                }}
              >
                {item.question}
              </span>
              <span
                className="flex-shrink-0 transition-transform duration-200"
                style={{
                  color: isOpen ? "var(--accent)" : "var(--body)",
                }}
              >
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[800px] pb-4" : "max-h-0",
              )}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--body)" }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
