import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function checkAdminAccess(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if ((session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const discounts = await db.discountCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ discounts }, { status: 200 });
  } catch (error) {
    console.error("Admin discounts list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch discount codes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      code,
      type,
      value,
      label,
      minSubtotal,
      maxUses,
      expiresAt,
      firstOrderOnly,
      isActive,
    } = body;

    // Validate required fields
    if (!code?.trim()) {
      return NextResponse.json(
        { error: "Discount code is required" },
        { status: 400 }
      );
    }

    if (!type || !["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be PERCENTAGE or FIXED" },
        { status: 400 }
      );
    }

    if (typeof value !== "number" || value <= 0) {
      return NextResponse.json(
        { error: "Value must be a positive number" },
        { status: 400 }
      );
    }

    if (type === "PERCENTAGE" && value > 100) {
      return NextResponse.json(
        { error: "Percentage discount cannot exceed 100%" },
        { status: 400 }
      );
    }

    const upperCode = code.trim().toUpperCase();

    // Check for duplicate
    const existing = await db.discountCode.findUnique({
      where: { code: upperCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Discount code "${upperCode}" already exists` },
        { status: 409 }
      );
    }

    const discount = await db.discountCode.create({
      data: {
        code: upperCode,
        type,
        value,
        label: label?.trim() || upperCode,
        minSubtotal: minSubtotal ?? null,
        maxUses: maxUses ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        firstOrderOnly: firstOrderOnly ?? false,
        isActive: isActive ?? true,
        usedCount: 0,
      },
    });

    return NextResponse.json({ discount }, { status: 201 });
  } catch (error) {
    console.error("Admin discount create error:", error);
    return NextResponse.json(
      { error: "Failed to create discount code" },
      { status: 500 }
    );
  }
}
