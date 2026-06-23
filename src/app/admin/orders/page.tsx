import { Suspense } from "react";
import { db } from "@/lib/db";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Filter,
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
} from "lucide-react";
import { OrdersTableClient } from "./orders-client";

export const dynamic = "force-dynamic";

// Revalidate every 30 seconds to keep orders fresh
export const revalidate = 30;

export type AdminOrder = {
  id: string;
  userId: string | null;
  email: string | null;
  status: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: string;
  trackingNumber: string | null;
  notes: string | null;
  paypalOrderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image: string;
    };
  }[];
};

async function fetchOrders(): Promise<AdminOrder[]> {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Parse shippingAddress JSON strings into objects
    return orders.map((order) => ({
      ...order,
      shippingAddress: order.shippingAddress,
      total: order.total,
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: order.discount,
    })) as AdminOrder[];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await fetchOrders();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111]">
            Orders
          </h2>
          <p className="mt-1 text-sm text-[#555]">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-[#c25b3e]" />
          </div>
        }
      >
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#e1dcd0]/40 bg-white py-16">
            <PackageOpen className="mb-3 h-12 w-12 text-[#ccc]" />
            <p className="text-sm font-medium text-[#555]">No orders yet</p>
            <p className="mt-1 text-xs text-[#999]">
              Orders will appear here once customers make purchases.
            </p>
          </div>
        ) : (
          <OrdersTableClient orders={orders} />
        )}
      </Suspense>
    </div>
  );
}
