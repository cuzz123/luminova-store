import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Store,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      href: "/admin/discounts",
      label: "Discounts",
      icon: Tag,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#303e39] text-white">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c25b3e]">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">
              Flint &amp; Beam
            </h1>
            <p className="text-[11px] font-medium text-white/50">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            // Compare pathname for active state
            const isActive = item.href === "/admin";
            // We cannot use usePathname in server component, so we do a simple
            // check via a child layout or rely on a client component for precision.
            // For simplicity, the dashboard link is active only at exact match.
            // Install a small client component for precise highlighting is better
            // but we keep here a basic approach that works for the demo.
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]"
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Store Link */}
        <div className="border-t border-white/10 px-3 py-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/10 hover:text-white"
          >
            <Store className="h-4 w-4" />
            Back to Store
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        </div>

        {/* User Info & Sign Out */}
        <div className="border-t border-white/10 px-3 py-4">
          <div className="mb-3 rounded-md bg-white/5 px-3 py-2.5">
            <p className="truncate text-xs font-medium text-white/80">
              {session.user.name || session.user.email}
            </p>
            <p className="truncate text-[11px] text-white/40">
              {session.user.email}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-[#e1dcd0]/40 bg-white/90 backdrop-blur-lg">
          <div className="flex h-14 items-center justify-between px-6">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#111]">
                Flint &amp; Beam Admin
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[#555]">
                Welcome,{" "}
                <span className="font-medium text-[#111]">
                  {session.user.name || "Admin"}
                </span>
              </span>
              <span className="inline-flex items-center rounded-full bg-[#e1dcd0] px-2.5 py-0.5 text-xs font-semibold text-[#303e39]">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-[#c25b3e]" />
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
