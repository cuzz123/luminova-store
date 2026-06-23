"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart";
import { formatPrice, formatDate } from "@/lib/utils";
import { Check, Package, ArrowRight, Truck } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Inner component (uses useSearchParams)                             */
/* ------------------------------------------------------------------ */

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((s) => s.clearCart);
  const [animated, setAnimated] = useState(false);
  const [order, setOrder] = useState<{
    id: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    shipping: {
      name: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    total: number;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear cart on mount
    clearCart();
    // Trigger checkmark animation
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [clearCart]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--dark)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1
          className="text-2xl font-medium mb-3"
          style={{ color: "var(--heading)" }}
        >
          No Order Found
        </h1>
        <p className="mb-8" style={{ color: "var(--body)" }}>
          We couldn't find an order to display. Please check your order number
          or contact support.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const displayItems =
    order?.items ||
    [];

  const displayTotal =
    order?.total ||
    0;

  const displayShipping = order?.shipping;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto px-4 py-16 lg:py-24 text-center">
        {/* Checkmark animation */}
        <div className="mb-8">
          <div
            className={cn(
              "w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-500",
              animated
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0",
            )}
            style={{ backgroundColor: "#16a34a" }}
          >
            <Check
              className="w-10 h-10 text-white"
              style={{
                strokeWidth: 2.5,
              }}
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-3xl lg:text-4xl font-medium mb-3"
          style={{ color: "var(--heading)" }}
        >
          Order Confirmed!
        </h1>
        <p className="mb-2" style={{ color: "var(--body)" }}>
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <p
          className="text-sm font-medium mb-10"
          style={{ color: "var(--heading)" }}
        >
          Order #{orderId}
        </p>

        {/* Order details */}
        <div
          className="text-left rounded-xl border p-6 mb-8 space-y-4"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="font-medium text-lg"
            style={{ color: "var(--heading)" }}
          >
            Order Details
          </h2>

          {/* Items */}
          <div className="space-y-3">
            {displayItems.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm pb-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <p style={{ color: "var(--heading)" }}>{item.name}</p>
                  <p style={{ color: "var(--body)" }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ color: "var(--heading)" }}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          {displayShipping && (
            <div className="pt-2">
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--heading)" }}
              >
                Shipping Address
              </p>
              <p className="text-sm" style={{ color: "var(--body)" }}>
                {displayShipping.name}
                <br />
                {displayShipping.street}
                <br />
                {displayShipping.city}, {displayShipping.state}{" "}
                {displayShipping.zip}
                <br />
                {displayShipping.country}
              </p>
            </div>
          )}

          {/* Total */}
          <div
            className="flex justify-between font-medium text-lg pt-3 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <span style={{ color: "var(--heading)" }}>Total</span>
            <span style={{ color: "var(--heading)" }}>
              {formatPrice(displayTotal)}
            </span>
          </div>
        </div>

        {/* Crafting notice */}
        <div
          className="rounded-lg p-5 mb-10 flex items-start gap-3 text-left"
          style={{ backgroundColor: "var(--sand)" }}
        >
          <Package
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            style={{ color: "var(--dark)" }}
          />
          <p className="text-sm" style={{ color: "var(--body)" }}>
            Each piece is handcrafted in our Sonoma workshop. You'll receive a
            tracking number once your order ships (typically 5-7 business days).
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--dark)" }}
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-colors border hover:bg-gray-50"
            style={{
              color: "var(--heading)",
              borderColor: "var(--border)",
            }}
          >
            <Truck className="w-4 h-4" />
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  cn helper                                                          */
/* ------------------------------------------------------------------ */

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  Page export (wrapped in Suspense)                                  */
/* ------------------------------------------------------------------ */

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: "var(--dark)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
