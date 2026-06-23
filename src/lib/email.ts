/* ------------------------------------------------------------------ */
/*  Flint & Beam — Transactional Email via Resend                      */
/*                                                                     */
/*  Requires RESEND_API_KEY in environment.                             */
/*  All emails send from: Flint & Beam <hello@flintandbeam.com>         */
/*  Brand: Jost font, sand + dark colors, clean modern layout.         */
/* ------------------------------------------------------------------ */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "Flint & Beam <hello@flintandbeam.com>";

/* ------------------------------------------------------------------ */
/*  Brand style constants                                             */
/* ------------------------------------------------------------------ */

const BRAND = {
  colors: {
    sand: "#D4C3A3",
    sandLight: "#F5F0E8",
    dark: "#1A1A1A",
    darkMuted: "#3A3A3A",
    white: "#FFFFFF",
    accent: "#B8956A",
    success: "#6B8E6B",
    muted: "#8C8C8C",
  },
  fontFamily: "'Jost', 'Helvetica Neue', Arial, sans-serif",
};

function baseHtml(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: ${BRAND.colors.sandLight};
      font-family: ${BRAND.fontFamily};
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 560px;
      margin: 40px auto;
      background: ${BRAND.colors.white};
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    }
    .header {
      background: ${BRAND.colors.dark};
      padding: 36px 40px;
      text-align: center;
    }
    .header h1 {
      color: ${BRAND.colors.white};
      font-size: 22px;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .header .brand-dot {
      color: ${BRAND.colors.sand};
    }
    .body {
      padding: 40px;
      color: ${BRAND.colors.darkMuted};
      font-size: 15px;
      line-height: 1.7;
    }
    .body h2 {
      color: ${BRAND.colors.dark};
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px;
    }
    .body p {
      margin: 0 0 16px;
    }
    .button {
      display: inline-block;
      background: ${BRAND.colors.dark};
      color: ${BRAND.colors.white} !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.3px;
      margin: 8px 0;
      border: none;
    }
    .button-secondary {
      display: inline-block;
      background: transparent;
      color: ${BRAND.colors.dark} !important;
      text-decoration: underline;
      font-weight: 500;
      font-size: 14px;
    }
    .divider {
      border: none;
      border-top: 1px solid ${BRAND.colors.sandLight};
      margin: 28px 0;
    }
    .footer {
      text-align: center;
      padding: 24px 40px;
      background: ${BRAND.colors.sandLight};
      font-size: 12px;
      color: ${BRAND.colors.muted};
    }
    .footer a {
      color: ${BRAND.colors.accent};
      text-decoration: none;
    }
    .order-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    .order-table th {
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${BRAND.colors.muted};
      padding: 8px 0;
      border-bottom: 2px solid ${BRAND.colors.sandLight};
    }
    .order-table td {
      padding: 10px 0;
      border-bottom: 1px solid ${BRAND.colors.sandLight};
      font-size: 14px;
    }
    .order-total {
      font-size: 18px;
      font-weight: 700;
      color: ${BRAND.colors.dark};
    }
    .highlight-box {
      background: ${BRAND.colors.sandLight};
      border-left: 4px solid ${BRAND.colors.sand};
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
    }
    .code {
      display: inline-block;
      background: ${BRAND.colors.dark};
      color: ${BRAND.colors.sand};
      padding: 6px 16px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 2px;
      margin: 8px 0;
    }
    .inline-items {
      list-style: none;
      padding: 0;
      margin: 12px 0;
    }
    .inline-items li {
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid ${BRAND.colors.sandLight};
    }
    .item-image {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      object-fit: cover;
      margin-right: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Flint<span class="brand-dot">&middot;</span>&amp;<span class="brand-dot">&middot;</span>Beam</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Flint &amp; Beam. All rights reserved.</p>
      <p>123 Design District, Portland, OR 97201</p>
      <p>
        <a href="https://flintandbeam.com/privacy">Privacy</a>
        &nbsp;&middot;&nbsp;
        <a href="https://flintandbeam.com/terms">Terms</a>
        &nbsp;&middot;&nbsp;
        <a href="https://flintandbeam.com/unsubscribe">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Helper: Format currency                                           */
/* ------------------------------------------------------------------ */

function fmt(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/* ------------------------------------------------------------------ */
/*  sendOrderConfirmation                                            */
/* ------------------------------------------------------------------ */

export async function sendOrderConfirmation(order: {
  id: string;
  email: string;
  items: Array<{
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
}): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("Resend not configured — skipping order confirmation email.");
    return { success: false, error: "Resend API key not configured" };
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="display:flex;align-items:center;gap:12px;">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" class="item-image" />`
            : ""
        }
        <div>
          <strong>${item.name}</strong><br/>
          <span style="color:${BRAND.colors.muted};font-size:13px;">Qty: ${item.quantity}</span>
        </div>
      </td>
      <td style="text-align:right;">${fmt(item.price * item.quantity)}</td>
    </tr>`,
    )
    .join("");

  const content = `
    <h2>Thank You for Your Order</h2>
    <p>Your order <strong>#${order.id}</strong> has been confirmed and is being prepared. We'll send you another email when it ships.</p>

    <div class="highlight-box">
      <strong>Shipping to:</strong><br/>
      ${order.shippingAddress.name}<br/>
      ${order.shippingAddress.line1}${order.shippingAddress.line2 ? `<br/>${order.shippingAddress.line2}` : ""}<br/>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
    </div>

    <h2>Order Summary</h2>
    <table class="order-table">
      <thead>
        <tr><th>Item</th><th style="text-align:right;">Price</th></tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <hr class="divider" />

    <table style="width:100%;">
      <tr><td style="color:${BRAND.colors.muted};">Subtotal</td><td style="text-align:right;">${fmt(order.subtotal)}</td></tr>
      <tr><td style="color:${BRAND.colors.muted};">Shipping</td><td style="text-align:right;">${fmt(order.shipping)}</td></tr>
      <tr><td style="color:${BRAND.colors.muted};">Tax</td><td style="text-align:right;">${fmt(order.tax)}</td></tr>
      <tr><td class="order-total">Total</td><td class="order-total" style="text-align:right;">${fmt(order.total)}</td></tr>
    </table>

    <div style="margin-top: 24px;">
      <a href="https://flintandbeam.com/orders/${order.id}" class="button">View Order</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Order Confirmed — #${order.id}`,
      html: baseHtml(content, `Order Confirmation — #${order.id}`),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
    return { success: false, error: String(error) };
  }
}

/* ------------------------------------------------------------------ */
/*  sendAbandonedCart                                                */
/* ------------------------------------------------------------------ */

export async function sendAbandonedCart(
  email: string,
  items: Array<{
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }>,
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("Resend not configured — skipping abandoned cart email.");
    return { success: false, error: "Resend API key not configured" };
  }

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  const shipping = subtotal >= 149 ? 0 : 12.95;
  const total = subtotal + shipping;

  const itemsHtml = items
    .map(
      (item) => `
    <li>
      <div style="display:flex;align-items:center;gap:12px;">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" class="item-image" />`
            : ""
        }
        <div>
          <strong>${item.name}</strong><br/>
          <span style="color:${BRAND.colors.muted};font-size:13px;">Qty: ${item.quantity}</span>
        </div>
      </div>
      <span>${fmt(item.price * item.quantity)}</span>
    </li>`,
    )
    .join("");

  const content = `
    <h2>Your Cart Is Waiting</h2>
    <p>You left some beautiful pieces behind. They're still available — but they won't wait forever.</p>

    <ul class="inline-items">
      ${itemsHtml}
    </ul>

    <hr class="divider" />

    <table style="width:100%; margin-bottom: 20px;">
      <tr><td style="color:${BRAND.colors.muted};">Subtotal</td><td style="text-align:right;">${fmt(subtotal)}</td></tr>
      <tr><td style="color:${BRAND.colors.muted};">Shipping</td><td style="text-align:right;">${shipping === 0 ? `<span style="color:${BRAND.colors.success};">FREE</span>` : fmt(shipping)}</td></tr>
      <tr><td class="order-total" style="font-size:16px;">Estimated Total</td><td class="order-total" style="font-size:16px;text-align:right;">${fmt(total)}</td></tr>
    </table>

    ${
      shipping > 0
        ? `<p style="font-size:13px;color:${BRAND.colors.muted};">Free shipping on orders over ${fmt(149)} — you're only ${fmt(149 - subtotal)} away!</p>`
        : `<p style="font-size:13px;color:${BRAND.colors.success};">Free shipping applied!</p>`
    }

    <a href="https://flintandbeam.com/cart" class="button">Return to Cart</a>
    <br/><br/>
    <a href="https://flintandbeam.com/shop" class="button-secondary">Continue Shopping</a>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "You left something behind at Flint & Beam",
      html: baseHtml(content, "Your Cart Is Waiting — Flint & Beam"),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send abandoned cart email:", error);
    return { success: false, error: String(error) };
  }
}

/* ------------------------------------------------------------------ */
/*  sendContactNotification                                          */
/* ------------------------------------------------------------------ */

export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn(
      "Resend not configured — skipping contact notification.",
    );
    return { success: false, error: "Resend API key not configured" };
  }

  const content = `
    <h2>New Contact Form Message</h2>

    <div class="highlight-box">
      <strong>From:</strong> ${data.name}<br/>
      <strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a><br/>
      <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </div>

    <h2>Message</h2>
    <p style="white-space:pre-wrap;background:${BRAND.colors.sandLight};padding:20px;border-radius:6px;">${data.message}</p>

    <a href="mailto:${data.email}" class="button">Reply to ${data.name}</a>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: "hello@flintandbeam.com",
      replyTo: data.email,
      subject: `New message from ${data.name} via Flint & Beam`,
      html: baseHtml(content, `Contact: ${data.name} — Flint & Beam`),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send contact notification:", error);
    return { success: false, error: String(error) };
  }
}

/* ------------------------------------------------------------------ */
/*  sendNewsletterWelcome                                            */
/* ------------------------------------------------------------------ */

export async function sendNewsletterWelcome(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn(
      "Resend not configured — skipping newsletter welcome email.",
    );
    return { success: false, error: "Resend API key not configured" };
  }

  const content = `
    <h2>Welcome to Flint &amp; Beam</h2>
    <p>Thank you for joining our newsletter. We're excited to share our latest collections, design inspiration, and member-only offers with you.</p>

    <div class="highlight-box" style="text-align:center;">
      <p style="margin:0;font-weight:600;">As a welcome gift, enjoy</p>
      <p style="font-size:28px;font-weight:700;margin:8px 0;color:${BRAND.colors.dark};">10% Off</p>
      <p style="margin:0 0 12px;">your first order</p>
      <span class="code">WELCOME10</span>
      <p style="margin:12px 0 0;font-size:13px;color:${BRAND.colors.muted};">Use at checkout. Valid for 30 days.</p>
    </div>

    <h2>What to Expect</h2>
    <ul style="padding-left:20px;line-height:2;">
      <li>New arrivals and early access to limited editions</li>
      <li>Design tips and styling inspiration from our curators</li>
      <li>Subscriber-only promotions and sale previews</li>
      <li>Seasonal lookbooks delivered to your inbox</li>
    </ul>

    <a href="https://flintandbeam.com/shop" class="button">Start Shopping</a>
    <br/><br/>
    <p style="font-size:13px;color:${BRAND.colors.muted};">Use code <strong>WELCOME10</strong> at checkout for 10% off your first order. Cannot be combined with other offers.</p>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to Flint & Beam — 10% Off Inside",
      html: baseHtml(content, "Welcome — Flint & Beam"),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send newsletter welcome:", error);
    return { success: false, error: String(error) };
  }
}
