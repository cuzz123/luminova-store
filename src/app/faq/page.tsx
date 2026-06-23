import type { Metadata } from "next";
import { FAQAccordion } from "./FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ — Flint & Beam",
  description:
    "Frequently asked questions about Flint & Beam handcrafted lighting: materials, shipping, returns, installation, warranty, and more.",
  openGraph: {
    title: "Frequently Asked Questions — Flint & Beam",
    description:
      "Find answers about our handcrafted lighting, shipping, returns, and care.",
  },
};

/* ------------------------------------------------------------------ */
/*  FAQ items                                                          */
/* ------------------------------------------------------------------ */

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What materials do you use?",
    answer:
      "We work primarily with solid brass, forged iron, cast bronze, hand-blown glass, California hardwoods (oak, walnut, redwood burl), copper, and terracotta. Every material is chosen for its durability, character, and how it ages over time. We never use plated plastics, hollow extruded metals, or particle board. If you have questions about a specific piece, the full material breakdown is listed on its product page.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Because every Flint & Beam piece is made to order, please allow 5-7 business days for crafting before your order ships. Once shipped, domestic (US) orders typically arrive in 3-5 business days via UPS Ground or FedEx Home Delivery. Express shipping options are available at checkout. You'll receive a tracking number by email as soon as your order leaves our Sonoma workshop.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes. We ship to Canada, the United Kingdom, the European Union, Australia, New Zealand, and Japan. International orders may be subject to customs duties, import taxes, and brokerage fees, which are the responsibility of the recipient. International delivery typically takes 7-14 business days after crafting. For countries not listed, please contact us — we may be able to accommodate your request.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return window from the date of delivery. If you're not satisfied with your fixture for any reason, you may return it for a full refund of the purchase price. Returned items must be in original condition with all components and packaging. Return shipping is free for domestic orders. Custom or modified pieces are not eligible for return. To initiate a return, email returns@flintandbeam.com with your order number.",
  },
  {
    question: "How do I install my fixture?",
    answer:
      "Every Flint & Beam fixture ships with a detailed installation guide and all necessary mounting hardware. Our fixtures use standard US junction boxes and wiring. We recommend installation by a licensed electrician, particularly for chandeliers, multi-arm fixtures, or any piece weighing more than 15 lbs. If you're comfortable with basic electrical work, our pendants and sconces are designed for straightforward DIY installation. Never attempt installation without turning off power at the breaker.",
  },
  {
    question: "Are your lights dimmable?",
    answer:
      "Yes, all Flint & Beam fixtures are compatible with standard dimmer switches when used with dimmable LED bulbs. We recommend using ELV (electronic low voltage) dimmers for the smoothest dimming performance and to eliminate any possibility of flicker. The specific bulb type required for your fixture is listed on the product page and included in the installation guide.",
  },
  {
    question: "What's the warranty?",
    answer:
      "Every Flint & Beam fixture is covered by our Lifetime Warranty. We warrant that your fixture will be free from defects in materials and workmanship for as long as you own it. If anything fails due to our craftsmanship, we will repair or replace it at our discretion. The warranty covers the fixture housing, finish, and electrical components (excluding bulbs). Damage from improper installation, misuse, or normal wear on consumable parts is not covered. This is a warranty for the original purchaser and is not transferable.",
  },
  {
    question: "Can I customize a piece?",
    answer:
      "Yes, and we love custom work. Since every piece is made to order, we can often accommodate modifications: alternate finishes (e.g., polished brass instead of aged bronze), longer or shorter cord/chain lengths, different glass shade options, or custom dimensions. Custom orders start with a conversation. Contact us through the Custom Inquiry form, and we'll discuss your vision, timeline, and pricing. Custom pieces typically add 1-2 weeks to the crafting timeline and may have a modification fee depending on the scope.",
  },
  {
    question: "Do you have a trade program?",
    answer:
      "Yes. Our Trade Program is designed for interior designers, architects, contractors, and hospitality buyers. Trade members receive 15% off all orders, dedicated account support, complimentary finish samples, and early access to new collections. To apply, visit our Trade Program page or email trade@flintandbeam.com with your business details and resale certificate or professional license.",
  },
  {
    question: "How do I clean my fixture?",
    answer:
      "Cleaning depends on the finish. For brass and copper: dust regularly with a soft, dry microfiber cloth. For fingerprints or smudges, use a slightly damp cloth followed immediately by a dry cloth. Do not use brass polish on patinated or lacquered finishes — it will remove the patina. For iron: dust with a dry cloth. Avoid water, which can cause rust on unlacquered iron. For glass shades: remove the shade and wash with warm water and mild dish soap, then dry thoroughly before reinstalling. For wood: dust with a dry cloth. Occasionally apply a small amount of mineral oil with a soft cloth to maintain the finish. Never use abrasive cleaners or chemical solvents on any finish.",
  },
  {
    question: "Are your lights UL certified?",
    answer:
      "Yes. Every Flint & Beam fixture is UL or ETL certified, meaning it has been tested and meets North American safety standards for electrical lighting fixtures. The certification mark and file number are printed on the fixture's electrical label. Our components (sockets, wiring, junction boxes) are sourced from certified suppliers. If you need a copy of the certification for your electrician or building inspector, email us and we'll send it within one business day.",
  },
  {
    question: "What if my item arrives damaged?",
    answer:
      "We take extraordinary care in packaging — each fixture is packed in custom-cut foam in a double-walled box — but we know things can happen in transit. If your item arrives damaged, email us at support@flintandbeam.com within 48 hours of delivery. Include your order number and photos of the damaged packaging and fixture. We will ship a replacement immediately at no cost to you and handle the carrier claim on our end. You won't need to return the damaged piece. If the damage is cosmetic and you'd prefer a partial refund instead of a replacement, we can discuss that option too.",
  },
];

/* ------------------------------------------------------------------ */
/*  FAQPage JSON-LD structured data                                    */
/* ------------------------------------------------------------------ */

function FAQPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FAQPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <FAQPageJsonLd />

      {/* Header */}
      <section
        className="py-16 lg:py-24 px-4 text-center"
        style={{ backgroundColor: "var(--sand)" }}
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
            style={{ color: "var(--accent)" }}
          >
            Help Center
          </p>
          <h1
            className="text-3xl lg:text-4xl xl:text-5xl font-medium mb-4"
            style={{ color: "var(--heading)" }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ color: "var(--body)" }}>
            Everything you need to know about our handcrafted lighting, from
            materials to installation.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* Still have questions? */}
      <section
        className="py-16 px-4 text-center"
        style={{ backgroundColor: "var(--sand)" }}
      >
        <div className="max-w-md mx-auto">
          <h2
            className="text-xl font-medium mb-2"
            style={{ color: "var(--heading)" }}
          >
            Still have questions?
          </h2>
          <p className="mb-6" style={{ color: "var(--body)" }}>
            We're here to help. Reach out and we'll get back to you within one
            business day.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
