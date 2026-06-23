"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/wishlist";
import { useCartStore } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import {
  Heart,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------ */
/*  Wishlist Page                                                      */
/* ------------------------------------------------------------------ */

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = useCallback(
    (item: { id: string; name: string; slug: string; image: string; price: number }) => {
      addItem({
        id: item.id,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        quantity: 1,
      });
      toast.success(`${item.name} added to cart`);
    },
    [addItem],
  );

  const handleRemove = useCallback(
    (id: string, name: string) => {
      removeItem(id);
      toast.success(`${name} removed from wishlist`);
    },
    [removeItem],
  );

  const handleMoveAllToCart = useCallback(() => {
    if (items.length === 0) return;
    items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        quantity: 1,
      });
    });
    toast.success(`${items.length} item${items.length === 1 ? "" : "s"} added to cart`);
  }, [items, addItem]);

  /* ================================================================ */
  /*  Empty State                                                      */
  /* ================================================================ */
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <Heart className="w-20 h-20 mx-auto mb-6 text-[#e1dcd0]" />
          <h1 className="text-2xl font-medium mb-3 text-[#111]">
            Your wishlist is empty
          </h1>
          <p className="text-[#555] mb-8 leading-relaxed">
            Save your favorite pieces here and come back to them anytime.
          </p>
          <Button variant="primary" size="lg" href="/products">
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Main Render                                                      */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-[#fff]">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-medium text-[#111] mb-1">
              Your Wishlist
            </h1>
            <p className="text-[#555]">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {/* Move all to cart */}
          <button
            type="button"
            onClick={handleMoveAllToCart}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white bg-[#303e39] hover:bg-[#303e39]/90 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Add all to cart
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-[#555] hover:text-[#c25b3e] transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wishlist Card                                                      */
/* ------------------------------------------------------------------ */

function WishlistCard({
  item,
  onAddToCart,
  onRemove,
}: {
  item: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
  };
  onAddToCart: (item: { id: string; name: string; slug: string; image: string; price: number }) => void;
  onRemove: (id: string, name: string) => void;
}) {
  return (
    <div className="group border border-[#ebebeb] rounded-lg overflow-hidden bg-white hover:shadow-sm transition-shadow">
      {/* Product image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative block aspect-[4/5] bg-[#f5f3f0] overflow-hidden"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <Link href={`/products/${item.slug}`}>
          <h3 className="text-sm font-medium text-[#111] hover:text-[#c25b3e] transition-colors line-clamp-2">
            {item.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-sm font-semibold text-[#111]">
          {formatPrice(item.price)}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </Button>
          <button
            type="button"
            onClick={() => onRemove(item.id, item.name)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#ebebeb] text-[#999] hover:text-[#c25b3e] hover:border-[#c25b3e]/30 transition-colors"
            aria-label={`Remove ${item.name} from wishlist`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
