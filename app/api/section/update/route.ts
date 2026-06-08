import { db } from "@/db/client";
import { sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { sql, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sourceId }: { sourceId: string } = await req.json();

    if (!sourceId) {
      return NextResponse.json(
        { error: "sourceId is required" },
        { status: 400 }
      );
    }

    // First, find all sections that reference this source
    const affected = await db
      .select({ id: sections.id, source_ids: sections.source_ids })
      .from(sections)
      .where(
        sql`${sections.user_email} = ${user.email} AND ${sourceId} = ANY(${sections.source_ids})`
      );

    if (affected.length === 0) {
      return NextResponse.json(
        { message: "Source not connected to any sections" },
        { status: 200 }
      );
    }

    // Update each section to remove the sourceId from source_ids
    for (const section of affected) {
      const updatedIds = section.source_ids.filter((id: string) => id !== sourceId);
      await db
        .update(sections)
        .set({ source_ids: updatedIds })
        .where(eq(sections.id, section.id));
    }

    return NextResponse.json({
      message: `Source disconnected from ${affected.length} section(s)`,
      updated: affected.length,
    });
  } catch (error) {
    console.error("Error disconnecting source:", error);
    return NextResponse.json(
      { error: "Failed to disconnect source" },
      { status: 500 }
    );
  }
}
