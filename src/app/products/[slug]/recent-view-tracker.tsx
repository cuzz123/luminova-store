"use client";

import { useEffect } from "react";
import { addRecentView } from "@/components/product/RecentViews";
import type { Product } from "@/lib/products";

interface RecentViewTrackerProps {
  product: Product;
}

export default function RecentViewTracker({ product }: RecentViewTrackerProps) {
  useEffect(() => {
    addRecentView({
      id: product.id,
      name: product.name,
      slug: product.slug,
      images: product.images,
      price: product.price,
    });
  }, [product]);

  return null;
}
