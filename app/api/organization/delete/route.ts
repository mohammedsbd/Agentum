import { db } from "@/db/client";
import {
  chatBotMetadata,
  conversation,
  knowledge_source,
  messages,
  metadata,
  sections,
  teamMembers,
  user,
} from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const currentUser = await isAuthorized();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, organization_id } = currentUser;

    const meta = await db
      .select()
      .from(metadata)
      .where(eq(metadata.user_email, email));

    if (meta.length === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const sourceIds = await db
      .select({ id: knowledge_source.id })
      .from(knowledge_source)
      .where(eq(knowledge_source.user_email, email));

    const ids = sourceIds.map((s) => s.id);

    if (ids.length > 0) {
      await db.delete(knowledge_source).where(inArray(knowledge_source.id, ids));
    }

    await db.delete(sections).where(eq(sections.user_email, email));

    await db.delete(chatBotMetadata).where(eq(chatBotMetadata.user_email, email));

    await db.delete(teamMembers).where(eq(teamMembers.organization_id, organization_id));

    const convs = await db
      .select({ id: conversation.id })
      .from(conversation)
      .where(eq(conversation.chatbot_id, email));

    const convIds = convs.map((c) => c.id);

    if (convIds.length > 0) {
      await db.delete(messages).where(inArray(messages.conversation_id, convIds));
      await db.delete(conversation).where(inArray(conversation.id, convIds));
    }

    await db.delete(user).where(eq(user.email, email));

    await db.delete(metadata).where(eq(metadata.user_email, email));

    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_WEBSITE_URI || "http://localhost:3000"));
    response.headers.append(
      "Set-Cookie",
      "user_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax"
    );
    response.headers.append(
      "Set-Cookie",
      "metadata=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
    );

    return response;
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json({ error: "Failed to delete workspace" }, { status: 500 });
  }
}
