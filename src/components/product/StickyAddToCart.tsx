"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart";
import type { Product } from "@/lib/products";

interface StickyAddToCartProps {
  product: Product;
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the sentinel (positioned after product image) is NOT intersecting
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function handleAddToCart() {
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
    <>
      {/* Sentinel element placed after the product image in the parent */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {/* Sticky bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#e1dcd0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]",
          "transition-transform duration-300",
          "lg:hidden", // mobile only
          isVisible ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!isVisible}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {/* Product thumbnail */}
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-[#f5f3f0]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>

          {/* Product name + price */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#111]">
              {product.name}
            </p>
            <p className="text-sm font-semibold text-[#111]">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "flex-shrink-0 rounded-md px-5 py-2.5 text-sm font-medium text-white transition-colors",
              "bg-[#303e39] hover:bg-[#303e39]/90 active:bg-[#303e39]/80",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
            )}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
