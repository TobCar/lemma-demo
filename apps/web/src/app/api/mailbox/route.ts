import { NextResponse } from "next/server";
import { mailItems } from "@/data/mailbox";

// Auth is enforced by the middleware — no per-route check needed.
export async function GET() {
  return NextResponse.json(mailItems);
}
