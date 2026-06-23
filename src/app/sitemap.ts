import { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const staticPages: { url: string; changefreq?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number }[] = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/products", changefreq: "daily", priority: 0.9 },
  { url: "/about", changefreq: "monthly", priority: 0.7 },
  { url: "/faq", changefreq: "monthly", priority: 0.5 },
  { url: "/contact", changefreq: "monthly", priority: 0.6 },
  { url: "/cart", changefreq: "weekly", priority: 0.4 },
  { url: "/checkout", changefreq: "weekly", priority: 0.4 },
  { url: "/wishlist", changefreq: "weekly", priority: 0.3 },
  { url: "/search", changefreq: "weekly", priority: 0.4 },
  { url: "/track-order", changefreq: "weekly", priority: 0.4 },
  { url: "/privacy", changefreq: "yearly", priority: 0.2 },
  { url: "/terms", changefreq: "yearly", priority: 0.2 },
  { url: "/shipping", changefreq: "monthly", priority: 0.3 },
  { url: "/refund", changefreq: "monthly", priority: 0.3 },
  { url: "/auth/signin", changefreq: "monthly", priority: 0.3 },
  { url: "/auth/register", changefreq: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: page.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE_URL}/products?category=${encodeURIComponent(category.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${SITE_URL}/products/${encodeURIComponent(product.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
