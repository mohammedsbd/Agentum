import { db } from "@/db/client";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import {
  FirecrawlScrapeError,
  WebsiteUrlError,
  ingestWebsiteSource,
  normalizeWebsiteUrl,
} from "@/lib/rag/website";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { business_name, website_url, external_links } = await req.json();

    if (!business_name || !website_url) {
      return NextResponse.json(
        { error: "Missing business name or website URL" },
        { status: 400 }
      );
    }

    const normalizedWebsiteUrl = normalizeWebsiteUrl(website_url);
    const knowledgeSource = await ingestWebsiteSource(
      user.email,
      normalizedWebsiteUrl
    );

    const [existingMetadata] = await db
      .select({ id: metadata.id })
      .from(metadata)
      .where(eq(metadata.user_email, user.email));

    const metadataValues = {
      user_email: user.email,
      business_name,
      website_url: normalizedWebsiteUrl,
      external_links,
    };

    const metadataResponse = existingMetadata
      ? await db
          .update(metadata)
          .set(metadataValues)
          .where(eq(metadata.id, existingMetadata.id))
      : await db.insert(metadata).values(metadataValues);

    (await cookies()).set("metadata", JSON.stringify({ business_name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json(
      { metadataResponse, knowledgeSource },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof WebsiteUrlError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof FirecrawlScrapeError) {
      return NextResponse.json(
        {
          error: "Could not scan this website",
          status: error.status,
          message: error.message,
        },
        { status: 502 }
      );
    }

    console.error("Metadata store error:", error);
    return NextResponse.json(
      { error: "Failed to store organization info" },
      { status: 500 }
    );
  }
}
