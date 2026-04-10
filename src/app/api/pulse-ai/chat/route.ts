import { NextRequest, NextResponse } from "next/server";
import { processQuery } from "@/lib/pulse-ai/engine";

/**
 * POST /api/pulse-ai/chat
 *
 * Receives a user message, classifies the query, and returns
 * a structured AI response based on analytics data.
 *
 * Production upgrade path:
 * 1. Authenticate request (JWT / session)
 * 2. Load user's workspace analytics from PostgreSQL
 * 3. Build prompt with analytics context
 * 4. Call Claude API with streaming
 * 5. Return streamed response
 */

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 1000)
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s\u00C0-\u024F?!.,;:'"()\-+%$#@/]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawMessage = body?.message;

    if (!rawMessage || typeof rawMessage !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const message = sanitizeInput(rawMessage);

    if (message.length < 2) {
      return NextResponse.json(
        { error: "Message is too short." },
        { status: 400 }
      );
    }

    // Simulate AI processing delay (200-600ms)
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 400)
    );

    const response = processQuery(message);

    return NextResponse.json({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      query: message,
      response,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process your question. Please try again." },
      { status: 500 }
    );
  }
}
