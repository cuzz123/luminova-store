"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Truck, Package, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ORDER_STATUSES = [
  { key: "PENDING", label: "Pending", icon: Clock },
  { key: "PAID", label: "Paid", icon: CheckCircle },
  { key: "SHIPPED", label: "En Route", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Package },
];

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  PENDING: {
    color: "#d4a85c",
    bg: "rgba(212,168,92,0.1)",
    label: "Pending",
  },
  PAID: {
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
    label: "Paid — Crafting",
  },
  SHIPPED: {
    color: "#303e39",
    bg: "rgba(48,62,57,0.1)",
    label: "Shipped",
  },
  DELIVERED: {
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
    label: "Delivered",
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TrackOrderPage() {
  const { data: session } = useSession();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{
    id: string;
    status: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
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
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    createdAt: string;
    shippedAt?: string;
    deliveredAt?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleTrack = useCallback(async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    setNotFound(false);

    try {
      const res = await fetch(
        `/api/track-order?orderId=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`,
      );
      const data = await res.json();
      if (!res.ok || !data.order) {
        setNotFound(true);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderNumber, email]);

  const statusIndex = order
    ? ORDER_STATUSES.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-10 lg:py-16">
        <h1
          className="text-3xl lg:text-4xl font-medium mb-4 text-center"
          style={{ color: "var(--heading)" }}
        >
          Track Your Order
        </h1>
        <p className="text-center mb-10" style={{ color: "var(--body)" }}>
          Enter your order number and email to see your order status.
        </p>

        {/* Lookup form */}
        <div
          className="rounded-xl border p-6 lg:p-8 mb-10"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="orderNumber"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--heading)" }}
              >
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  setError("");
                  setNotFound(false);
                }}
                placeholder="e.g. FB-20260623-001"
                className="w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--heading)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTrack();
                }}
              />
            </div>
            <div>
              <label
                htmlFor="trackEmail"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--heading)" }}
              >
                Email Address
              </label>
              <input
                id="trackEmail"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setNotFound(false);
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--heading)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTrack();
                }}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleTrack}
            disabled={loading}
            className={cn(
              "w-full sm:w-auto px-8 py-3 rounded-md text-white font-medium transition-colors flex items-center justify-center gap-2",
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90",
            )}
            style={{ backgroundColor: "var(--dark)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Tracking...
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                Track Order
              </>
            )}
          </button>
        </div>

        {/* Not found */}
        {notFound && (
          <div
            className="rounded-xl border p-8 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <XCircle
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--body)", opacity: 0.5 }}
            />
            <h2
              className="text-xl font-medium mb-2"
              style={{ color: "var(--heading)" }}
            >
              Order Not Found
            </h2>
            <p style={{ color: "var(--body)" }}>
              We couldn't find an order matching that information. Please
              double-check your order number and email address, or{" "}
              <Link
                href="/contact"
                className="underline"
                style={{ color: "var(--accent)" }}
              >
                contact us
              </Link>{" "}
              for help.
            </p>
          </div>
        )}

        {/* Order found */}
        {order && (
          <div className="space-y-8 animate-fade-in">
            {/* Status progress bar */}
            <div
              className="rounded-xl border p-6 lg:p-8"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <p
                    className="text-sm mb-1"
                    style={{ color: "var(--body)" }}
                  >
                    Order #{order.id}
                  </p>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--heading)" }}
                  >
                    {STATUS_CONFIG[order.status]?.label || order.status}
                  </p>
                </div>
                <p className="text-sm" style={{ color: "var(--body)" }}>
                  Placed {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Progress bar */}
              <div className="relative">
                <div
                  className="absolute top-4 left-0 right-0 h-0.5 -translate-y-1/2"
                  style={{ backgroundColor: "var(--border)" }}
                />
                <div
                  className="absolute top-4 left-0 h-0.5 -translate-y-1/2 transition-all duration-500"
                  style={{
                    width: `${((statusIndex + 1) / ORDER_STATUSES.length) * 100}%`,
                    backgroundColor: "var(--dark)",
                  }}
                />
                <div className="relative flex justify-between">
                  {ORDER_STATUSES.map((status, i) => {
                    const isCompleted = i <= statusIndex;
                    const isCurrent = i === statusIndex;
                    return (
                      <div
                        key={status.key}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all relative z-10",
                            isCompleted
                              ? "text-white"
                              : "bg-gray-100 text-gray-400",
                          )}
                          style={{
                            backgroundColor: isCompleted
                              ? "var(--dark)"
                              : undefined,
                          }}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <status.icon className="w-4 h-4" />
                          )}
                        </div>
                        <span
                          className="text-xs mt-2 text-center"
                          style={{
                            color: isCurrent
                              ? "var(--heading)"
                              : "var(--body)",
                            fontWeight: isCurrent ? 500 : 400,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tracking info */}
            {order.trackingNumber && (
              <div
                className="rounded-xl border p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <h3
                  className="font-medium mb-3"
                  style={{ color: "var(--heading)" }}
                >
                  Shipment Details
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <p
                      className="text-sm mb-0.5"
                      style={{ color: "var(--body)" }}
                    >
                      Tracking Number
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: "var(--heading)" }}
                    >
                      {order.trackingNumber}
                    </p>
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <p
                        className="text-sm mb-0.5"
                        style={{ color: "var(--body)" }}
                      >
                        Estimated Delivery
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: "var(--heading)" }}
                      >
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                  {order.trackingUrl && (
                    <div className="sm:ml-auto">
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        <Truck className="w-4 h-4" />
                        Track Package
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order items */}
            <div
              className="rounded-xl border p-6"
              style={{ borderColor: "var(--border)" }}
            >
              <h3
                className="font-medium mb-4"
                style={{ color: "var(--heading)" }}
              >
                Items in Your Order
              </h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
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
              <div
                className="flex justify-between font-medium text-base mt-3 pt-3 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--heading)" }}>Total</span>
                <span style={{ color: "var(--heading)" }}>
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
