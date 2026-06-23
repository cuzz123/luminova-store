"use client";

import { useState } from "react";
import { Minus, Plus, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import type { Product } from "@/lib/products";

interface AddToCartFormProps {
  product: Product;
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      quantity,
    });
    toast.success(`${product.name} added to cart`);
  }

  function handleToggleWishlist() {
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
    });
    toast.success(
      isWishlisted
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`,
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Quantity selector */}
      <div className="flex items-center self-start rounded-md border border-[#e1dcd0]">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-l-md transition-colors",
            "text-[#555] hover:text-[#111] hover:bg-[#f5f3f0]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c25b3e]",
            "disabled:opacity-40 disabled:pointer-events-none",
          )}
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-11 w-12 items-center justify-center border-x border-[#e1dcd0] text-sm font-medium text-[#111]">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-r-md transition-colors",
            "text-[#555] hover:text-[#111] hover:bg-[#f5f3f0]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c25b3e]",
          )}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to Cart button — large, accent, full-width on mobile */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={cn(
          "flex-1 rounded-md px-6 py-3 text-sm font-medium text-white transition-colors shadow-sm",
          "bg-[#c25b3e] hover:bg-[#c25b3e]/90 active:bg-[#c25b3e]/80",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
          "w-full sm:w-auto",
        )}
      >
        Add to Cart
      </button>

      {/* Wishlist toggle */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        className={cn(
          "flex h-11 w-11 items-center justify-center self-start rounded-md border transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
          isWishlisted
            ? "border-[#c25b3e] text-[#c25b3e] bg-[#c25b3e]/5"
            : "border-[#e1dcd0] text-[#555] hover:text-[#c25b3e] hover:border-[#c25b3e]",
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn("h-5 w-5", isWishlisted && "fill-[#c25b3e]")}
        />
      </button>
    </div>
  );
}
