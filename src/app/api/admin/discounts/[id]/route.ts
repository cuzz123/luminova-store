// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function checkAdminAccess(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if ((session.user as unknown as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const { id } = await params;

    const existing = await db.discountCode.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Discount code not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const allowedFields = [
      "code",
      "type",
      "value",
      "label",
      "minSubtotal",
      "maxUses",
      "expiresAt",
      "firstOrderOnly",
      "isActive",
    ];

    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        switch (field) {
          case "code":
            if (typeof body.code !== "string" || !body.code.trim()) {
              return NextResponse.json(
                { error: "Code must be a non-empty string" },
                { status: 400 }
              );
            }
            updateData.code = body.code.trim().toUpperCase();
            break;
          case "type":
            if (!["PERCENTAGE", "FIXED"].includes(body.type)) {
              return NextResponse.json(
                { error: "Type must be PERCENTAGE or FIXED" },
                { status: 400 }
              );
            }
            updateData.type = body.type;
            break;
          case "value":
            if (typeof body.value !== "number" || body.value <= 0) {
              return NextResponse.json(
                { error: "Value must be a positive number" },
                { status: 400 }
              );
            }
            updateData.value = body.value;
            break;
          case "label":
            updateData.label = body.label?.trim() || null;
            break;
          case "minSubtotal":
            updateData.minSubtotal =
              body.minSubtotal !== null && body.minSubtotal !== undefined
                ? Number(body.minSubtotal)
                : null;
            break;
          case "maxUses":
            updateData.maxUses =
              body.maxUses !== null && body.maxUses !== undefined
                ? Number(body.maxUses)
                : null;
            break;
          case "expiresAt":
            updateData.expiresAt = body.expiresAt
              ? new Date(body.expiresAt)
              : null;
            break;
          case "firstOrderOnly":
            updateData.firstOrderOnly = Boolean(body.firstOrderOnly);
            break;
          case "isActive":
            updateData.isActive = Boolean(body.isActive);
            break;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // If code is being changed, check for duplicates
    if (updateData.code && updateData.code !== existing.code) {
      const duplicate = await db.discountCode.findUnique({
        where: { code: updateData.code as string },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: `Discount code "${updateData.code}" already exists` },
          { status: 409 }
        );
      }
    }

    const discount = await db.discountCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ discount }, { status: 200 });
  } catch (error) {
    console.error("Admin discount update error:", error);
    return NextResponse.json(
      { error: "Failed to update discount code" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const { id } = await params;

    const existing = await db.discountCode.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Discount code not found" },
        { status: 404 }
      );
    }

    await db.discountCode.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: `Discount code "${existing.code}" deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin discount delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete discount code" },
      { status: 500 }
    );
  }
}
