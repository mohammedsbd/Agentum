import { db } from "@/db/client";
import { knowledge_source, sections } from "@/db/schema";
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

    // Remove the source from all sections' source_ids arrays
    await db.execute(sql`
      UPDATE sections
      SET source_ids = array_remove(source_ids, ${sourceId})
      WHERE user_email = ${user.email}
        AND ${sourceId} = ANY(source_ids)
    `);

    // Delete the knowledge source (chunks cascade-delete)
    await db
      .delete(knowledge_source)
      .where(
        sql`${knowledge_source.id} = ${sourceId} AND ${knowledge_source.user_email} = ${user.email}`
      );

    return NextResponse.json({ message: "Source deleted successfully" });
  } catch (error) {
    console.error("Error deleting source:", error);
    return NextResponse.json(
      { error: "Failed to delete source" },
      { status: 500 }
    );
  }
}
