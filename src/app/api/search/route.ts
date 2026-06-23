import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json([], {
        status: 200,
        headers: { "Cache-Control": "public, max-age=60" },
      });
    }

    const searchTerm = query.toLowerCase();

    // Score products by relevance
    const scored = PRODUCTS.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const description = (product.description || "").toLowerCase();
      const category = (product.category || "").toLowerCase();
      const tags = (product.tags || []).map((t: string) => t.toLowerCase());

      return (
        name.includes(searchTerm) ||
        description.includes(searchTerm) ||
        category.includes(searchTerm) ||
        tags.some((tag: string) => tag.includes(searchTerm))
      );
    }).map((product) => {
      const name = (product.name || "").toLowerCase();
      const description = (product.description || "").toLowerCase();
      const category = (product.category || "").toLowerCase();

      let score = 0;

      // Exact name match ranks highest
      if (name === searchTerm) score += 100;
      // Name starts with query
      else if (name.startsWith(searchTerm)) score += 50;
      // Name contains query
      else if (name.includes(searchTerm)) score += 30;

      // Category exact match
      if (category === searchTerm) score += 20;
      // Category contains
      else if (category.includes(searchTerm)) score += 10;

      // Tag match
      const tags = product.tags || [];
      for (const tag of tags) {
        if ((tag as string).toLowerCase() === searchTerm) {
          score += 15;
          break;
        }
      }

      // Description contains
      if (description.includes(searchTerm)) score += 5;

      // Boost bestsellers and highly rated
      if (product.bestseller) score += 10;
      if (product.rating && product.rating >= 4.5) score += 5;

      return { product, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Limit to 10 results
    const results = scored.slice(0, 10).map((item) => item.product);

    return NextResponse.json(results, {
      status: 200,
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during search" },
      { status: 500 }
    );
  }
}
