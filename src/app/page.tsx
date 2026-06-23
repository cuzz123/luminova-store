import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Shield,
  Star,
  RotateCcw,
  ArrowRight,
  Camera as InstagramIcon,
  Check,
} from "lucide-react";
import { REVIEWS, getBestSellers } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import { OrganizationJsonLd } from "@/components/product/JsonLd";
import StarRating from "@/components/ui/StarRating";
import NewsletterForm from "@/components/home/NewsletterForm";

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Flint & Beam — Handcrafted Lighting from Sonoma, California",
  description:
    "From our workshop in Sonoma to your home. Every fixture is hand-finished by artisans who care about the curve of a shade and the warmth of a glow. Shop pendants, chandeliers, sconces, and lamps.",
};

/* ------------------------------------------------------------------ */
/*  Trust Bar data                                                    */
/* ------------------------------------------------------------------ */

const TRUST_SIGNALS = [
  {
    icon: Truck,
    label: "Free shipping over $149",
  },
  {
    icon: Shield,
    label: "30-day trial, free returns",
  },
  {
    icon: Star,
    label: "4.9 from 600+ reviews",
  },
  {
    icon: RotateCcw,
    label: "5-year warranty",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Instagram placeholder colors                                       */
/* ------------------------------------------------------------------ */

const INSTAGRAM_PLACEHOLDERS = ["#d4cfc4", "#c9b896", "#b85f46", "#3a4a44"];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const bestSellers = getBestSellers(6);
  const heroProduct = bestSellers[0];
  const featuredReviews = REVIEWS.slice(0, 3);

  return (
    <>
      <OrganizationJsonLd />

      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section className="bg-[#e1dcd0]">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          {/* ---- Two-column layout ---- */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image — first in DOM so it appears first on mobile */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg lg:order-last">
              <Image
                src={heroProduct.images[0]}
                alt={heroProduct.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Text */}
            <div className="lg:order-first">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c25b3e]">
                Spring 26 &middot; Hand-Finished in California
              </p>
              <h1 className="mt-4 font-['Jost'] text-4xl font-semibold leading-[1.1] tracking-tight text-[#111] sm:text-5xl lg:text-6xl">
                Light that makes a room feel lived in
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#555] sm:text-lg">
                From our workshop in Sonoma to your home. Every fixture is
                hand-finished by artisans who care about the curve of a shade
                and the warmth of a glow.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#303e39] px-7 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#252e2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2"
                >
                  Shop the Collection
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-[#303e39] bg-transparent px-7 text-sm font-medium text-[#303e39] transition-colors duration-150 hover:bg-[#d4cfc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>

          {/* ---- Stats bar ---- */}
          <div className="mt-14 flex flex-col items-center justify-center gap-6 border-t border-[#d4cfc4] pt-10 sm:flex-row sm:gap-12 lg:mt-20">
            {[
              { value: "3,200+", label: "Homes lit" },
              { value: "4.9", label: "Avg review" },
              { value: "5yr", label: "Warranty" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-['Jost'] text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#555]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Trust Bar                                                   */}
      {/* ============================================================ */}
      <section className="border-b border-[#e1dcd0] bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <Icon className="h-7 w-7 text-[#c25b3e]" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-[#111]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Best Sellers                                                */}
      {/* ============================================================ */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ---- Section heading ---- */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c25b3e]">
              Shop Bestsellers
            </p>
            <h2 className="mt-3 font-['Jost'] text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
              The pieces everyone asks about
            </h2>
          </div>

          {/* ---- Product grid ---- */}
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ---- View all link ---- */}
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#303e39] transition-colors duration-150 hover:text-[#c25b3e]"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Founder Story                                               */}
      {/* ============================================================ */}
      <section className="bg-[#e1dcd0] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — placeholder image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#d4cfc4]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium uppercase tracking-widest text-[#b8b0a4]">
                  Flint &amp; Beam Workshop
                </span>
              </div>
            </div>

            {/* Right — text */}
            <div>
              <h2 className="font-['Jost'] text-3xl font-semibold leading-tight tracking-tight text-[#111] sm:text-4xl">
                We left our design jobs to make lights that feel like home
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#555]">
                Mara and Leo met in a San Francisco design studio, bonding over
                a shared frustration: every lighting catalog felt cold and
                mass-produced. In 2018 they packed up their sketches, moved to
                Sonoma, and turned a converted barn into a workshop. The first
                Aurora pendant was shaped by hand over six weeks &mdash; and
                sold out within days of hitting Instagram.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#555]">
                Today, every Flint &amp; Beam piece still passes through their
                studio. Raw brass is polished until it glows. Glass is blown in
                small batches by a third-generation glassmaker twenty minutes
                away. Wood shades are turned on a lathe that once belonged to
                Leo&rsquo;s grandfather. No assembly lines. No shortcuts. Just
                the conviction that the light in your home should feel as
                intentional as everything you put under it.
              </p>
              <p className="mt-6 text-sm font-medium text-[#111]">
                &mdash; Mara &amp; Leo, founders
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#303e39] transition-colors duration-150 hover:text-[#c25b3e]"
              >
                Read the full story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Reviews                                                     */}
      {/* ============================================================ */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ---- Section heading ---- */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c25b3e]">
              From Our Customers
            </p>
            <h2 className="mt-3 font-['Jost'] text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
              What people are saying
            </h2>
          </div>

          {/* ---- Review cards ---- */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col rounded-lg border border-[#e1dcd0] bg-[#faf9f7] p-6 sm:p-8"
              >
                {/* Star rating */}
                <StarRating rating={review.rating} size="md" />

                {/* Quote */}
                <blockquote className="mt-4 flex-1">
                  <p className="text-sm leading-relaxed text-[#555]">
                    &ldquo;{review.body}&rdquo;
                  </p>
                </blockquote>

                {/* Author + badge */}
                <div className="mt-6 flex items-center justify-between border-t border-[#e1dcd0] pt-4">
                  <p className="text-sm font-medium text-[#111]">
                    {review.author}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f0ea] px-2.5 py-1 text-xs font-medium text-[#4a7c59]">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    Verified Buyer
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Instagram                                                   */}
      {/* ============================================================ */}
      <section className="border-t border-[#e1dcd0] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ---- Section heading ---- */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c25b3e]">
              Styled by You
            </p>
            <h2 className="mt-3 font-['Jost'] text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
              @flintandbeam in the wild
            </h2>
          </div>

          {/* ---- Image grid ---- */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {INSTAGRAM_PLACEHOLDERS.map((color, i) => (
              <div
                key={i}
                className="relative aspect-square w-full overflow-hidden rounded-lg"
                style={{ backgroundColor: color }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <InstagramIcon
                    className="h-8 w-8 text-white/50"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ---- Tag line ---- */}
          <p className="mt-8 text-center text-sm text-[#555]">
            Tag us{" "}
            <a
              href="https://instagram.com/flintandbeam"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#303e39] underline underline-offset-2 transition-colors hover:text-[#c25b3e]"
            >
              @flintandbeam
            </a>{" "}
            for a chance to be featured
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Newsletter (client component)                               */}
      {/* ============================================================ */}
      <NewsletterForm />
    </>
  );
}
