import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const c = await cookies();

  c.set("user_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  c.set("metadata", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_WEBSITE_URI || "http://localhost:3000"));
}
