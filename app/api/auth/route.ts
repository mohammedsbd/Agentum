import scalekit from "@/lib/scalekit";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    const state = crypto.randomBytes(16).toString("hex");
    c.set("sk_state", state, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    const redirectUri = process.env.SCALEKIT_REDIRECT_URI!;

    const options = {
      scopes: ["openid", "profile", "email", "offline_access"],
      state,
      prompt: "login",
    };

    const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, options);

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 }
    );
  }
}
