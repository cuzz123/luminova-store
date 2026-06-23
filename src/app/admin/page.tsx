import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  ArrowUpRight,
  PackageOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  href,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  href?: string;
}) {
  const content = (
    <div className="group relative rounded-xl border border-[#e1dcd0]/40 bg-white p-5 transition-all hover:border-[#c25b3e]/30 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#999]">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-[#111]">
            {value}
          </p>
          {trend && (
            <p className="flex items-center gap-1 text-xs font-medium text-[#555]">
              <TrendingUp className="h-3 w-3 text-[#c25b3e]" />
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f5f3f0]">
          <Icon className="h-5 w-5 text-[#303e39]" />
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]"
          aria-label={`View ${title}`}
        />
      )}
    </div>
  );

  if (!href) return content;

  return content;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SHIPPED: "bg-sky-50 text-sky-700 border-sky-200",
    DELIVERED: "bg-gray-50 text-gray-600 border-gray-200",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        styles[status] || styles.PENDING,
      )}
    >
      {status}
    </span>
  );
}

export default async function AdminDashboardPage() {
  // Fetch stats from DB
  const [
    totalOrders,
    totalRevenue,
    activeDiscounts,
    recentOrders,
  ] = await Promise.all([
    db.order.count(),
    db.order.aggregate({
      _sum: { total: true },
    }),
    db.discountCode.count({
      where: { isActive: true },
    }),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  // New customers this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newCustomers = await db.user.count({
    where: {
      createdAt: { gte: startOfMonth },
    },
  });

  const stats = [
    {
      title: "Total Orders",
      value: String(totalOrders),
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue._sum.total || 0),
      icon: DollarSign,
    },
    {
      title: "Total Products",
      value: String(PRODUCTS.length),
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Active Discounts",
      value: String(activeDiscounts),
      icon: Tag,
      href: "/admin/discounts",
    },
    {
      title: "New Customers",
      value: String(newCustomers),
      icon: Users,
      trend: "This month",
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Heading */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#111]">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-[#555]">
          Overview of your store performance and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-xl border border-[#e1dcd0]/40 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#111]">
                Recent Orders
              </h3>
              <p className="text-xs text-[#999]">
                The last {recentOrders.length} orders placed in your store.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-[#c25b3e] transition-colors hover:bg-[#c25b3e]/5"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PackageOpen className="mb-3 h-10 w-10 text-[#ccc]" />
              <p className="text-sm font-medium text-[#555]">No orders yet</p>
              <p className="mt-1 text-xs text-[#999]">
                Orders will appear here once customers start purchasing.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e1dcd0]/50 text-xs font-semibold uppercase tracking-wider text-[#999]">
                    <th className="pb-3 pr-4 font-medium">Order</th>
                    <th className="pb-3 pr-4 font-medium">Customer</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Total</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">&nbsp;</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1dcd0]/30">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-[#f5f3f0]/60"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs font-medium text-[#555]">
                          #{order.id.slice(-8)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-sm font-medium text-[#111]">
                          {order.email || "Guest"}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm font-semibold text-[#111]">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs text-[#999]">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <Link
                          href={`/admin/orders#${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#c25b3e] hover:underline"
                        >
                          View
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-[#e1dcd0]/40 bg-white p-5">
          <h3 className="mb-4 text-base font-semibold text-[#111]">
            Quick Links
          </h3>
          <div className="space-y-2">
            <Link
              href="/admin/products"
              className="flex items-center justify-between rounded-lg border border-[#e1dcd0]/30 bg-[#fafaf8] px-4 py-3 text-sm font-medium text-[#111] transition-all hover:border-[#c25b3e]/30 hover:bg-[#f5f3f0]"
            >
              <span className="flex items-center gap-3">
                <Package className="h-4 w-4 text-[#c25b3e]" />
                Manage Products
              </span>
              <ArrowRight className="h-4 w-4 text-[#999]" />
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center justify-between rounded-lg border border-[#e1dcd0]/30 bg-[#fafaf8] px-4 py-3 text-sm font-medium text-[#111] transition-all hover:border-[#c25b3e]/30 hover:bg-[#f5f3f0]"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-[#c25b3e]" />
                View Orders
              </span>
              <ArrowRight className="h-4 w-4 text-[#999]" />
            </Link>
            <Link
              href="/admin/discounts"
              className="flex items-center justify-between rounded-lg border border-[#e1dcd0]/30 bg-[#fafaf8] px-4 py-3 text-sm font-medium text-[#111] transition-all hover:border-[#c25b3e]/30 hover:bg-[#f5f3f0]"
            >
              <span className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-[#c25b3e]" />
                Discount Codes
              </span>
              <ArrowRight className="h-4 w-4 text-[#999]" />
            </Link>
          </div>

          {/* Storefront Link */}
          <div className="mt-6 rounded-lg bg-[#f5f3f0] p-4">
            <p className="text-xs font-medium text-[#555]">
              View your storefront
            </p>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-2 text-sm font-semibold text-[#c25b3e] hover:underline"
            >
              Open Store
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
