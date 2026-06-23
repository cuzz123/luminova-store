import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.code || typeof body.subtotal !== "number") {
      return NextResponse.json(
        { valid: false, message: "Discount code and subtotal are required" },
        { status: 400 }
      );
    }

    const { code, subtotal } = body as { code: string; subtotal: number };

    if (subtotal < 0) {
      return NextResponse.json(
        { valid: false, message: "Subtotal must be a positive number" },
        { status: 400 }
      );
    }

    const discount = await db.discountCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!discount) {
      return NextResponse.json(
        { valid: false, message: "Discount code not found" },
        { status: 200 }
      );
    }

    if (!discount.isActive) {
      return NextResponse.json(
        { valid: false, message: "This discount code is no longer active" },
        { status: 200 }
      );
    }

    const now = new Date();
    if (discount.expiresAt && discount.expiresAt < now) {
      return NextResponse.json(
        { valid: false, message: "This discount code has expired" },
        { status: 200 }
      );
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json(
        { valid: false, message: "This discount code has reached its maximum usage limit" },
        { status: 200 }
      );
    }

    if (discount.minSubtotal && subtotal < discount.minSubtotal) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum purchase of $${discount.minSubtotal.toFixed(2)} required for this code`,
        },
        { status: 200 }
      );
    }

    if (discount.firstOrderOnly) {
      return NextResponse.json(
        {
          valid: true,
          discount: 0,
          type: discount.type,
          label: discount.label || discount.code,
          requiresFirstOrder: true,
          message: "This code is valid but applies only to first-time orders",
        },
        { status: 200 }
      );
    }

    const discountAmount =
      discount.type === "PERCENTAGE"
        ? Math.round((subtotal * discount.value) / 100 * 100) / 100
        : discount.value;

    return NextResponse.json(
      {
        valid: true,
        discount: discountAmount,
        type: discount.type,
        label: discount.label || discount.code,
        value: discount.value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Discount validation error:", error);
    return NextResponse.json(
      { valid: false, message: "An unexpected error occurred validating the discount code" },
      { status: 500 }
    );
  }
}
