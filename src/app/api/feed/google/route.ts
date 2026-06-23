import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || "https://flintandbeam.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function mapCategoryToGoogle(category: string): string {
  const mapping: Record<string, string> = {
    chandeliers: "386 - Home & Garden > Lighting > Chandeliers",
    pendants: "386 - Home & Garden > Lighting > Pendant Lights",
    "wall-sconces": "386 - Home & Garden > Lighting > Wall Sconces",
    "table-lamps": "386 - Home & Garden > Lighting > Table Lamps",
    "floor-lamps": "386 - Home & Garden > Lighting > Floor Lamps",
    outdoor: "386 - Home & Garden > Lighting > Outdoor Lighting",
    "bathroom-lighting": "386 - Home & Garden > Lighting > Bathroom Lighting",
    "ceiling-lights": "386 - Home & Garden > Lighting > Ceiling Lights",
    "track-lighting": "386 - Home & Garden > Lighting > Track Lighting",
    "under-cabinet": "386 - Home & Garden > Lighting > Under Cabinet Lighting",
  };

  return mapping[category] || "386 - Home & Garden > Lighting";
}

export async function GET() {
  try {
    const items = PRODUCTS.filter((p) => p.active !== false);

    const xmlItems = items
      .map((product) => {
        const price = product.price.toFixed(2);
        const imageUrl = product.images?.[0]
          ? `${STORE_URL}${product.images[0]}`
          : `${STORE_URL}/images/placeholder.jpg`;
        const productUrl = `${STORE_URL}/products/${product.slug || product.id}`;

        return `  <item>
    <g:id>${escapeXml(product.id)}</g:id>
    <g:title>${escapeXml(product.name)}</g:title>
    <g:description>${escapeXml(product.description || product.name)}</g:description>
    <g:link>${escapeXml(productUrl)}</g:link>
    <g:image_link>${escapeXml(imageUrl)}</g:image_link>
    <g:price>${price} USD</g:price>
    <g:availability>in_stock</g:availability>
    <g:condition>new</g:condition>
    <g:brand>Flint &amp; Beam</g:brand>
    <g:google_product_category>${escapeXml(mapCategoryToGoogle(product.category))}</g:google_product_category>
    <g:product_type>${escapeXml(product.category || "Lighting")}</g:product_type>${product.shipping_weight ? `\n    <g:shipping_weight>${escapeXml(String(product.shipping_weight))} lb</g:shipping_weight>` : ""}
  </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Flint &amp; Beam</title>
    <link>${escapeXml(STORE_URL)}</link>
    <description>Handcrafted lighting from Sonoma, California</description>
${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Google feed generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate product feed" },
      { status: 500 }
    );
  }
}
