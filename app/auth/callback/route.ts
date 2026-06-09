import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const callbackUrl = new URL("/api/auth/callback", req.url);
  callbackUrl.search = req.nextUrl.search;

  return NextResponse.redirect(callbackUrl);
}
