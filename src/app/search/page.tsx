"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { searchProducts, type Product } from "@/lib/products";
import { useWishlistStore } from "@/lib/wishlist";
import { useCartStore } from "@/lib/cart";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

const POPULAR_SEARCHES = [
  "Brass",
  "Chandelier",
  "Pendant",
  "Sconce",
  "Wood",
  "Outdoor",
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const addToCart = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Search when initial query is in URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const performSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);

    // Use local search for instant results; optionally fetch from API
    const localResults = searchProducts(q.trim());
    setResults(localResults);
    setLoading(false);

    // Also notify server-side search for analytics
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`).catch(() => {});
  }, []);

  // Debounced search
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setSearched(false);
    inputRef.current?.focus();
  }, []);

  const handleChipClick = useCallback(
    (term: string) => {
      setQuery(term);
      performSearch(term);
      inputRef.current?.focus();
    },
    [performSearch],
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] || "",
        price: product.price,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart`);
    },
    [addToCart],
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 lg:py-16">
        {/* Search bar */}
        <div className="relative mb-10">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--body)" }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search products..."
            className="w-full pl-12 pr-12 py-4 text-lg rounded-xl border bg-white transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--heading)",
            }}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" style={{ color: "var(--body)" }} />
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "var(--body)" }}
            />
          </div>
        )}

        {/* No query state */}
        {!loading && !searched && (
          <div className="text-center py-16">
            <Search
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--border)" }}
            />
            <h2
              className="text-xl font-medium mb-2"
              style={{ color: "var(--heading)" }}
            >
              Search for products
            </h2>
            <p className="mb-8" style={{ color: "var(--body)" }}>
              Find handcrafted lighting by name, material, or style.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleChipClick(term)}
                  className="px-4 py-2 rounded-full text-sm border transition-colors hover:bg-gray-50"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--heading)",
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <div>
            <div className="mb-8">
              <h1
                className="text-2xl font-medium mb-1"
                style={{ color: "var(--heading)" }}
              >
                {results.length > 0
                  ? `Search results for: "${query}"`
                  : `No results for: "${query}"`}
              </h1>
              {results.length > 0 && (
                <p style={{ color: "var(--body)" }}>
                  {results.length} {results.length === 1 ? "product" : "products"}{" "}
                  found
                </p>
              )}
            </div>

            {/* Results grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <SearchResultCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={isWishlisted(product.id)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-16">
                <p
                  className="text-lg mb-3"
                  style={{ color: "var(--heading)" }}
                >
                  No results found
                </p>
                <p className="mb-8" style={{ color: "var(--body)" }}>
                  Try a different search term or browse our categories.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleChipClick(term)}
                      className="px-4 py-2 rounded-full text-sm border transition-colors hover:bg-gray-50"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--heading)",
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  Browse all products
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Search Result Card                                                 */
/* ------------------------------------------------------------------ */

function SearchResultCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: { id: string; name: string; slug: string; image: string; price: number }) => void;
  isWishlisted: boolean;
}) {
  return (
    <div
      className="group rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor: "var(--border)" }}
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Search className="w-10 h-10 opacity-20" />
          </div>
        )}
        {product.isNew && (
          <span
            className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            New
          </span>
        )}
        {product.isBestSeller && (
          <span
            className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium text-white"
            style={{ backgroundColor: "var(--dark)" }}
          >
            Best Seller
          </span>
        )}
      </Link>
      <div className="p-4">
        <p
          className="text-xs uppercase tracking-wider mb-1"
          style={{ color: "var(--body)" }}
        >
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3
            className="font-medium mb-1 hover:underline"
            style={{ color: "var(--heading)" }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--heading)" }}
          >
            {formatPrice(product.price)}
          </span>
          {product.compareAt && (
            <span
              className="text-sm line-through"
              style={{ color: "var(--body)" }}
            >
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 py-2 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--dark)" }}
          >
            Add to Cart
          </button>
          <button
            onClick={() =>
              onToggleWishlist({
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0] || "",
                price: product.price,
              })
            }
            className={cn(
              "p-2 rounded-md border transition-colors",
              isWishlisted
                ? "text-white border-transparent"
                : "hover:bg-gray-50",
            )}
            style={{
              borderColor: isWishlisted ? "transparent" : "var(--border)",
              backgroundColor: isWishlisted ? "var(--accent)" : "transparent",
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
