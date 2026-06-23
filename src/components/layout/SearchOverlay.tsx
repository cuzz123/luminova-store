"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";

const POPULAR_SEARCHES = [
  "Chandelier",
  "Brass",
  "Sconce",
  "Table Lamp",
  "Pendant",
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setError(false);
      // Delay focus for animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // onClose will be called when isOpen changes to true... actually
          // the parent controls open state. We just fire the event.
          // The parent toggles based on this shortcut — handled externally.
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Search failed");
      const data: Product[] = await res.json();
      setResults(data);
    } catch {
      setError(true);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl rounded-xl bg-white shadow-2xl">
        {/* Search input */}
        <div className="flex items-center border-b border-[#e1dcd0]/50 px-4">
          <Search className="h-5 w-5 flex-shrink-0 text-[#999]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search fixtures, materials, collections..."
            className={cn(
              "flex-1 bg-transparent px-3 py-4 text-base text-[#111] placeholder:text-[#999]",
              "focus:outline-none",
            )}
            aria-label="Search products"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded p-1 text-[#999] hover:text-[#111]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#c25b3e]" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-[#999]">
                Something went wrong. Please try again.
              </p>
            </div>
          )}

          {/* No results */}
          {!loading && !error && query.trim() && results.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-[#111]">
                No results found for &quot;{query}&quot;
              </p>
              <p className="mt-1 text-sm text-[#999]">
                Try a different search term or browse our categories.
              </p>
            </div>
          )}

          {/* Results list */}
          {!loading && !error && results.length > 0 && (
            <ul className="divide-y divide-[#e1dcd0]/30">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 transition-colors",
                      "hover:bg-[#f5f3f0]",
                    )}
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-[#f5f3f0]">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#111]">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs uppercase tracking-wide text-[#c25b3e]">
                        {CATEGORIES.find((c) => c.slug === product.category)?.name ??
                          product.category}
                      </p>
                    </div>
                    <p className="flex-shrink-0 text-sm font-semibold text-[#111]">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Popular searches (when query is empty) */}
          {!loading && !error && !query.trim() && (
            <div className="px-4 py-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#999]">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className={cn(
                      "rounded-full border border-[#e1dcd0] px-3.5 py-1.5 text-sm text-[#555] transition-colors",
                      "hover:border-[#c25b3e] hover:text-[#c25b3e]",
                    )}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
