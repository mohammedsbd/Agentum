import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db/client";
import { chatBotMetadata, knowledge_source, sections } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const { payload } = await jwtVerify(token, secret);
    const widgetId = payload.widgetId as string;
    const ownerEmail = payload.ownerEmail as string;

    const [meta] = await db
      .select()
      .from(chatBotMetadata)
      .where(eq(chatBotMetadata.id, widgetId))
      .limit(1);

    if (!meta) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const userSections = await db
      .select()
      .from(sections)
      .where(eq(sections.user_email, ownerEmail));

    const readySources = await db
      .select({ id: knowledge_source.id })
      .from(knowledge_source)
      .where(
        and(
          eq(knowledge_source.user_email, ownerEmail),
          eq(knowledge_source.status, "active"),
          eq(knowledge_source.extraction_status, "ready")
        )
      );
    const readySourceIds = new Set(readySources.map((source) => source.id));
    const readySections = userSections
      .map((section) => ({
        ...section,
        source_ids: section.source_ids.filter((id) => readySourceIds.has(id)),
      }))
      .filter((section) => section.source_ids.length > 0);

    return NextResponse.json({
      metadata: { ...meta, mode: meta.mode ?? "text" },
      sections: readySections,
    });
  } catch (error) {
    console.error("Config Fetch Error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
