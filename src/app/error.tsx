"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 font-sans text-3xl font-medium tracking-tight" style={{ color: "var(--heading)" }}>
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md" style={{ color: "var(--body)" }}>
        An unexpected error occurred. Please try again, or return to the
        homepage.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: "var(--border)", color: "var(--heading)" }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
