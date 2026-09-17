import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

// Receives Web Vitals metrics reported by src/components/global/WebVitalsReporter.tsx
// via useReportWebVitals. See docs/ARCHITECTURE.md Phase 8.
export async function POST(req: NextRequest) {
  const metric = await req.json().catch(() => null);

  if (metric?.name && typeof metric.value === "number") {
    logger.info("web vital", {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      label: metric.label,
      path: req.nextUrl.searchParams.get("path"),
    });
  }

  return new NextResponse(null, { status: 204 });
}
