// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { PRODUCTS } from "@/lib/products";

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShippingInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CheckoutBody {
  cart: CartItem[];
  shipping: ShippingInfo;
  discountCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await applyRateLimit(request, "checkout", {
      maxRequests: 5,
      windowMs: 60_000,
    });

    if (rateLimitResponse) return rateLimitResponse;

    const body: CheckoutBody = await request.json().catch(() => null);
    if (!body?.cart?.length || !body?.shipping) {
      return NextResponse.json(
        { error: "Cart items and shipping information are required" },
        { status: 400 }
      );
    }

    const { cart, shipping, discountCode } = body;

    // Validate required shipping fields
    const requiredShippingFields: (keyof ShippingInfo)[] = [
      "name",
      "email",
      "address",
      "city",
      "state",
      "zip",
      "country",
    ];
    for (const field of requiredShippingFields) {
      if (!shipping[field]?.trim()) {
        return NextResponse.json(
          { error: `Shipping ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate cart items exist and are active
    const validatedItems: Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
    }> = [];

    for (const item of cart) {
      const product = PRODUCTS.find(
        (p) => p.id === item.productId && p.isActive
      );
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.productId}" not found or unavailable` },
          { status: 400 }
        );
      }
      if (item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json(
          { error: `Invalid quantity for "${product.name}"` },
          { status: 400 }
        );
      }
      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    // Calculate subtotal
    const subtotal = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate discount
    let discountAmount = 0;
    let appliedDiscountLabel: string | null = null;

    if (discountCode) {
      const discount = await db.discountCode.findUnique({
        where: { code: discountCode.toUpperCase() },
      });

      if (discount && discount.isActive) {
        const now = new Date();
        if (
          (!discount.expiresAt || discount.expiresAt > now) &&
          (!discount.maxUses || discount.usedCount < discount.maxUses) &&
          (!discount.minSubtotal || subtotal >= discount.minSubtotal)
        ) {
          discountAmount =
            discount.type === "PERCENTAGE"
              ? (subtotal * discount.value) / 100
              : discount.value;
          appliedDiscountLabel = discount.label || discount.code;
        }
      }
    }

    // Shipping calculation
    const shippingCost = subtotal >= 149 ? 0 : 9.99;
    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    // Calculate tax (let's keep it at 0 for now — will be calculated per state later)
    const taxRate = 0;
    const taxAmount = Math.round(((subtotal - discountAmount) * taxRate + Number.EPSILON) * 100) / 100;

    // Create order in DB
    const order = await db.order.create({
      data: {
        status: "PENDING",
        subtotal: Math.round((subtotal + Number.EPSILON) * 100) / 100,
        discountAmount: Math.round((discountAmount + Number.EPSILON) * 100) / 100,
        taxAmount,
        shippingCost: Math.round((shippingCost + Number.EPSILON) * 100) / 100,
        total: Math.round((total + Number.EPSILON) * 100) / 100,
        shippingAddress: shipping,
        discountLabel: appliedDiscountLabel,
        items: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        total: order.total,
        paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during checkout" },
      { status: 500 }
    );
  }
}
