import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return & Refund Policy — Flint & Beam",
  description:
    "Flint & Beam return and refund policy. 30-day returns on handcrafted lighting. Learn about eligibility, how to initiate a return, and our refund process.",
};

export default function RefundPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
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
            Policies
          </p>
          <h1
            className="text-3xl lg:text-4xl font-medium mb-4"
            style={{ color: "var(--heading)" }}
          >
            Return & Refund Policy
          </h1>
          <p style={{ color: "var(--body)" }}>
            We stand behind every piece we make. If you're not satisfied, we'll
            make it right.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20 px-4">
        <div className="max-w-3xl mx-auto prose-custom">
          <h2 style={{ color: "var(--heading)" }}>Our Promise</h2>
          <p style={{ color: "var(--body)" }}>
            Every Flint & Beam fixture is handcrafted to order in our Sonoma
            workshop. We want you to love your lighting as much as we loved
            making it. If for any reason you're not completely satisfied, we
            offer a straightforward 30-day return policy.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Return Window</h2>
          <p style={{ color: "var(--body)" }}>
            You have 30 calendar days from the date of delivery to initiate a
            return. The return window begins on the date the carrier marks the
            package as delivered. If the 30th day falls on a weekend or holiday,
            the window extends to the next business day.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Eligibility</h2>
          <p style={{ color: "var(--body)" }}>
            To be eligible for a return, your item must:
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>Be in original condition with no signs of installation or use.</li>
            <li>
              Include all original components: mounting hardware, glass shades,
              installation guide, and any accessories.
            </li>
            <li>Be returned in its original packaging, or equivalent protective
            packaging.</li>
          </ul>
          <p style={{ color: "var(--body)" }}>
            <strong>Not eligible for return:</strong>
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>
              Custom or modified pieces (including alternate finishes, custom
              dimensions, or personalized elements).
            </li>
            <li>
              Items that show signs of installation, damage from improper
              installation, or use beyond inspection.
            </li>
            <li>Items returned more than 30 days after delivery.</li>
            <li>Items purchased as final sale or clearance.</li>
          </ul>

          <h2 style={{ color: "var(--heading)" }}>How to Initiate a Return</h2>
          <p style={{ color: "var(--body)" }}>
            To begin a return, email us at{" "}
            <strong style={{ color: "var(--heading)" }}>
              returns@flintandbeam.com
            </strong>{" "}
            with:
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>Your order number</li>
            <li>The item(s) you'd like to return</li>
            <li>The reason for the return (so we can improve)</li>
          </ul>
          <p style={{ color: "var(--body)" }}>
            We will reply within one business day with return instructions and a
            prepaid return shipping label (domestic orders). International
            return shipping costs are the responsibility of the customer.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Return Shipping</h2>
          <p style={{ color: "var(--body)" }}>
            <strong>Domestic (US) returns:</strong> Return shipping is free.
            We'll provide a prepaid UPS or FedEx return label.
          </p>
          <p style={{ color: "var(--body)" }}>
            <strong>International returns:</strong> The customer is responsible
            for return shipping costs. We recommend using a trackable shipping
            method, as we cannot guarantee receipt of returned items without
            tracking.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Refunds</h2>
          <p style={{ color: "var(--body)" }}>
            Once we receive and inspect your return, we will process your refund
            within 10 business days. Refunds are issued to the original payment
            method. You will receive an email confirmation when your refund has
            been processed.
          </p>
          <p style={{ color: "var(--body)" }}>
            <strong>What is refunded:</strong>
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>Full purchase price of the returned item(s).</li>
            <li>Original shipping charges, if the return is due to our error
            (defective item, wrong item shipped).</li>
          </ul>
          <p style={{ color: "var(--body)" }}>
            <strong>What is not refunded:</strong>
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>
              Original shipping charges for returns not due to our error.
            </li>
            <li>
              International duties, taxes, or customs fees (these are collected
              by the destination country, not by Flint & Beam).
            </li>
          </ul>

          <h2 style={{ color: "var(--heading)" }}>Exchanges</h2>
          <p style={{ color: "var(--body)" }}>
            If you'd like to exchange your item for a different piece, the
            fastest method is to return the original item and place a new order.
            This ensures your new piece enters our crafting queue immediately.
            If you prefer a direct exchange, contact us and we'll discuss timing
            and availability.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Damaged or Defective Items</h2>
          <p style={{ color: "var(--body)" }}>
            If your item arrives damaged or with a manufacturing defect, please
            refer to our warranty process rather than the standard return
            process. Contact us at{" "}
            <strong style={{ color: "var(--heading)" }}>
              support@flintandbeam.com
            </strong>{" "}
            within 48 hours of delivery with photos of the damage. We will ship
            a replacement at no cost and handle the carrier claim. You do not
            need to return the damaged piece unless specifically requested.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Cancellations</h2>
          <p style={{ color: "var(--body)" }}>
            You may cancel your order within 24 hours of placement for a full
            refund with no restocking fee. After 24 hours, cancellation may not
            be possible, as crafting will have begun. If you need to cancel an
            order after 24 hours, contact us immediately and we'll let you know
            whether cancellation is still possible based on the production
            status.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Warranty Claims</h2>
          <p style={{ color: "var(--body)" }}>
            All Flint & Beam fixtures are covered by our Lifetime Warranty
            against defects in materials and workmanship. For warranty claims,
            please email{" "}
            <strong style={{ color: "var(--heading)" }}>
              warranty@flintandbeam.com
            </strong>{" "}
            with your order number, photos of the issue, and a brief
            description. Warranty claims are evaluated within 3 business days,
            and approved claims result in repair or replacement at our
            discretion.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Questions?</h2>
          <p style={{ color: "var(--body)" }}>
            If you have any questions about returns, refunds, or our warranty
            that aren't covered here, we're happy to help. Email us at{" "}
            <strong style={{ color: "var(--heading)" }}>
              returns@flintandbeam.com
            </strong>{" "}
            or call{" "}
            <strong style={{ color: "var(--heading)" }}>(707) 555-0147</strong>{" "}
            during business hours (Monday-Friday, 9am-5pm PT).
          </p>

          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .prose-custom h2 {
          font-size: 1.25rem;
          font-weight: 500;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
        }
        .prose-custom h3 {
          font-size: 1.05rem;
          font-weight: 500;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose-custom p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .prose-custom ul {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prose-custom li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
}
