"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import { getBestSellers, CATEGORIES } from "@/lib/products";
import Button from "@/components/ui/Button";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Truck,
  ArrowRight,
  Check,
  Tag,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------ */
/*  Cart Page                                                          */
/* ------------------------------------------------------------------ */

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    removeItem,
    updateQuantity,
  } = useCartStore();

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [discountLabel, setDiscountLabel] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const freeShippingRemaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  /* -- Apply discount code ------------------------------------------ */
  const handleApplyDiscount = useCallback(async () => {
    if (!discountCode.trim()) return;
    setIsApplying(true);
    setDiscountError("");
    setDiscountLabel("");
    setDiscountAmount(0);

    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setDiscountError(data.message || "Invalid discount code");
      } else {
        const amount =
          data.type === "percentage"
            ? Math.round(subtotal * (data.amount / 100) * 100) / 100
            : data.amount;
        setDiscountAmount(amount);
        setDiscountLabel(data.code);
        toast.success("Discount applied!");
      }
    } catch {
      setDiscountError("Failed to validate discount code. Please try again.");
    } finally {
      setIsApplying(false);
    }
  }, [discountCode, subtotal]);

  /* -- Clear discount ------------------------------------------------ */
  const handleClearDiscount = useCallback(() => {
    setDiscountCode("");
    setDiscountAmount(0);
    setDiscountError("");
    setDiscountLabel("");
  }, []);

  /* -- Cross-sell: 4 random bestsellers ------------------------------ */
  const crossSellProducts = useMemo(() => {
    const bestsellers = getBestSellers(20);
    const shuffled = [...bestsellers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);

  /* -- Quantity handlers --------------------------------------------- */
  const handleDecrement = useCallback(
    (id: string, currentQty: number) => {
      if (currentQty <= 1) {
        removeItem(id);
        toast.success("Item removed from cart");
      } else {
        updateQuantity(id, currentQty - 1);
      }
    },
    [removeItem, updateQuantity],
  );

  const handleIncrement = useCallback(
    (id: string, currentQty: number) => {
      if (currentQty >= 99) {
        toast.error("Maximum quantity is 99 per item");
        return;
      }
      updateQuantity(id, currentQty + 1);
    },
    [updateQuantity],
  );

  const handleRemove = useCallback(
    (id: string, name: string) => {
      removeItem(id);
      toast.success(`${name} removed from cart`);
    },
    [removeItem],
  );

  /* ================================================================ */
  /*  Empty State                                                      */
  /* ================================================================ */
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-[#e1dcd0]" />
          <h1 className="text-2xl font-medium mb-3 text-[#111]">
            Your cart is empty
          </h1>
          <p className="text-[#555] mb-8 leading-relaxed">
            Looks like you haven&apos;t added anything yet. Browse our
            collection to find something you&apos;ll love.
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
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-medium text-[#111] mb-1">
            Your Cart
          </h1>
          <p className="text-[#555]">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ======================================================== */}
          {/*  Left: Cart Items                                         */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-6">
            {/* Desktop table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-[#ebebeb] text-xs font-semibold uppercase tracking-wider text-[#999]">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
              <div className="col-span-2" />
            </div>

            {/* Cart items */}
            {items.map((item) => {
              const categoryName =
                CATEGORIES.find(
                  (c) => c.slug === item.slug?.split("-").slice(0, -1).join("-"),
                )?.name ?? "";

              return (
                <div
                  key={item.id}
                  className={cn(
                    "sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center",
                    "py-4 border-b border-[#ebebeb]",
                    "flex flex-col gap-3 sm:flex-row",
                  )}
                >
                  {/* Product info — image + name */}
                  <div className="sm:col-span-5 flex gap-4 min-w-0">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative w-20 h-[100px] rounded-md overflow-hidden flex-shrink-0 bg-[#f5f3f0]"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>

                    {/* Name + category */}
                    <div className="flex flex-col justify-center min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-medium text-[#111] hover:text-[#c25b3e] transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {categoryName && (
                        <p className="text-xs text-[#999] mt-0.5">
                          {categoryName}
                        </p>
                      )}
                      <p className="text-sm font-medium text-[#111] mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="sm:col-span-2 flex items-center justify-start sm:justify-center gap-0">
                    <div className="flex items-center border border-[#ebebeb] rounded-md">
                      <button
                        type="button"
                        onClick={() => handleDecrement(item.id, item.quantity)}
                        className="w-9 h-9 flex items-center justify-center text-[#555] hover:text-[#111] hover:bg-[#f5f3f0] transition-colors rounded-l-md"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-[#111] border-x border-[#ebebeb]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(item.id, item.quantity)}
                        className="w-9 h-9 flex items-center justify-center text-[#555] hover:text-[#111] hover:bg-[#f5f3f0] transition-colors rounded-r-md"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-end">
                    <span className="sm:hidden text-xs text-[#999]">
                      Total
                    </span>
                    <span className="text-sm font-medium text-[#111]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove */}
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id, item.name)}
                      className="flex items-center gap-1 text-xs text-[#999] hover:text-[#c25b3e] transition-colors py-1"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping link */}
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm text-[#555] hover:text-[#c25b3e] transition-colors pt-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* ======================================================== */}
          {/*  Right: Order Summary                                     */}
          {/* ======================================================== */}
          <div className="lg:col-span-2">
            <div className="bg-[#fafaf8] rounded-lg p-6 space-y-6 sticky top-24">
              <h2 className="text-lg font-medium text-[#111]">
                Order Summary
              </h2>

              {/* Free Shipping Progress */}
              <div>
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#16a34a]">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[#16a34a] font-medium">
                      You&apos;ve earned free shipping!
                    </span>
                    <Truck className="w-4 h-4 text-[#16a34a]" />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[#555] mb-2">
                      You&apos;re{" "}
                      <span className="font-medium text-[#111]">
                        {formatPrice(freeShippingRemaining)}
                      </span>{" "}
                      away from free shipping
                    </p>
                    <div className="h-2 rounded-full bg-[#f5f3f0] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#d4a85c] transition-all duration-500"
                        style={{ width: `${shippingProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#999] mt-1.5">
                      Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                    </p>
                  </div>
                )}
              </div>

              {/* Discount Code */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Discount code"
                      disabled={!!discountLabel}
                      className={cn(
                        "w-full pl-9 pr-3 py-2.5 rounded-md border text-sm bg-white transition-colors",
                        discountLabel
                          ? "bg-[#f5f3f0] text-[#999] cursor-not-allowed"
                          : "border-[#ebebeb] focus:border-[#303e39]",
                      )}
                      style={{ color: "var(--heading)" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyDiscount();
                      }}
                    />
                  </div>
                  {discountLabel ? (
                    <button
                      type="button"
                      onClick={handleClearDiscount}
                      className="shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-md text-sm border border-[#c25b3e] text-[#c25b3e] hover:bg-[#c25b3e]/5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={isApplying || !discountCode.trim()}
                      className={cn(
                        "shrink-0 px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-white",
                        isApplying || !discountCode.trim()
                          ? "opacity-50 cursor-not-allowed bg-[#303e39]"
                          : "bg-[#303e39] hover:bg-[#303e39]/90",
                      )}
                    >
                      {isApplying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  )}
                </div>

                {/* Discount messages */}
                {discountError && (
                  <p className="text-[#c25b3e] text-xs mt-1.5">
                    {discountError}
                  </p>
                )}
                {discountLabel && discountAmount > 0 && (
                  <p className="text-[#16a34a] text-sm mt-2 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    &quot;{discountLabel}&quot; applied: -{formatPrice(discountAmount)}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-[#ebebeb]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Subtotal</span>
                  <span className="text-[#111] font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#16a34a]">Discount</span>
                    <span className="text-[#16a34a] font-medium">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Shipping</span>
                  <span className="text-[#111]">
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "Free"
                      : "Calculated at checkout"}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#ebebeb]">
                  <span className="text-[#111]">Total</span>
                  <span className="text-[#111]">
                    {formatPrice(Math.max(0, subtotal - discountAmount))}
                  </span>
                </div>
              </div>

              {/* Checkout button */}
              <Button variant="accent" size="lg" href="/checkout" className="w-full">
                Proceed to Checkout
              </Button>

              {/* Continue shopping */}
              <Link
                href="/products"
                className="flex items-center justify-center gap-1.5 text-sm text-[#555] hover:text-[#c25b3e] transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/*  Cross-sell: You May Also Like                              */}
        {/* ========================================================== */}
        {crossSellProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-medium text-[#111] mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {crossSellProducts.map((product) => (
                <CrossSellCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cross-sell Card (simpler inline card for cart page)               */
/* ------------------------------------------------------------------ */

function CrossSellCard({
  product,
}: {
  product: ReturnType<typeof getBestSellers>[number];
}) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [addItem, product],
  );

  return (
    <div className="group">
      <Link
        href={`/products/${product.slug}`}
        className="block aspect-[4/5] rounded-lg overflow-hidden bg-[#f5f3f0] relative mb-3"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Quick add overlay */}
        <button
          type="button"
          onClick={handleAdd}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-md text-[#111] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#303e39] hover:text-white"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </Link>

      <Link href={`/products/${product.slug}`}>
        <h3 className="text-sm font-medium text-[#111] hover:text-[#c25b3e] transition-colors line-clamp-2">
          {product.name}
        </h3>
      </Link>
      <p className="text-sm font-semibold text-[#111] mt-1">
        {formatPrice(product.price)}
      </p>
    </div>
  );
}
