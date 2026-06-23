// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await applyRateLimit(request, "contact", {
      maxRequests: 3,
      windowMs: 5 * 60_000, // 5 minutes
    });

    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, email, message, subject } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    await sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      subject: subject?.trim() || "New Contact Form Submission",
    });

    return NextResponse.json(
      { success: true, message: "Your message has been sent. We will get back to you soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
