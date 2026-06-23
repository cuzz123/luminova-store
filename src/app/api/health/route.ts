import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let dbStatus: "connected" | "disconnected" = "disconnected";

  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (error) {
    console.error("DB health check failed:", error);
    dbStatus = "disconnected";
  }

  const status = dbStatus === "connected" ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      db: dbStatus,
      timestamp: new Date().toISOString(),
    },
    {
      status: status === "ok" ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
