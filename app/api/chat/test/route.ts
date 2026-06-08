import { NextResponse } from "next/server";
import { chatCompletion, summarizeConversation } from "@/lib/openAI";
import { retrieveContext } from "@/lib/rag/retrieve";
import { formatChunkForPrompt } from "@/lib/rag/format";
import { isAuthorized } from "@/lib/isAuthorized";

export async function POST(req: Request) {
  const user = await isAuthorized();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, knowledge_source_ids } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const query = lastMessage?.content || "";

  let contextBlock = "";
  if (knowledge_source_ids?.length > 0 && query) {
    try {
      const chunks = await retrieveContext({
        query,
        sourceIds: knowledge_source_ids,
        userEmail: user.email,
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

  const summary = await summarizeConversation(messages);

  let finalMessages: { role: string; content: string }[];
  if (summary) {
    finalMessages = [
      {
        role: "system",
        content: `Your name is Sarah. You are a friendly customer support assistant. Keep answers short and conversational.${contextBlock ? `\n\nUse the following information from the knowledge base to answer the question. If the information doesn't contain what you need, say so politely and offer to help with something else. When using information from a source, briefly cite the source name.\n${contextBlock}` : "\n\nYou don't have specific knowledge base information for this query. Be honest and offer to help with other topics."}`,
      },
      { role: "system", content: `Summary of the conversation so far:\n${summary}` },
      lastMessage,
    ];
  } else {
    finalMessages = [
      {
        role: "system",
        content: `Your name is Sarah. You are a friendly customer support assistant. Keep answers short and conversational.${contextBlock ? `\n\nUse the following information from the knowledge base to answer the question. If the information doesn't contain what you need, say so politely and offer to help with something else. When using information from a source, briefly cite the source name.\n${contextBlock}` : "\n\nYou don't have specific knowledge base information for this query. Be honest and offer to help with other topics."}`,
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

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("Chat completion error:", error);
    return NextResponse.json(
      { response: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
