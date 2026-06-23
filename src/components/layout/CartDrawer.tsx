"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore, useCartUIStore, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal: storeSubtotal,
    itemCount,
  } = useCartStore();
  const { isOpen, closeCart } = useCartUIStore();

  const [mounted, setMounted] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveEmail, setSaveEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingDismissed, setSavingDismissed] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, items, savingDismissed]);

  function handleClose() {
    if (
      items.length > 0 &&
      !saved &&
      !savingDismissed
    ) {
      setShowSaveModal(true);
      return;
    }
    closeCart();
  }

  function handleDismissSave() {
    setSavingDismissed(true);
    setShowSaveModal(false);
    closeCart();
  }

  async function handleSaveCart() {
    if (!saveEmail.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/save-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: saveEmail, items }),
      });
      setSaved(true);
      setTimeout(() => {
        setShowSaveModal(false);
        closeCart();
      }, 1500);
    } catch {
      // Silently handle — save is optional
    } finally {
      setSaving(false);
    }
  }

  const subtotal = mounted ? storeSubtotal : 0;
  const count = mounted ? itemCount : 0;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-white shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e1dcd0]/50 px-5 py-4">
          <h2 className="font-[Jost] text-lg font-semibold text-[#111]">
            Your Cart{count > 0 && <span> ({count} items)</span>}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              "rounded-md p-1.5 text-[#555] transition-colors",
              "hover:bg-[#f5f3f0] hover:text-[#111]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
            )}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <ShoppingBag className="h-16 w-16 text-[#e1dcd0]" />
            <p className="text-lg font-medium text-[#555]">
              Your cart is empty
            </p>
            <p className="text-sm text-[#999]">
              Discover handcrafted lighting from Sonoma, California.
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className={cn(
                "mt-2 inline-flex items-center rounded-md bg-[#303e39] px-6 py-2.5 text-sm font-medium text-white transition-colors",
                "hover:bg-[#303e39]/90",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
              )}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-[#e1dcd0]/50 px-5 py-4">
              {hasFreeShipping ? (
                <p className="flex items-center gap-2 text-sm font-medium text-[#303e39]">
                  <span
                    className="inline-block h-5 w-5 rounded-full bg-[#303e39] text-center text-[11px] leading-5 text-white"
                    aria-hidden="true"
                  >
                    &#10003;
                  </span>
                  You&apos;ve earned free shipping!
                </p>
              ) : (
                <div>
                  <p className="mb-2 text-sm text-[#555]">
                    Add{" "}
                    <strong className="text-[#111]">
                      {formatPrice(remaining)}
                    </strong>{" "}
                    more for free shipping
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#e1dcd0]/50">
                    <div
                      className="h-full rounded-full bg-[#303e39] transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart items */}
            <ul className="flex-1 overflow-y-auto divide-y divide-[#e1dcd0]/30 px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  {/* Product image */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-[#f5f3f0]"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  {/* Product details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="block truncate text-sm font-medium text-[#111] hover:text-[#c25b3e]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-[#555]">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center rounded border border-[#e1dcd0]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className={cn(
                            "p-1.5 text-[#555] transition-colors hover:text-[#111]",
                            "disabled:cursor-not-allowed disabled:opacity-30",
                          )}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium text-[#111]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 text-[#555] transition-colors hover:text-[#111]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded p-1 text-[#999] transition-colors hover:text-[#c25b3e]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-[#e1dcd0]/50 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-[#111]">
                <span className="text-base font-medium">Subtotal</span>
                <span className="text-lg font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-[#999]">
                Shipping and taxes calculated at checkout.
              </p>

              <Link
                href="/cart"
                onClick={closeCart}
                className={cn(
                  "flex w-full items-center justify-center rounded-md bg-[#303e39] px-6 py-3 text-sm font-medium text-white transition-colors",
                  "hover:bg-[#303e39]/90",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
                )}
              >
                Checkout
              </Link>

              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "flex w-full items-center justify-center rounded-md border border-[#e1dcd0] bg-white px-6 py-3 text-sm font-medium text-[#555] transition-colors",
                  "hover:bg-[#f5f3f0] hover:text-[#111]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
                )}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      {/* Save Cart Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleDismissSave}
          />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={handleDismissSave}
              className="absolute right-4 top-4 rounded p-1 text-[#999] hover:text-[#111]"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>

            {saved ? (
              <div className="py-4 text-center">
                <p className="text-base font-medium text-[#303e39]">
                  Cart saved!
                </p>
                <p className="mt-1 text-sm text-[#555]">
                  We&apos;ll send you a reminder.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-[Jost] text-lg font-semibold text-[#111]">
                  Save your cart?
                </h3>
                <p className="mt-1 text-sm text-[#555]">
                  Enter your email and we&apos;ll send you a link to come back
                  to your selections.
                </p>
                <input
                  type="email"
                  value={saveEmail}
                  onChange={(e) => setSaveEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={cn(
                    "mt-4 w-full rounded-md border border-[#e1dcd0] px-3 py-2.5 text-sm text-[#111]",
                    "placeholder:text-[#999]",
                    "focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]",
                  )}
                />
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleDismissSave}
                    className={cn(
                      "flex-1 rounded-md border border-[#e1dcd0] bg-white px-4 py-2.5 text-sm font-medium text-[#555] transition-colors",
                      "hover:bg-[#f5f3f0]",
                    )}
                  >
                    No thanks
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCart}
                    disabled={!saveEmail.trim() || saving}
                    className={cn(
                      "flex flex-1 items-center justify-center rounded-md bg-[#303e39] px-4 py-2.5 text-sm font-medium text-white transition-colors",
                      "hover:bg-[#303e39]/90",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
