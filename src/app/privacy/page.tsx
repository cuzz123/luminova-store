import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Flint & Beam",
  description:
    "Flint & Beam privacy policy. Learn how we collect, use, and protect your personal information when you visit our website or purchase our handcrafted lighting.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ color: "var(--body)" }}>
            Last updated: June 15, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-3xl mx-auto prose-custom">
          <h2 style={{ color: "var(--heading)" }}>1. Introduction</h2>
          <p style={{ color: "var(--body)" }}>
            Flint & Beam ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website{" "}
            flintandbeam.com (the "Site") or purchase our products. Please read
            this policy carefully. By using the Site, you consent to the data
            practices described in this policy.
          </p>

          <h2 style={{ color: "var(--heading)" }}>2. Information We Collect</h2>
          <p style={{ color: "var(--body)" }}>
            We collect several types of information from and about users of our
            Site:
          </p>
          <h3 style={{ color: "var(--heading)" }}>Personal Information</h3>
          <ul style={{ color: "var(--body)" }}>
            <li>
              <strong>Contact Information:</strong> Name, email address, phone
              number, and shipping/billing address when you place an order,
              create an account, or contact us.
            </li>
            <li>
              <strong>Account Information:</strong> When you create an account,
              we collect your name, email address, and a password (stored as a
              hashed value).
            </li>
            <li>
              <strong>Payment Information:</strong> Payment card details and
              billing information. Note: we do not store full credit card
              numbers on our servers. Payment processing is handled by PayPal
              and Stripe, our PCI-compliant payment processors.
            </li>
            <li>
              <strong>Order Information:</strong> Products purchased, order
              history, and shipping preferences.
            </li>
          </ul>
          <h3 style={{ color: "var(--heading)" }}>Automatically Collected Information</h3>
          <ul style={{ color: "var(--body)" }}>
            <li>
              <strong>Usage Data:</strong> Pages visited, time spent on pages,
              products viewed, search queries, and referring URLs.
            </li>
            <li>
              <strong>Device Information:</strong> IP address, browser type,
              operating system, device type, and screen resolution.
            </li>
            <li>
              <strong>Cookies and Tracking:</strong> We use cookies and similar
              technologies (including Google Analytics) to analyze traffic,
              remember preferences, and improve the Site. You can control cookie
              preferences through your browser settings.
            </li>
          </ul>

          <h2 style={{ color: "var(--heading)" }}>3. How We Use Your Information</h2>
          <p style={{ color: "var(--body)" }}>
            We use the information we collect for the following purposes:
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>Process and fulfill your orders, including shipping and returns.</li>
            <li>Communicate with you about your orders, account, and inquiries.</li>
            <li>
              Send transactional emails (order confirmations, shipping updates,
              tracking information).
            </li>
            <li>
              Send marketing communications if you have opted in (you may
              unsubscribe at any time).
            </li>
            <li>Improve our Site, products, and customer experience.</li>
            <li>Detect and prevent fraud, unauthorized transactions, and abuse.</li>
            <li>Comply with legal obligations and enforce our Terms of Service.</li>
          </ul>

          <h2 style={{ color: "var(--heading)" }}>4. How We Share Your Information</h2>
          <p style={{ color: "var(--body)" }}>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information in the following
            circumstances:
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>
              <strong>Service Providers:</strong> We share information with
              trusted third-party service providers who help us operate the Site
              and fulfill orders, including payment processors (PayPal, Stripe),
              shipping carriers (UPS, FedEx), email service providers, hosting
              providers (Vercel), analytics providers (Google Analytics), and
              customer support platforms.
            </li>
            <li>
              <strong>Legal Compliance:</strong> We may disclose information if
              required by law, subpoena, or other legal process, or to protect
              our rights, property, or safety.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of assets, your information may be
              transferred as part of that transaction.
            </li>
          </ul>

          <h2 style={{ color: "var(--heading)" }}>5. Data Security</h2>
          <p style={{ color: "var(--body)" }}>
            We implement industry-standard security measures to protect your
            personal information, including SSL/TLS encryption for data in
            transit, encrypted storage for sensitive data, and access controls
            limiting data access to authorized personnel. However, no method of
            transmission over the Internet or electronic storage is 100% secure.
            We cannot guarantee absolute security.
          </p>

          <h2 style={{ color: "var(--heading)" }}>6. Data Retention</h2>
          <p style={{ color: "var(--body)" }}>
            We retain your personal information for as long as necessary to
            fulfill the purposes described in this policy, including legal,
            accounting, and reporting requirements. Order records are retained
            indefinitely for business records. You may request deletion of your
            account and associated data at any time by contacting us.
          </p>

          <h2 style={{ color: "var(--heading)" }}>7. Your Rights</h2>
          <p style={{ color: "var(--body)" }}>
            Depending on your jurisdiction, you may have the following rights:
          </p>
          <ul style={{ color: "var(--body)" }}>
            <li>
              <strong>Access:</strong> Request a copy of the personal
              information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate or
              incomplete information.
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal
              information, subject to legal retention requirements.
            </li>
            <li>
              <strong>Portability:</strong> Request a copy of your information
              in a structured, machine-readable format.
            </li>
            <li>
              <strong>Opt-Out:</strong> Unsubscribe from marketing
              communications at any time by clicking the unsubscribe link in any
              marketing email or contacting us directly.
            </li>
          </ul>
          <p style={{ color: "var(--body)" }}>
            To exercise any of these rights, please contact us at{" "}
            privacy@flintandbeam.com. We will respond to your request within 30
            days.
          </p>

          <h2 style={{ color: "var(--heading)" }}>8. California Privacy Rights</h2>
          <p style={{ color: "var(--body)" }}>
            If you are a California resident, you have additional rights under
            the California Consumer Privacy Act (CCPA), including the right to
            know what personal information we collect and how we use it, the
            right to request deletion of your personal information, and the
            right to opt out of the sale of personal information (note: we do
            not sell personal information). To exercise your CCPA rights, please
            contact us at privacy@flintandbeam.com.
          </p>

          <h2 style={{ color: "var(--heading)" }}>9. GDPR (European Users)</h2>
          <p style={{ color: "var(--body)" }}>
            If you are located in the European Economic Area (EEA) or the United
            Kingdom, you have additional rights under the General Data
            Protection Regulation (GDPR), including the right to access,
            rectify, erase, restrict processing, data portability, and object to
            processing. The legal basis for processing your data includes
            contract performance (order fulfillment), legitimate interest (Site
            improvement, fraud prevention), and consent (marketing
            communications). For GDPR inquiries, contact privacy@flintandbeam.com.
          </p>

          <h2 style={{ color: "var(--heading)" }}>10. Children's Privacy</h2>
          <p style={{ color: "var(--body)" }}>
            Our Site is not intended for children under 16 years of age. We do
            not knowingly collect personal information from children under 16.
            If you believe a child has provided us with personal information,
            please contact us immediately, and we will delete it.
          </p>

          <h2 style={{ color: "var(--heading)" }}>11. Third-Party Links</h2>
          <p style={{ color: "var(--body)" }}>
            Our Site may contain links to third-party websites, including social
            media platforms and payment processors. We are not responsible for
            the privacy practices or content of these third-party sites. We
            encourage you to review the privacy policies of any third-party
            sites you visit.
          </p>

          <h2 style={{ color: "var(--heading)" }}>12. Changes to This Policy</h2>
          <p style={{ color: "var(--body)" }}>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated "Last updated" date. We will
            notify you of material changes via email or a prominent notice on
            the Site. Your continued use of the Site after changes are posted
            constitutes acceptance of the updated policy.
          </p>

          <h2 style={{ color: "var(--heading)" }}>13. Contact Us</h2>
          <p style={{ color: "var(--body)" }}>
            If you have questions about this Privacy Policy or our data
            practices, please contact us:
          </p>
          <div style={{ color: "var(--body)" }}>
            <p>
              <strong>Email:</strong> privacy@flintandbeam.com
            </p>
            <p>
              <strong>Mail:</strong> Flint & Beam, 421 Spain Street, Sonoma, CA
              95476
            </p>
            <p>
              <strong>Phone:</strong> (707) 555-0147
            </p>
          </div>
        </div>
      </section>

      {/* Custom prose styles */}
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
