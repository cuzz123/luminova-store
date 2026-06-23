import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { sendAbandonedCart } from "@/lib/email";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await applyRateLimit(request, "save-cart", {
      maxRequests: 5,
      windowMs: 60_000, // 1 minute
    });

    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json().catch(() => null);

    if (!body?.email || !body?.cart) {
      return NextResponse.json(
        { error: "Email and cart items are required" },
        { status: 400 }
      );
    }

    const { email, cart } = body as { email: string; cart: CartItem[] };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart must contain at least one item" },
        { status: 400 }
      );
    }

    // Validate cart items
    for (const item of cart) {
      if (!item.productId || !item.name || typeof item.price !== "number" || typeof item.quantity !== "number") {
        return NextResponse.json(
          { error: "Each cart item must have productId, name, price, and quantity" },
          { status: 400 }
        );
      }
      if (item.quantity < 1) {
        return NextResponse.json(
          { error: "Item quantities must be at least 1" },
          { status: 400 }
        );
      }
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await sendAbandonedCart({
      email: email.trim().toLowerCase(),
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
    });

    return NextResponse.json(
      { success: true, message: "Cart saved. Check your email to complete your purchase." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Save cart error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving your cart" },
      { status: 500 }
    );
  }
}
