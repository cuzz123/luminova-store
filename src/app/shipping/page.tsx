import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Shield, Clock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy — Flint & Beam",
  description:
    "Flint & Beam shipping information. Learn about our crafting timeline, shipping methods, rates, international delivery, and order tracking.",
};

export default function ShippingPage() {
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
            Shipping Policy
          </h1>
          <p style={{ color: "var(--body)" }}>
            How we craft, pack, and deliver your lighting across the country and
            around the world.
          </p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Clock,
              title: "Crafting Time",
              desc: "5-7 business days before shipment. Each piece is made to order in our Sonoma workshop.",
            },
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "On all domestic orders over $149. Standard shipping is $14.95 for orders under $149.",
            },
            {
              icon: Globe,
              title: "International",
              desc: "We ship to Canada, UK, EU, Australia, NZ, and Japan. Duties may apply.",
            },
            {
              icon: Shield,
              title: "Insured",
              desc: "Every shipment is fully insured. If a package is lost or damaged, we handle the claim.",
            },
          ].map((fact, i) => (
            <div key={i} className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--sand)" }}
              >
                <fact.icon
                  className="w-5 h-5"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <h3
                className="text-sm font-medium mb-1.5"
                style={{ color: "var(--heading)" }}
              >
                {fact.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--body)" }}>
                {fact.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed content */}
      <section className="py-16 lg:py-20 px-4">
        <div className="max-w-3xl mx-auto prose-custom">
          <h2 style={{ color: "var(--heading)" }}>Crafting Timeline</h2>
          <p style={{ color: "var(--body)" }}>
            Every Flint & Beam fixture is made to order in our Sonoma,
            California workshop. When you place an order, our artisans begin
            the process of forging, casting, finishing, and assembling your
            piece by hand. This typically takes 5-7 business days. During
            holidays and peak seasons, crafting may take up to 10 business days.
            We'll notify you by email if your order will take longer than
            expected.
          </p>
          <p style={{ color: "var(--body)" }}>
            If you need a piece by a specific date, please{" "}
            <Link href="/contact" style={{ color: "var(--accent)" }}>
              contact us
            </Link>{" "}
            before placing your order. We'll do our best to accommodate rush
            requests, though additional fees may apply.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Domestic Shipping (United States)</h2>
          <p style={{ color: "var(--body)" }}>
            We ship to all 50 states, plus APO/FPO/DPO addresses, Puerto Rico,
            Guam, and the US Virgin Islands. All domestic shipments are sent via
            UPS Ground or FedEx Home Delivery, with delivery typically in 3-5
            business days after the crafting period.
          </p>
          <h3 style={{ color: "var(--heading)" }}>Rates</h3>
          <ul style={{ color: "var(--body)" }}>
            <li>
              <strong>Free:</strong> Orders over $149
            </li>
            <li>
              <strong>$14.95:</strong> Standard shipping for orders under $149
            </li>
            <li>
              <strong>$34.95:</strong> Express shipping (2-day)
            </li>
            <li>
              <strong>$59.95:</strong> Overnight shipping
            </li>
          </ul>
          <p style={{ color: "var(--body)" }}>
            Express and overnight options are calculated from the time your
            order is ready to ship, not from the order date. Large fixtures
            (chandeliers, multi-arm pieces) may have adjusted shipping rates
            due to weight and dimensions; these are calculated at checkout.
          </p>

          <h2 style={{ color: "var(--heading)" }}>International Shipping</h2>
          <p style={{ color: "var(--body)" }}>
            We ship internationally to the following countries:
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>Canada</li>
            <li>United Kingdom</li>
            <li>European Union (all member states)</li>
            <li>Australia</li>
            <li>New Zealand</li>
            <li>Japan</li>
          </ul>
          <p style={{ color: "var(--body)" }}>
            International orders are shipped via UPS Worldwide, FedEx
            International, or DHL Express. Delivery typically takes 7-14
            business days after crafting, depending on the destination and
            customs processing.
          </p>
          <h3 style={{ color: "var(--heading)" }}>Customs and Duties</h3>
          <p style={{ color: "var(--body)" }}>
            International orders may be subject to customs duties, import taxes
            (VAT/GST), brokerage fees, and other charges imposed by the
            destination country. These charges are the responsibility of the
            recipient and are not included in the purchase price or shipping
            cost. We recommend contacting your local customs office for
            information on potential charges before placing an order.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Order Tracking</h2>
          <p style={{ color: "var(--body)" }}>
            Once your order ships, you will receive a confirmation email with a
            tracking number. You can track your order at any time on our{" "}
            <Link href="/track-order" style={{ color: "var(--accent)" }}>
              Order Tracking
            </Link>{" "}
            page. If you don't receive a tracking email within 7 business days
            of placing your order, please check your spam folder or contact us.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Packaging</h2>
          <p style={{ color: "var(--body)" }}>
            We take packaging seriously. Each fixture is packed in custom-cut,
            recyclable foam within a double-walled corrugated box. For fragile
            components (glass shades, ceramic elements), we use additional
            cushioning and reinforcement. Our packaging is designed to withstand
            the rigors of carrier handling while minimizing waste.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Lost or Damaged Shipments</h2>
          <p style={{ color: "var(--body)" }}>
            All shipments are fully insured. If your package is lost in transit
            or arrives damaged, email us at support@flintandbeam.com within 48
            hours of delivery (for damage claims) or within 14 days of the
            estimated delivery date (for lost packages). Include your order
            number and photos of any damage. We will ship a replacement at no
            cost and handle the carrier claim on our end.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Delivery Issues</h2>
          <p style={{ color: "var(--body)" }}>
            If your tracking shows delivered but you cannot locate the package,
            first check with neighbors, building management, and any safe
            delivery locations around your property. If the package is still
            missing after 24 hours, contact us. We'll work with the carrier to
            locate your shipment or arrange a replacement.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Address Changes</h2>
          <p style={{ color: "var(--body)" }}>
            If you need to change your shipping address after placing an order,
            please contact us immediately. Address changes are free if requested
            before your order ships. Once an order has shipped, address changes
            may not be possible, and you may be responsible for any rerouting
            fees charged by the carrier.
          </p>

          <h2 style={{ color: "var(--heading)" }}>Questions?</h2>
          <p style={{ color: "var(--body)" }}>
            If you have questions about shipping that aren't covered here,
            please reach out at{" "}
            <strong style={{ color: "var(--heading)" }}>
              support@flintandbeam.com
            </strong>{" "}
            or call us at{" "}
            <strong style={{ color: "var(--heading)" }}>(707) 555-0147</strong>.
          </p>
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
