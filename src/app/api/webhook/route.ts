// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource_type: string;
  resource: {
    id: string;
    state?: string;
    purchase_units?: Array<{
      reference_id?: string;
      payments?: {
        captures?: Array<{
          id: string;
          status: string;
        }>;
      };
    }>;
  };
  create_time: string;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error("PayPal credentials not configured");
  }

  const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function verifyWebhookSignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

    const transmissionId = request.headers.get("paypal-transmission-id");
    const transmissionTime = request.headers.get("paypal-transmission-time");
    const certUrl = request.headers.get("paypal-cert-url");
    const authAlgo = request.headers.get("paypal-auth-algo");
    const transmissionSig = request.headers.get("paypal-transmission-sig");
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig || !webhookId) {
      console.warn("Missing PayPal webhook verification headers");
      return false;
    }

    const verifyRes = await fetch(`${base}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });

    const result = await verifyRes.json();
    return result.verification_status === "SUCCESS";
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
}

async function capturePayPalOrder(paypalOrderId: string): Promise<void> {
  const accessToken = await getPayPalAccessToken();
  const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

  const res = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${errorText}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature in production
    if (process.env.NODE_ENV === "production") {
      const isVerified = await verifyWebhookSignature(request, body);
      if (!isVerified) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 403 }
        );
      }
    }

    const event: PayPalWebhookEvent = JSON.parse(body);
    const { event_type, resource } = event;

    console.log(`PayPal webhook received: ${event_type}`);

    switch (event_type) {
      case "CHECKOUT.ORDER.APPROVED": {
        // Capture the PayPal order automatically
        const paypalOrderId = resource.id;
        await capturePayPalOrder(paypalOrderId);
        break;
      }

      case "PAYMENT.CAPTURE.COMPLETED": {
        const paypalOrderId = resource.id;
        const captureId =
          resource.purchase_units?.[0]?.payments?.captures?.[0]?.id;

        // Find and update our order
        const order = await db.order.findFirst({
          where: {
            paypalOrderId: paypalOrderId,
            status: { in: ["PENDING", "PROCESSING"] },
          },
          include: { items: true },
        });

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              paypalOrderId: paypalOrderId,
              paypalCaptureId: captureId || null,
            },
          });

          // Update discount code usage count if one was applied
          if (order.discountLabel) {
            const discount = await db.discountCode.findFirst({
              where: { label: order.discountLabel },
            });
            if (discount) {
              await db.discountCode.update({
                where: { id: discount.id },
                data: { usedCount: { increment: 1 } },
              });
            }
          }

          // Send confirmation email
          if (order.shippingAddress && typeof order.shippingAddress === "object") {
            const shipping = order.shippingAddress as Record<string, unknown>;
            const customerEmail =
              (shipping.email as string) || "";

            if (customerEmail) {
              try {
                await sendOrderConfirmation({
                  orderId: order.id,
                  email: customerEmail,
                  customerName: (shipping.name as string) || "Customer",
                  items: order.items.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                  })),
                  total: order.total,
                  shippingAddress: shipping as Record<string, string>,
                });
              } catch (emailError) {
                console.error("Failed to send confirmation email:", emailError);
              }
            }
          }
        } else {
          console.warn(
            `No pending order found for PayPal order: ${paypalOrderId}`
          );
        }
        break;
      }

      case "PAYMENT.CAPTURE.REFUNDED": {
        const paypalOrderId = resource.id;

        const order = await db.order.findFirst({
          where: { paypalOrderId: paypalOrderId },
        });

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: { status: "REFUNDED" },
          });
        }
        break;
      }

      default: {
        console.log(`Unhandled PayPal webhook event: ${event_type}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
