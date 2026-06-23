"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "flintbeam-annbar-dismissed";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const stored = localStorage.getItem(STORAGE_KEY);
    setDismissed(stored === "true");
  }, []);

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  if (!mounted || dismissed) return null;

  return (
    <aside
      role="banner"
      className="relative flex items-center justify-center bg-[#303e39] px-4 py-2.5 text-sm text-white"
    >
      <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-center leading-relaxed">
        <span>Free shipping over $149</span>
        <span aria-hidden="true" className="opacity-40">
          .
        </span>
        <span>Hand-finished in California</span>
        <span aria-hidden="true" className="opacity-40">
          .
        </span>
        <span>
          <strong className="font-medium text-[#d4a85c]">
            Spring Collection
          </strong>{" "}
          just landed
        </span>
      </p>

      <button
        type="button"
        onClick={handleDismiss}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1",
          "text-white/60 transition-colors hover:bg-white/10 hover:text-white",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        )}
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
}
