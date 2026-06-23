"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import toast from "react-hot-toast";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className={cn("group relative", className)}>
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-[#f5f3f0]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500",
            "group-hover:scale-[1.03]",
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Image loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#e1dcd0]/50" />
        )}

        {/* Badges */}
        {(product.isBestSeller || product.isNew) && (
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {product.isBestSeller && (
              <span className="inline-block rounded bg-[#c25b3e] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="inline-block rounded bg-[#303e39] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            )}
          </div>
        )}

        {/* Quick add button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className={cn(
            "absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center",
            "rounded-full bg-white shadow-md text-[#111] transition-all duration-200",
            "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            "hover:bg-[#303e39] hover:text-white",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
          )}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </Link>

      {/* Info */}
      <div className="mt-3">
        {/* Category tag */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#c25b3e]">
          {CATEGORIES.find((c) => c.slug === product.category)?.name ??
            product.category}
        </p>

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 block"
        >
          <h3 className="text-sm font-medium text-[#111] transition-colors hover:text-[#c25b3e] line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-[#111]">
            {formatPrice(product.price)}
          </span>
          {product.compareAt != null && (
            <span
              className="text-sm text-[#999] line-through"
              aria-label={`Original price ${formatPrice(product.compareAt)}`}
            >
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>

        {/* Star rating */}
        {product.rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex items-center gap-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.round(product.rating)
                      ? "fill-[#d4a85c] text-[#d4a85c]"
                      : "text-[#e1dcd0]",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-[#999]">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
