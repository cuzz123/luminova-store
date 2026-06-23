import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Flint & Beam",
  description:
    "Terms of Service for Flint & Beam. Read the terms governing your use of our website and purchase of handcrafted lighting products.",
};

export default function TermsPage() {
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
            Legal
          </p>
          <h1
            className="text-3xl lg:text-4xl font-medium mb-4"
            style={{ color: "var(--heading)" }}
          >
            Terms of Service
          </h1>
          <p style={{ color: "var(--body)" }}>
            Last updated: June 15, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-3xl mx-auto prose-custom">
          <h2 style={{ color: "var(--heading)" }}>1. Acceptance of Terms</h2>
          <p style={{ color: "var(--body)" }}>
            By accessing or using the Flint & Beam website (flintandbeam.com, the
            "Site"), or purchasing products from Flint & Beam, you agree to be
            bound by these Terms of Service ("Terms"). If you do not agree to
            these Terms, please do not use the Site or purchase our products.
          </p>
          <p style={{ color: "var(--body)" }}>
            Flint & Beam reserves the right to update or modify these Terms at any
            time without prior notice. Changes will be effective immediately upon
            posting to the Site. Your continued use of the Site after changes are
            posted constitutes acceptance of the updated Terms.
          </p>

          <h2 style={{ color: "var(--heading)" }}>2. Eligibility</h2>
          <p style={{ color: "var(--body)" }}>
            You must be at least 18 years old, or the age of majority in your
            jurisdiction, to use the Site or place an order. By using the Site,
            you represent that you meet these requirements. If you are using the
            Site on behalf of a business or organization, you represent that you
            have the authority to bind that entity to these Terms.
          </p>

          <h2 style={{ color: "var(--heading)" }}>3. Products and Orders</h2>
          <h3 style={{ color: "var(--heading)" }}>3.1 Product Descriptions</h3>
          <p style={{ color: "var(--body)" }}>
            We strive to describe our products accurately, including materials,
            dimensions, finishes, and lead times. Because each piece is
            handcrafted, slight variations in finish, texture, and dimensions
            are natural and expected. These variations are not considered
            defects but rather hallmarks of artisanal craftsmanship.
          </p>
          <h3 style={{ color: "var(--heading)" }}>3.2 Pricing</h3>
          <p style={{ color: "var(--body)" }}>
            All prices are listed in US dollars and are subject to change
            without notice. Prices do not include applicable taxes or shipping
            charges, which will be calculated and displayed at checkout. We
            reserve the right to correct pricing errors and cancel orders placed
            at an incorrect price.
          </p>
          <h3 style={{ color: "var(--heading)" }}>3.3 Order Acceptance</h3>
          <p style={{ color: "var(--body)" }}>
            Your receipt of an order confirmation does not constitute acceptance
            of your order. We reserve the right to accept or decline any order
            for any reason, including product unavailability, pricing errors, or
            suspected fraud. If we cancel your order, we will issue a full
            refund.
          </p>
          <h3 style={{ color: "var(--heading)" }}>3.4 Made-to-Order</h3>
          <p style={{ color: "var(--body)" }}>
            All Flint & Beam products are made to order. Once your order is
            placed, our workshop begins crafting your piece. You may cancel or
            modify your order within 24 hours of placement at no charge. After
            24 hours, cancellations or modifications may not be possible, as
            production will have begun.
          </p>

          <h2 style={{ color: "var(--heading)" }}>4. Payment</h2>
          <p style={{ color: "var(--body)" }}>
            We accept payment via PayPal and major credit/debit cards processed
            through PayPal. By submitting a payment, you represent that you are
            authorized to use the payment method. All payments are processed
            securely through PCI-compliant payment processors. We do not store
            full credit card details on our servers.
          </p>

          <h2 style={{ color: "var(--heading)" }}>5. Shipping and Delivery</h2>
          <p style={{ color: "var(--body)" }}>
            Shipping timelines are estimates only. The crafting period is
            typically 5-7 business days, and transit time varies by destination
            and shipping method selected at checkout. Flint & Beam is not liable
            for delays caused by carriers, customs, weather, or events beyond
            our control. Risk of loss and title pass to you upon delivery to the
            carrier. Please see our{" "}
            <a href="/shipping" style={{ color: "var(--accent)" }}>
              Shipping Policy
            </a>{" "}
            for complete details.
          </p>

          <h2 style={{ color: "var(--heading)" }}>6. Returns and Refunds</h2>
          <p style={{ color: "var(--body)" }}>
            We offer a 30-day return policy from the date of delivery. Items
            must be returned in original condition with all components and
            packaging. Custom or modified pieces are not eligible for return.
            Refunds are processed within 10 business days of receipt and
            inspection. Please see our{" "}
            <a href="/refund" style={{ color: "var(--accent)" }}>
              Return & Refund Policy
            </a>{" "}
            for complete details.
          </p>

          <h2 style={{ color: "var(--heading)" }}>7. Intellectual Property</h2>
          <p style={{ color: "var(--body)" }}>
            All content on the Site, including but not limited to text, images,
            graphics, logos, product designs, photographs, videos, and software,
            is the property of Flint & Beam or its licensors and is protected by
            United States and international copyright, trademark, and
            intellectual property laws. You may not reproduce, distribute,
            modify, or create derivative works from any Site content without our
            express written permission.
          </p>
          <p style={{ color: "var(--body)" }}>
            "Flint & Beam" and the flame-and-beam logo are trademarks of Flint &
            Beam Lighting, LLC. Product names may be trademarks of Flint & Beam
            or their respective owners.
          </p>

          <h2 style={{ color: "var(--heading)" }}>8. User Accounts</h2>
          <p style={{ color: "var(--body)" }}>
            You may create an account on the Site. You are responsible for
            maintaining the confidentiality of your account credentials and for
            all activities that occur under your account. You agree to provide
            accurate and complete information and to update it as necessary.
            Flint & Beam reserves the right to suspend or terminate accounts
            that violate these Terms.
          </p>

          <h2 style={{ color: "var(--heading)" }}>9. User-Generated Content</h2>
          <p style={{ color: "var(--body)" }}>
            If you submit reviews, comments, photos, or other content to the
            Site ("User Content"), you grant Flint & Beam a non-exclusive,
            royalty-free, perpetual, irrevocable, worldwide license to use,
            reproduce, modify, adapt, publish, and display such content for
            promotional and commercial purposes. You represent that you own or
            have the necessary rights to the User Content you submit and that it
            does not violate the rights of any third party.
          </p>

          <h2 style={{ color: "var(--heading)" }}>10. Disclaimer of Warranties</h2>
          <p style={{ color: "var(--body)" }}>
            THE SITE AND ALL PRODUCTS ARE PROVIDED ON AN "AS IS" AND "AS
            AVAILABLE" BASIS. FLINT & BEAM MAKES NO REPRESENTATIONS OR
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, REGARDING THE SITE OR
            PRODUCTS, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE
            UNINTERRUPTED, ERROR-FREE, OR SECURE.
          </p>

          <h2 style={{ color: "var(--heading)" }}>11. Limitation of Liability</h2>
          <p style={{ color: "var(--body)" }}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, FLINT & BEAM SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE SITE OR
            PURCHASE OF PRODUCTS, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
            DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM
            THESE TERMS OR YOUR USE OF THE SITE SHALL NOT EXCEED THE AMOUNT YOU
            PAID FOR THE PRODUCT(S) GIVING RISE TO THE CLAIM.
          </p>

          <h2 style={{ color: "var(--heading)" }}>12. Indemnification</h2>
          <p style={{ color: "var(--body)" }}>
            You agree to indemnify, defend, and hold harmless Flint & Beam and
            its officers, directors, employees, and agents from any claims,
            damages, losses, liabilities, and expenses (including reasonable
            attorneys' fees) arising from your use of the Site, your violation
            of these Terms, or your violation of any third-party rights.
          </p>

          <h2 style={{ color: "var(--heading)" }}>13. Governing Law</h2>
          <p style={{ color: "var(--body)" }}>
            These Terms shall be governed by and construed in accordance with
            the laws of the State of California, without regard to its conflict
            of law principles. Any dispute arising from these Terms shall be
            resolved exclusively in the state or federal courts located in
            Sonoma County, California.
          </p>

          <h2 style={{ color: "var(--heading)" }}>14. Dispute Resolution</h2>
          <p style={{ color: "var(--body)" }}>
            Before filing a formal legal action, you agree to contact us first
            at legal@flintandbeam.com to attempt to resolve the dispute
            informally. If we cannot resolve the dispute within 60 days, you may
            pursue your claim in accordance with the governing law provision
            above.
          </p>

          <h2 style={{ color: "var(--heading)" }}>15. Termination</h2>
          <p style={{ color: "var(--body)" }}>
            We may suspend or terminate your access to the Site at any time,
            with or without cause, without prior notice. Provisions that by
            their nature should survive termination (including intellectual
            property, disclaimers, and limitations of liability) shall survive.
          </p>

          <h2 style={{ color: "var(--heading)" }}>16. General Provisions</h2>
          <ul style={{ color: "var(--body)" }}>
            <li>
              <strong>Severability:</strong> If any provision of these Terms is
              found to be unenforceable, the remaining provisions shall remain
              in full effect.
            </li>
            <li>
              <strong>Waiver:</strong> Our failure to enforce any provision of
              these Terms shall not constitute a waiver of that provision.
            </li>
            <li>
              <strong>Entire Agreement:</strong> These Terms constitute the
              entire agreement between you and Flint & Beam regarding your use
              of the Site and supersede any prior agreements.
            </li>
            <li>
              <strong>Assignment:</strong> You may not assign your rights under
              these Terms without our written consent. We may assign our rights
              without restriction.
            </li>
          </ul>

          <h2 style={{ color: "var(--heading)" }}>17. Contact</h2>
          <p style={{ color: "var(--body)" }}>
            For questions about these Terms, please contact us:
          </p>
          <div style={{ color: "var(--body)" }}>
            <p>
              <strong>Email:</strong> legal@flintandbeam.com
            </p>
            <p>
              <strong>Mail:</strong> Flint & Beam, 421 Spain Street, Sonoma, CA
              95476
            </p>
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
