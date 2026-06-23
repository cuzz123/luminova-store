"use client";

import { useState, type FormEvent } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) throw new Error("Subscription failed");

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-[#303e39] py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="font-[Jost] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          New pieces, early access, 10% off
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          Join our newsletter and be the first to know about new collections,
          restocks, and exclusive offers.
        </p>

        {/* Success state — replaces form */}
        {status === "success" ? (
          <div className="mt-8 inline-flex items-center gap-2.5 rounded-lg border border-green-500/20 bg-green-500/10 px-6 py-4">
            <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
            <p className="text-sm font-medium text-green-400">
              You&rsquo;re in! Check your inbox for a welcome email.
            </p>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-center"
          >
            <div className="relative flex-1 sm:max-w-sm">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={status === "loading"}
                className={cn(
                  "h-12 w-full rounded-md border bg-white pl-10 pr-4",
                  "text-sm text-[#111] placeholder:text-[#999]",
                  "border-[#e1dcd0] focus:border-[#d4a85c] focus:outline-none focus:ring-2 focus:ring-[#d4a85c]/50",
                  "disabled:opacity-60",
                )}
              />
            </div>
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={status === "loading"}
              className="min-w-[140px]"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        )}

        {/* Error message */}
        {status === "error" && (
          <p className="mt-4 text-sm font-medium text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
