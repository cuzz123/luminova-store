// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { sendNewsletterWelcome } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await applyRateLimit(request, "newsletter", {
      maxRequests: 3,
      windowMs: 60_000, // 1 minute
    });

    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json().catch(() => null);

    if (!body?.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const { email } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await sendNewsletterWelcome({
      email: email.trim().toLowerCase(),
      discountCode: "WELCOME10",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Welcome! Check your inbox for your 10% off discount code.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
