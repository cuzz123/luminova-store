import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Check, Truck, Wrench, Shield, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import {
  PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
  getReviewsByProduct,
  getCategoryBySlug,
} from "@/lib/products";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Review } from "@/lib/products";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/product/ProductCard";
import StickyAddToCart from "@/components/product/StickyAddToCart";
import RecentViews from "@/components/product/RecentViews";
import {
  ProductJsonLd,
  BreadcrumbJsonLd,
  FAQPageJsonLd,
} from "@/components/product/JsonLd";
import ProductGallery from "./product-gallery";
import AddToCartForm from "./add-to-cart-form";
import RecentViewTracker from "./recent-view-tracker";

/* ------------------------------------------------------------------ */
/*  Placeholder reviews (fallback when a product has no reviews yet)   */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: "placeholder-1",
    productId: "",
    author: "Emily R.",
    avatar: "",
    rating: 5,
    title: "Beautiful craftsmanship",
    body: "I was blown away by the quality when I unboxed this fixture. The finish is flawless and it looks even better in person than in the photos. Our electrician commented on how well-made the hardware is.",
    date: "2026-06-10",
  },
  {
    id: "placeholder-2",
    productId: "",
    author: "Michael T.",
    avatar: "",
    rating: 4,
    title: "Great addition to our home",
    body: "We were looking for something unique and this delivered. The warm light it casts is exactly what our dining room needed. Installation was straightforward — took about 30 minutes.",
    date: "2026-05-28",
  },
  {
    id: "placeholder-3",
    productId: "",
    author: "Sarah K.",
    avatar: "",
    rating: 5,
    title: "Worth every penny",
    body: "After months of searching for the right fixture, I'm so glad I found Flint & Beam. The materials feel substantial and the design is timeless. Customer service was also excellent when I had a question about dimmer compatibility.",
    date: "2026-06-15",
  },
];

/* ------------------------------------------------------------------ */
/*  generateStaticParams & generateMetadata                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found — Flint & Beam" };
  }

  return {
    title: `${product.name} — Flint & Beam`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((img) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: product.name,
      })),
      type: "website",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.category);
  const reviews = getReviewsByProduct(product.id);
  const relatedProducts = getRelatedProducts(product.id, 4);

  const displayReviews =
    reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS;

  const faqs = [
    {
      question: `What makes the ${product.name} special?`,
      answer: `Each ${product.name} is handcrafted by artisans in our Sonoma, California workshop using premium materials and time-honored techniques. ${product.description}`,
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day trial period. If you're not completely satisfied, return the fixture free of charge within 30 days of delivery for a full refund. The product must be in original condition with all packaging.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Most in-stock items ship within 1-3 business days from our Sonoma workshop. Custom or made-to-order pieces may take 5-7 business days. Once shipped, delivery typically takes 2-5 business days depending on your location within the US.",
    },
    {
      question: "Is professional installation required?",
      answer:
        "While many of our fixtures can be installed by a confident DIYer, we always recommend hiring a licensed electrician for hardwired fixtures. This ensures safety and compliance with local building codes. Plug-in models are designed for simple, tool-free setup.",
    },
  ];

  return (
    <>
      {/* ── JSON-LD Structured Data ─────────────────────────────── */}
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          {
            name: category?.name ?? product.category,
            href: `/products?category=${product.category}`,
          },
          {
            name: product.name,
            href: `/products/${product.slug}`,
          },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <nav
          className="mb-8 flex items-center gap-1.5 text-sm"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="text-[#999] hover:text-[#111] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-[#999]" />
          <Link
            href={`/products?category=${product.category}`}
            className="text-[#999] hover:text-[#111] transition-colors"
          >
            {category?.name ?? product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-[#999]" />
          <span className="text-[#555] truncate">{product.name}</span>
        </nav>

        {/* ── Two-column layout: Gallery + Info ──────────────── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Product Gallery + Sticky Sentinel */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
            {/* StickyAddToCart renders its own sentinel + bar; placed here
                so the sentinel sits right after the gallery in the DOM */}
            <StickyAddToCart product={product} />
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Category tag */}
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c25b3e]">
              {category?.name ?? product.category}
            </p>

            {/* Product name */}
            <h1 className="mt-2 font-[Jost] text-3xl font-semibold leading-tight text-[#111] sm:text-4xl">
              {product.name}
            </h1>

            {/* Star rating + review count */}
            <a
              href="#reviews"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#555] hover:text-[#c25b3e] transition-colors"
            >
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
            </a>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-[#111]">
                {formatPrice(product.price)}
              </span>
              {product.compareAt != null && (
                <span className="text-lg text-[#999] line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 leading-relaxed text-[#555]">
              {product.description}
            </p>

            {/* Features list */}
            <ul className="mt-6 space-y-2.5">
              {product.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-[#555]"
                >
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#d4a85c]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Add to Cart — client component with quantity, add to cart, wishlist */}
            <div className="mt-8">
              <AddToCartForm product={product} />
            </div>

            {/* Shipping info */}
            <div className="mt-6 flex items-center gap-2.5 rounded-lg bg-[#f5f3f0] px-4 py-3 text-sm text-[#555]">
              <Truck className="h-4 w-4 flex-shrink-0 text-[#303e39]" />
              <span>
                Free shipping over $149. Usually ships in 1-3 business
                days.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Why you&apos;ll love it ──────────────────────────────── */}
      <section className="border-t border-[#e1dcd0]/50 bg-[#f5f3f0]/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center font-[Jost] text-2xl font-semibold text-[#111] sm:text-3xl">
            Why you&apos;ll love it
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Handcrafted in Sonoma */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a85c]/10">
                <Wrench className="h-6 w-6 text-[#d4a85c]" />
              </div>
              <h3 className="mt-4 font-[Jost] text-base font-semibold text-[#111]">
                Handcrafted in Sonoma
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#555]">
                Each piece is made by artisans in our California workshop
                using time-honored techniques and premium materials.
              </p>
            </div>

            {/* 5-Year Warranty */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a85c]/10">
                <Shield className="h-6 w-6 text-[#d4a85c]" />
              </div>
              <h3 className="mt-4 font-[Jost] text-base font-semibold text-[#111]">
                5-Year Warranty
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#555]">
                We stand behind every fixture we make. If anything goes
                wrong, we&apos;ll repair or replace it.
              </p>
            </div>

            {/* 30-Day Trial */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a85c]/10">
                <RotateCcw className="h-6 w-6 text-[#d4a85c]" />
              </div>
              <h3 className="mt-4 font-[Jost] text-base font-semibold text-[#111]">
                30-Day Trial
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#555]">
                Not in love? Return it free within 30 days for a full
                refund. No questions asked.
              </p>
            </div>

            {/* Free Shipping Over $149 */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a85c]/10">
                <Truck className="h-6 w-6 text-[#d4a85c]" />
              </div>
              <h3 className="mt-4 font-[Jost] text-base font-semibold text-[#111]">
                Free Shipping Over $149
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#555]">
                Convenient delivery to your door. Most orders ship within
                1-3 business days from Sonoma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews Section ─────────────────────────────────── */}
      <section
        id="reviews"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[Jost] text-2xl font-semibold text-[#111]">
              Customer Reviews
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
              <span className="text-sm text-[#555]">
                {product.rating} out of 5
              </span>
            </div>
          </div>
          <Button variant="outline" size="md">
            Write a Review
          </Button>
        </div>

        {/* Review cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayReviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-[#e1dcd0] bg-white p-5"
            >
              {/* Author row */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#d4a85c]/10 text-sm font-semibold text-[#d4a85c]">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111]">
                    {review.author}
                  </p>
                  <p className="text-xs text-[#999]">
                    {formatDate(review.date)}
                  </p>
                </div>
              </div>

              {/* Star rating */}
              <StarRating
                rating={review.rating}
                showCount={false}
                size="sm"
                className="mt-3"
              />

              {/* Title */}
              <h4 className="mt-2 text-sm font-semibold text-[#111]">
                {review.title}
              </h4>

              {/* Body (quote) */}
              <p className="mt-1.5 text-sm leading-relaxed text-[#555] line-clamp-4">
                {review.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Related Products ────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[#e1dcd0]/50">
          <h2 className="font-[Jost] text-2xl font-semibold text-[#111]">
            You May Also Like
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

      {/* ── Recent Views ─────────────────────────────────────── */}
      <RecentViews />

      {/* Tracks this product view in localStorage (client-only, renders nothing) */}
      <RecentViewTracker product={product} />
    </>
  );
}
