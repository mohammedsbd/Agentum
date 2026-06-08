import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db/client";
import { conversation } from "@/db/schema";
import { messages as messagesTable } from "@/db/schema";
import { chatCompletion, summarizeConversation } from "@/lib/openAI";
import { retrieveContext } from "@/lib/rag/retrieve";
import { formatChunkForPrompt } from "@/lib/rag/format";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Missing session token" }, { status: 401 });
  }

  let sessionId: string;
  let widgetId: string;
  let ownerEmail: string;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    sessionId = payload.sessionId as string;
    widgetId = payload.widgetId as string;
    ownerEmail = payload.ownerEmail as string;

    if (!sessionId || !widgetId || !ownerEmail) {
      throw new Error("Invalid Token Payload");
    }
  } catch (error) {
    console.error("Token Verification Failed:", error);
    return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
  }

  let { messages, knowledge_source_ids } = await req.json();

  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== "user") {
    console.log("No new user message detected or invalid format");
  }

  // Persist conversation + user message
  try {
    const [existingConv] = await db
      .select()
      .from(conversation)
      .where(eq(conversation.id, sessionId))
      .limit(1);

    if (!existingConv) {
      const forwardedFor = req.headers.get("x-forwarded-for");
      const ip = forwardedFor ? forwardedFor.split(",")[0] : "Unknown IP";
      const visitorName = `#Visitor(${ip})`;

      await db.insert(conversation).values({
        id: sessionId,
        chatbot_id: widgetId,
        visitor_ip: ip,
        name: visitorName,
      });

      const previousMessages = messages.slice(0, -1);
      for (const msg of previousMessages) {
        await db.insert(messagesTable).values({
          conversation_id: sessionId,
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      }
    }

    if (lastMessage && lastMessage.role === "user") {
      await db.insert(messagesTable).values({
        conversation_id: sessionId,
        role: "user",
        content: lastMessage.content,
      });
    }
  } catch (error) {
    console.error("Database Persistence Error (User):", error);
  }

  // Retrieve relevant context from knowledge base
  const query = lastMessage?.content || "";
  let contextBlock = "";

  if (knowledge_source_ids?.length > 0 && query) {
    try {
      const chunks = await retrieveContext({
        query,
        sourceIds: knowledge_source_ids,
        userEmail: ownerEmail,
        topK: 5,
      });
      if (chunks.length > 0) {
        contextBlock =
          "\n\nRelevant information from the knowledge base:\n" +
          chunks.map((c, i) => formatChunkForPrompt(c, i + 1)).join("\n\n");
      }
    } catch (error) {
      console.error("RAG retrieval error:", error);
    }
  }

  // Summarize conversation history if it exceeds token limits
  const summary = await summarizeConversation(messages);

  let finalMessages: { role: string; content: string }[];
  if (summary) {
    finalMessages = [
      {
        role: "system",
        content: `Your name is Sarah. You are a friendly customer support assistant for ${ownerEmail.split("@")[0]}'s business. Keep answers short and conversational.${contextBlock ? `\n\nUse the following information from the knowledge base to answer the customer's question. If the information doesn't contain what you need, say so politely and offer to help with something else. When using information from a source, briefly cite the source name.\n${contextBlock}` : "\n\nYou don't have specific knowledge base information for this query. Be honest and offer to help with other topics."}`,
      },
      {
        role: "system",
        content: `Summary of the conversation so far:\n${summary}`,
      },
      lastMessage,
    ];
  } else {
    finalMessages = [
      {
        role: "system",
        content: `Your name is Sarah. You are a friendly customer support assistant for ${ownerEmail.split("@")[0]}'s business. Keep answers short and conversational.${contextBlock ? `\n\nUse the following information from the knowledge base to answer the customer's question. If the information doesn't contain what you need, say so politely and offer to help with something else. When using information from a source, briefly cite the source name.\n${contextBlock}` : "\n\nYou don't have specific knowledge base information for this query. Be honest and offer to help with other topics."}`,
      },
      ...messages,
    ];
  }

  try {
    const reply = await chatCompletion({
      messages: finalMessages,
      temperature: 0.7,
      max_tokens: 300,
    });

    try {
      await db.insert(messagesTable).values({
        conversation_id: sessionId,
        role: "assistant",
        content: reply,
      });
    } catch (error) {
      console.error("Database Persistence Error (AI):", error);
    }

    return NextResponse.json({ response: reply });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat completion error:", error);
    return NextResponse.json({ response: "An error occurred.", detail: msg }, { status: 500 });
  }
}
