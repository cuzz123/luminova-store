"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useWishlistStore } from "@/lib/wishlist";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  Heart,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface OrderSummary {
  id: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

interface AccountContentProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AccountContent({ user }: AccountContentProps) {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.count);

  useEffect(() => {
    // Fetch order history
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoadingOrders(false);
      })
      .catch(() => {
        setLoadingOrders(false);
      });
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
    PENDING: { color: "#d4a85c", bg: "rgba(212,168,92,0.1)" },
    PAID: { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    SHIPPED: { color: "#303e39", bg: "rgba(48,62,57,0.1)" },
    DELIVERED: { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  };

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <section>
        <h2
          className="text-lg font-medium mb-4"
          style={{ color: "var(--heading)" }}
        >
          Profile
        </h2>
        <div
          className="rounded-xl border p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: "var(--body)" }}
              >
                Name
              </p>
              <p
                className="font-medium"
                style={{ color: "var(--heading)" }}
              >
                {user.name || "Not set"}
              </p>
            </div>
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: "var(--body)" }}
              >
                Email
              </p>
              <p
                className="font-medium"
                style={{ color: "var(--heading)" }}
              >
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/wishlist"
          className="rounded-xl border p-5 flex items-center gap-4 transition-colors hover:bg-gray-50"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--sand)" }}
          >
            <Heart
              className="w-5 h-5"
              style={{ color: "var(--accent)" }}
            />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--heading)" }}
            >
              Wishlist
            </p>
            <p className="text-sm" style={{ color: "var(--body)" }}>
              {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
            </p>
          </div>
        </Link>

        <Link
          href="/products"
          className="rounded-xl border p-5 flex items-center gap-4 transition-colors hover:bg-gray-50"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--sand)" }}
          >
            <ShoppingBag
              className="w-5 h-5"
              style={{ color: "var(--dark)" }}
            />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--heading)" }}
            >
              Shop
            </p>
            <p className="text-sm" style={{ color: "var(--body)" }}>
              Browse products
            </p>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="rounded-xl border p-5 flex items-center gap-4 transition-colors hover:bg-gray-50 text-left"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--sand)" }}
          >
            {signingOut ? (
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: "var(--body)" }}
              />
            ) : (
              <LogOut
                className="w-5 h-5"
                style={{ color: "var(--body)" }}
              />
            )}
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--heading)" }}
            >
              Sign Out
            </p>
            <p className="text-sm" style={{ color: "var(--body)" }}>
              {signingOut ? "Signing out..." : "Leave your account"}
            </p>
          </div>
        </button>
      </section>

      {/* Order History */}
      <section>
        <h2
          className="text-lg font-medium mb-4"
          style={{ color: "var(--heading)" }}
        >
          Order History
        </h2>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "var(--body)" }}
            />
          </div>
        ) : orders.length === 0 ? (
          <div
            className="rounded-xl border p-12 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <Package
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--border)" }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "var(--heading)" }}
            >
              No orders yet
            </h3>
            <p className="mb-6" style={{ color: "var(--body)" }}>
              You haven't placed any orders. Start exploring our handcrafted
              lighting.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Table header */}
            <div
              className="hidden sm:grid grid-cols-5 gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider"
              style={{
                backgroundColor: "var(--sand)",
                color: "var(--body)",
              }}
            >
              <div>Date</div>
              <div>Order #</div>
              <div>Status</div>
              <div>Total</div>
              <div className="text-right">Action</div>
            </div>

            {/* Table rows */}
            {orders.map((order) => {
              const statusStyle = STATUS_STYLES[order.status] || {
                color: "var(--body)",
                bg: "var(--sand)",
              };
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 px-6 py-4 border-t items-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex justify-between sm:block">
                    <span className="sm:hidden text-xs font-medium" style={{ color: "var(--body)" }}>Date</span>
                    <span className="text-sm" style={{ color: "var(--heading)" }}>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="sm:hidden text-xs font-medium" style={{ color: "var(--body)" }}>Order #</span>
                    <span className="text-sm font-medium" style={{ color: "var(--heading)" }}>
                      #{order.id}
                    </span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="sm:hidden text-xs font-medium" style={{ color: "var(--body)" }}>Status</span>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="sm:hidden text-xs font-medium" style={{ color: "var(--body)" }}>Total</span>
                    <span className="text-sm" style={{ color: "var(--heading)" }}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="text-right">
                    <Link
                      href={`/track-order?orderId=${order.id}`}
                      className="text-sm font-medium hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      Track
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
