"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import { CATEGORIES } from "@/lib/products";

interface HeaderProps {
  onSearchOpen?: () => void;
}

export default function Header({ onSearchOpen }: HeaderProps) {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.count);
  const { openCart } = useCartUIStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchClick = useCallback(() => {
    onSearchOpen?.();
  }, [onSearchOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[#e1dcd0]/30 transition-all duration-200",
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-lg"
          : "bg-white/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 select-none font-[Jost] text-xl font-semibold tracking-tight text-[#111]"
          aria-label="Flint &amp; Beam — Home"
        >
          Flint{" "}
          <span className="text-[#c25b3e]">&amp;</span>{" "}
          Beam
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-[#555] transition-colors",
                "hover:bg-[#f5f3f0] hover:text-[#111]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
              )}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden items-center gap-1 lg:flex">
          {/* Search */}
          <button
            type="button"
            onClick={handleSearchClick}
            className={cn(
              "rounded-md p-2 text-[#555] transition-colors",
              "hover:bg-[#f5f3f0] hover:text-[#111]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
            )}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Account */}
          <Link
            href={session ? "/account" : "/auth/signin"}
            className={cn(
              "rounded-md p-2 text-[#555] transition-colors",
              "hover:bg-[#f5f3f0] hover:text-[#111]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
            )}
            aria-label={session ? "My account" : "Sign in"}
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={cn(
              "relative rounded-md p-2 text-[#555] transition-colors",
              "hover:bg-[#f5f3f0] hover:text-[#111]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
            )}
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center",
                  "rounded-full bg-[#c25b3e] px-1 text-[10px] font-semibold leading-none text-white",
                  "pointer-events-none",
                )}
                aria-hidden="true"
              >
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            className={cn(
              "relative rounded-md p-2 text-[#555] transition-colors",
              "hover:bg-[#f5f3f0] hover:text-[#111]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
            )}
            aria-label={`Shopping cart (${itemCount} items)`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center",
                  "rounded-full bg-[#c25b3e] px-1 text-[10px] font-semibold leading-none text-white",
                  "pointer-events-none",
                )}
                aria-hidden="true"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className={cn(
            "rounded-md p-2 text-[#555] transition-colors lg:hidden",
            "hover:bg-[#f5f3f0] hover:text-[#111]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e]",
          )}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 bg-white transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="flex flex-col gap-1 px-4 py-6" aria-label="Mobile navigation">
          {/* Category links */}
          <div className="mb-4">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#999]">
              Shop
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-base font-medium text-[#555] transition-colors",
                  "hover:bg-[#f5f3f0] hover:text-[#111]",
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <hr className="border-[#e1dcd0]/50" />

          {/* Action links */}
          <div className="mt-4">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#999]">
              Account
            </p>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleSearchClick();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-[#555] transition-colors",
                "hover:bg-[#f5f3f0] hover:text-[#111]",
              )}
            >
              <Search className="h-5 w-5" />
              Search
            </button>
            <Link
              href={session ? "/account" : "/auth/signin"}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-[#555] transition-colors",
                "hover:bg-[#f5f3f0] hover:text-[#111]",
              )}
            >
              <User className="h-5 w-5" />
              {session ? "My Account" : "Sign In"}
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2.5 text-base font-medium text-[#555] transition-colors",
                "hover:bg-[#f5f3f0] hover:text-[#111]",
              )}
            >
              <span className="flex items-center gap-3">
                <Heart className="h-5 w-5" />
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-[#e1dcd0] px-2 py-0.5 text-xs font-semibold text-[#555]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-base font-medium text-[#555] transition-colors",
                "hover:bg-[#f5f3f0] hover:text-[#111]",
              )}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5" />
                Cart
              </span>
              {itemCount > 0 && (
                <span className="rounded-full bg-[#c25b3e] px-2 py-0.5 text-xs font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
