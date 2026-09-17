import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

// Receives Content-Security-Policy-Report-Only violation reports set by
// src/middleware.ts's `report-uri` directive. Report-only, so nothing here
// ever blocks a request — this is purely a diagnostic feed while the policy
// is still being tuned. See docs/ARCHITECTURE.md Phase 8.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const report = body?.["csp-report"];

  if (report) {
    logger.warn("csp violation", {
      documentUri: report["document-uri"],
      violatedDirective: report["violated-directive"],
      blockedUri: report["blocked-uri"],
      sourceFile: report["source-file"],
      lineNumber: report["line-number"],
    });
  }

  return new NextResponse(null, { status: 204 });
}
