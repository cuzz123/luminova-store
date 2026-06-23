import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
      50
    );
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    const orders = await db.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    const total = await db.order.count({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        orders,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User orders error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred fetching orders" },
      { status: 500 }
    );
  }
}
