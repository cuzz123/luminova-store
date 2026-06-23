"use client";

import {
  useState,
  useMemo,
  useCallback,
  useTransition,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  ChevronDown,
  ChevronUp,
  PackageOpen,
  Loader2,
  Truck,
  MapPin,
  User,
  Mail,
  Calendar,
  CreditCard,
  Save,
  X,
  Check,
} from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import type { AdminOrder } from "./page";

const STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SHIPPED: "bg-sky-50 text-sky-700 border-sky-200",
  DELIVERED: "bg-gray-50 text-gray-600 border-gray-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        STATUS_STYLES[status] || STATUS_STYLES.PENDING,
      )}
    >
      {status}
    </span>
  );
}

function StatusSelect({
  orderId,
  currentStatus,
  onUpdate,
  disabled,
}: {
  orderId: string;
  currentStatus: string;
  onUpdate: (id: string, status: string) => void;
  disabled: boolean;
}) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onUpdate(orderId, e.target.value)}
      disabled={disabled}
      className={cn(
        "rounded-lg border px-2 py-1 text-[11px] font-semibold uppercase tracking-wider",
        "cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#c25b3e]",
        STATUS_STYLES[currentStatus] || STATUS_STYLES.PENDING,
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function TrackingInput({
  orderId,
  trackingNumber,
  onSave,
  disabled,
}: {
  orderId: string;
  trackingNumber: string | null;
  onSave: (id: string, tracking: string) => void;
  disabled: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(trackingNumber || "");

  useEffect(() => {
    setValue(trackingNumber || "");
  }, [trackingNumber]);

  const handleSave = () => {
    onSave(orderId, value.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(trackingNumber || "");
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
          trackingNumber
            ? "bg-sky-50 text-sky-700 hover:bg-sky-100"
            : "bg-[#f5f3f0] text-[#999] hover:bg-[#e1dcd0] hover:text-[#555]",
        )}
        title={trackingNumber || "Add tracking number"}
      >
        <Truck className="h-3 w-3" />
        {trackingNumber ? (
          <span className="max-w-24 truncate font-mono text-[10px]">
            {trackingNumber}
          </span>
        ) : (
          "Add tracking"
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tracking #"
        disabled={disabled}
        autoFocus
        className="w-28 rounded border border-[#e1dcd0] px-2 py-1 text-xs font-mono text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
      />
      <button
        onClick={handleSave}
        disabled={disabled}
        className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
        title="Save"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={handleCancel}
        disabled={disabled}
        className="rounded p-1 text-[#999] hover:bg-[#f5f3f0]"
        title="Cancel"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function OrderDetailRow({ order }: { order: AdminOrder }) {
  let shippingAddress: Record<string, string> = {};
  try {
    shippingAddress =
      typeof order.shippingAddress === "string"
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress;
  } catch {
    shippingAddress = {};
  }

  const addressStr = [
    shippingAddress.line1,
    shippingAddress.line2,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.postalCode,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="border-t border-[#e1dcd0]/30 bg-[#fafaf8]">
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Items */}
        <div className="sm:col-span-2">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#999]">
            Items ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-[#e1dcd0]/40 bg-white p-3"
              >
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#f5f3f0]">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <PackageOpen className="h-5 w-5 text-[#ccc]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#111]">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[#999]">
                    Qty: {item.quantity} &times; {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#111]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-3">
          {/* Paypal Order ID */}
          <div className="flex items-center gap-2 text-xs">
            <CreditCard className="h-3.5 w-3.5 text-[#999]" />
            <span className="text-[#999]">Payment:</span>
            <span className="font-mono font-medium text-[#555]">
              {order.paypalOrderId || "N/A"}
            </span>
          </div>

          {/* Shipping Address */}
          {addressStr && (
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#999]" />
              <span className="text-[#555]">{addressStr}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5 text-[#999]" />
            <span className="text-[#555]">
              {formatDate(order.createdAt)}
            </span>
          </div>

          {/* Totals */}
          <div className="rounded-lg border border-[#e1dcd0]/40 bg-white p-3 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-[#999]">Subtotal</span>
              <span className="font-medium text-[#555]">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-[#999]">Shipping</span>
              <span className="font-medium text-[#555]">
                {order.shipping > 0
                  ? formatPrice(order.shipping)
                  : "Free"}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between py-0.5">
                <span className="text-emerald-600">Discount</span>
                <span className="font-medium text-emerald-600">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}
            <div className="mt-1 flex justify-between border-t border-[#e1dcd0]/40 pt-1">
              <span className="font-semibold text-[#111]">Total</span>
              <span className="font-bold text-[#111]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-lg border border-[#e1dcd0]/40 bg-white p-3 text-xs">
              <p className="font-medium text-[#999]">Notes</p>
              <p className="mt-1 text-[#555]">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function OrdersTableClient({ orders: initialOrders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Filter by search and status
  const filtered = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.email && o.email.toLowerCase().includes(q)) ||
          o.items.some((item) =>
            item.product.name.toLowerCase().includes(q),
          ),
      );
    }

    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }

    return result;
  }, [orders, search, statusFilter]);

  // Update order status
  const updateStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      setUpdatingIds((prev) => new Set(prev).add(orderId));

      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o,
        ),
      );

      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error("Failed to update status");

        toast.success(`Order #${orderId.slice(-8)} updated to ${newStatus}`);
        startTransition(() => router.refresh());
      } catch {
        // Revert on error
        toast.error("Failed to update status. Please try again.");
        setOrders(initialOrders);
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(orderId);
          return next;
        });
      }
    },
    [router, initialOrders],
  );

  // Update tracking number
  const updateTracking = useCallback(
    async (orderId: string, trackingNumber: string) => {
      setUpdatingIds((prev) => new Set(prev).add(orderId));

      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, trackingNumber } : o,
        ),
      );

      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingNumber }),
        });

        if (!res.ok) throw new Error("Failed to update tracking");

        toast.success(
          trackingNumber
            ? "Tracking number saved"
            : "Tracking number removed",
        );
        startTransition(() => router.refresh());
      } catch {
        toast.error("Failed to save tracking number.");
        setOrders(initialOrders);
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(orderId);
          return next;
        });
      }
    },
    [router, initialOrders],
  );

  // Stats
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "0.5rem",
            background: "#fff",
            color: "#111",
            fontSize: "13px",
            border: "1px solid #e1dcd0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          },
          success: {
            iconTheme: { primary: "#303e39", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#c25b3e", secondary: "#fff" },
          },
        }}
      />

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
            !statusFilter
              ? "border-[#303e39] bg-[#303e39] text-white"
              : "border-[#e1dcd0] bg-white text-[#555] hover:border-[#c25b3e] hover:text-[#c25b3e]",
          )}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(statusFilter === status ? "" : status)
            }
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
              statusFilter === status
                ? "border-[#303e39] bg-[#303e39] text-white"
                : cn(
                    "bg-white",
                    STATUS_STYLES[status] || "border-[#e1dcd0] text-[#555]",
                  ),
            )}
          >
            {status}{" "}
            {statusCounts[status] !== undefined && (
              <span className="ml-1 opacity-70">({statusCounts[status]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
        <input
          type="text"
          placeholder="Search by order ID, email, or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#e1dcd0]/40 bg-white py-2.5 pl-10 pr-4 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
        />
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#e1dcd0]/40 bg-white py-16">
          <PackageOpen className="mb-3 h-12 w-12 text-[#ccc]" />
          <p className="text-sm font-medium text-[#555]">No orders match your filters</p>
          <p className="mt-1 text-xs text-[#999]">
            Try adjusting your search or status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e1dcd0]/40 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e1dcd0]/50 bg-[#fafaf8] text-xs font-semibold uppercase tracking-wider text-[#999]">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Tracking</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">&nbsp;</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1dcd0]/30">
                {filtered.map((order) => {
                  const isExpanded = expandedIds.has(order.id);
                  const itemCount = order.items.reduce(
                    (sum, i) => sum + i.quantity,
                    0,
                  );

                  return (
                    <tr
                      key={order.id}
                      id={order.id}
                      className={cn(
                        "transition-colors",
                        isExpanded
                          ? "bg-[#f5f3f0]/40"
                          : "hover:bg-[#f5f3f0]/60",
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-[#555]">
                          #{order.id.slice(-8)}
                        </span>
                        {order.paypalOrderId && (
                          <span className="ml-1.5 inline-flex items-center rounded bg-sky-50 px-1 py-0.5 text-[9px] font-medium text-sky-600">
                            PP
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-0 max-w-40">
                          <p className="truncate text-sm font-medium text-[#111]">
                            {/* Try to extract name from shipping address */}
                            {(() => {
                              try {
                                const addr =
                                  typeof order.shippingAddress === "string"
                                    ? JSON.parse(order.shippingAddress)
                                    : order.shippingAddress;
                                if (addr && typeof addr === "object" && "name" in addr) {
                                  return addr.name;
                                }
                              } catch {}
                              return order.email || "Guest";
                            })()}
                          </p>
                          <p className="truncate text-xs text-[#999]">
                            {order.email || "No email"}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm text-[#555]">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-[#111]">
                          {formatPrice(order.total)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <StatusSelect
                          orderId={order.id}
                          currentStatus={order.status}
                          onUpdate={updateStatus}
                          disabled={updatingIds.has(order.id)}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <TrackingInput
                          orderId={order.id}
                          trackingNumber={order.trackingNumber}
                          onSave={updateTracking}
                          disabled={updatingIds.has(order.id)}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs text-[#999]">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#555] transition-colors hover:bg-[#e1dcd0]/30"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              Details
                            </>
                          )}
                        </button>
                      </td>

                      {/* Expanded detail row (spans all columns) */}
                      {isExpanded && (
                        <td colSpan={8} className="p-0">
                          <OrderDetailRow order={order} />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
