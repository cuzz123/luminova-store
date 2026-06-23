import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.orderId || !body?.email) {
      return NextResponse.json(
        { error: "orderId and email are required" },
        { status: 400 }
      );
    }

    const { orderId, email } = body;

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status === "PAID") {
      return NextResponse.json(
        { error: "Order is already marked as paid" },
        { status: 409 }
      );
    }

    // Mark order as paid
    await db.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    // Send confirmation email
    if (order.shippingAddress && typeof order.shippingAddress === "object") {
      const shipping = order.shippingAddress as Record<string, unknown>;

      try {
        await sendOrderConfirmation({
          orderId: order.id,
          email: email,
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

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        status: "PAID",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order notification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred processing the payment notification" },
      { status: 500 }
    );
  }
}
