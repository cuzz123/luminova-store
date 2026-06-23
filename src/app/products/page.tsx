import type { Metadata } from "next";
import { Suspense } from "react";
import { PRODUCTS, CATEGORIES, searchProducts } from "@/lib/products";
import ProductsContent from "@/components/product/ProductsContent";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";

export const metadata: Metadata = {
  title: "Shop Handcrafted Lighting — Flint & Beam",
  description:
    "Browse our collection of handcrafted lighting — pendant lights, table lamps, floor lamps, wall sconces, chandeliers, and outdoor lighting. Designed and crafted in Sonoma, California.",
  openGraph: {
    title: "Shop Handcrafted Lighting — Flint & Beam",
    description:
      "Browse our collection of handcrafted lighting — pendant lights, table lamps, floor lamps, wall sconces, chandeliers, and outdoor lighting.",
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const { category, q } = params;

  let filtered = PRODUCTS;

  // Apply text search if query is present
  if (q) {
    filtered = searchProducts(q);
  }

  // Apply category filter on top of search results
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  return (
    <div className="min-h-screen bg-[#fff]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Suspense fallback={<ProductGridSkeleton count={9} />}>
          <ProductsContent
            products={filtered}
            categories={CATEGORIES}
            activeCategory={category || null}
            searchQuery={q || ""}
          />
        </Suspense>
      </div>
    </div>
  );
}
