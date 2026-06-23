import type { Product, Review } from "@/lib/products";

/* ------------------------------------------------------------------ */
/*  Organization                                                      */
/* ------------------------------------------------------------------ */

export function OrganizationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Flint & Beam",
    url: "https://flintandbeam.com",
    logo: "https://flintandbeam.com/logo.png",
    description:
      "Handcrafted lighting from Sonoma, California. Artisan-made pendants, chandeliers, sconces, table lamps, and floor lamps.",
    foundingDate: "2018",
    founders: [
      { "@type": "Person", name: "Mara Chen" },
      { "@type": "Person", name: "Leo Reyes" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "4521 Grove Street",
      addressLocality: "Sonoma",
      addressRegion: "CA",
      postalCode: "95476",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@flintandbeam.com",
      telephone: "+1-707-555-0142",
    },
    sameAs: [
      "https://instagram.com/flintandbeam",
      "https://facebook.com/flintandbeam",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Product                                                           */
/* ------------------------------------------------------------------ */

export function ProductJsonLd({ product }: { product: Product }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: product.price,
      priceCurrency: "USD",
      ...(product.compareAt && {
        priceValidUntil: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
      }),
    },
    aggregateRating:
      product.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    brand: {
      "@type": "Brand",
      name: "Flint & Beam",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Flint & Beam",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Breadcrumb                                                        */
/* ------------------------------------------------------------------ */

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://flintandbeam.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                               */
/* ------------------------------------------------------------------ */

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQPageJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
