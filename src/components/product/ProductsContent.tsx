"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import type { Product, Category } from "@/lib/products";

interface ProductsContentProps {
  products: Product[];
  categories: Category[];
  activeCategory: string | null;
  searchQuery: string;
}

export default function ProductsContent({
  products,
  categories,
  activeCategory,
  searchQuery,
}: ProductsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /* ------------------------------------------------------------------ */
  /*  Sync local state when URL changes (back/forward navigation)        */
  /*  Uses searchParams from URL as the source of truth for syncing.     */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    // Only sync if the URL query differs from current input (avoids loops)
    if (urlQuery !== searchInput) {
      setSearchInput(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* ------------------------------------------------------------------ */
  /*  Build URL params and push                                          */
  /* ------------------------------------------------------------------ */

  const updateURL = useCallback(
    (category: string | null, q: string) => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (q) params.set("q", q);
      const search = params.toString();
      router.push(`/products${search ? `?${search}` : ""}`, { scroll: false });
    },
    [router],
  );

  /* ------------------------------------------------------------------ */
  /*  Debounced search — 300ms                                            */
  /* ------------------------------------------------------------------ */

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateURL(activeCategory, value.trim());
    }, 300);
  };

  /* ------------------------------------------------------------------ */
  /*  Immediate submit on Enter                                           */
  /* ------------------------------------------------------------------ */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      updateURL(activeCategory, searchInput.trim());
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Cleanup debounce on unmount                                         */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                           */
  /* ------------------------------------------------------------------ */

  const handleCategoryClick = (slug: string | null) => {
    updateURL(slug, searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateURL(activeCategory, "");
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.push("/products");
  };

  const activeCategoryName = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory
    : null;

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div>
      {/* ── Search + Category Filters ────────────────────────────── */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input
            id="product-search"
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search lights..."
            className={cn(
              "w-full rounded-lg border border-[#e1dcd0] bg-[#fff] py-2.5 pl-10 pr-10",
              "text-sm text-[#111] placeholder:text-[#999]",
              "transition-colors",
              "focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]",
            )}
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "text-[#999] transition-colors hover:text-[#111]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
              )}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills — horizontal scrollable */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
          role="group"
          aria-label="Filter by category"
        >
          {/* "All" pill */}
          <button
            type="button"
            onClick={() => handleCategoryClick(null)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-1",
              !activeCategory
                ? "bg-[#c25b3e] text-white shadow-sm"
                : "bg-[#e1dcd0]/50 text-[#303e39] hover:bg-[#e1dcd0]",
            )}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryClick(cat.slug)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-1",
                activeCategory === cat.slug
                  ? "bg-[#c25b3e] text-white shadow-sm"
                  : "bg-[#e1dcd0]/50 text-[#303e39] hover:bg-[#e1dcd0]",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results summary ──────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#555]">
          Showing{" "}
          <span className="font-medium text-[#111]">{products.length}</span>{" "}
          {products.length === 1 ? "product" : "products"}
          {activeCategoryName && (
            <>
              {" "}
              in{" "}
              <span className="font-medium text-[#111]">
                {activeCategoryName}
              </span>
            </>
          )}
          {searchQuery && (
            <>
              {" "}
              for &ldquo;
              <span className="font-medium text-[#111]">{searchQuery}</span>
              &rdquo;
            </>
          )}
        </p>

        {(activeCategory || searchQuery) && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm text-[#c25b3e] transition-colors hover:text-[#a84d33]"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Product Grid or Empty State ──────────────────────────── */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e1dcd0]/40">
            <SlidersHorizontal className="h-7 w-7 text-[#999]" />
          </div>
          <h2 className="text-xl font-semibold text-[#111]">
            No products found
          </h2>
          <p className="mt-2 max-w-md text-[#555]">
            Try adjusting your search or filter
          </p>
          <button
            type="button"
            onClick={handleClearAll}
            className={cn(
              "mt-8 inline-flex items-center rounded-lg bg-[#c25b3e] px-6 py-3",
              "text-sm font-medium text-white shadow-sm transition-colors",
              "hover:bg-[#c25b3e]/90",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
            )}
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
}
