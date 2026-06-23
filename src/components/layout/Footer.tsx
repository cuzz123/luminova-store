import Link from "next/link";
import { CATEGORIES } from "@/lib/products";

const helpLinks = [
  { label: "Shipping & Returns", href: "/help/shipping-returns" },
  { label: "Warranty", href: "/help/warranty" },
  { label: "FAQ", href: "/help/faq" },
  { label: "Contact", href: "/help/contact" },
  { label: "Track Order", href: "/help/track-order" },
];

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Trade Program", href: "/trade" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#303e39] text-[#e1dcd0]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div>
            <Link
              href="/"
              className="inline-block font-[Jost] text-xl font-semibold tracking-tight text-white"
            >
              Flint{" "}
              <span className="text-[#d4a85c]">&amp;</span>{" "}
              Beam
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#e1dcd0]/80">
              Hand-finished lighting crafted in Sonoma, California. Each fixture
              is made by skilled artisans using time-honored techniques and
              the finest materials. We believe light should feel as good as it
              looks.
            </p>
            <p className="mt-3 text-xs text-[#e1dcd0]/50">
              Sonoma, California
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-[Jost] text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-[#e1dcd0]/80 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h3 className="font-[Jost] text-sm font-semibold uppercase tracking-wider text-white">
              Help
            </h3>
            <ul className="mt-4 space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e1dcd0]/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: About */}
          <div>
            <h3 className="font-[Jost] text-sm font-semibold uppercase tracking-wider text-white">
              About
            </h3>
            <ul className="mt-4 space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e1dcd0]/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[#e1dcd0]/50">
            &copy; {new Date().getFullYear()} Flint &amp; Beam. All rights
            reserved.
          </p>
          <p className="text-xs text-[#e1dcd0]/50">
            USD &middot; Visa &middot; MC &middot; PayPal &middot; Apple Pay
          </p>
        </div>
      </div>
    </footer>
  );
}
