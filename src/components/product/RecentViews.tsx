"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/products";

const STORAGE_KEY = "flintbeam-recent-views";
const MAX_ITEMS = 6;

interface RecentProduct extends Pick<Product, "id" | "name" | "slug" | "images" | "price"> {}

export function addRecentView(product: RecentProduct) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items: RecentProduct[] = stored ? JSON.parse(stored) : [];
    // Remove existing entry for this product if present
    const filtered = items.filter((item) => item.id !== product.id);
    // Add to front
    const updated = [{ ...product }, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently ignore localStorage errors
  }
}

export function getRecentViews(): RecentProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function RecentViews() {
  const [items, setItems] = useState<RecentProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getRecentViews());
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#e1dcd0]/50 pt-12" aria-label="Recently viewed products">
      <h2 className="font-[Jost] text-xl font-semibold text-[#111]">
        Recently Viewed
      </h2>

      {/* Horizontal scrollable row */}
      <div className="mt-6">
        <div
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          role="list"
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className={cn(
                "group flex w-[180px] flex-shrink-0 flex-col snap-start",
              )}
              role="listitem"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#f5f3f0]">
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  sizes="180px"
                  className={cn(
                    "object-cover transition-transform duration-500",
                    "group-hover:scale-[1.03]",
                  )}
                />
              </div>

              {/* Info */}
              <div className="mt-2">
                <h3 className="truncate text-sm font-medium text-[#111] transition-colors group-hover:text-[#c25b3e]">
                  {item.name}
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-[#111]">
                  {formatPrice(item.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
