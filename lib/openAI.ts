import OpenAI from "openai";
import { encodingForModel, Tiktoken } from "js-tiktoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const MODEL = "gpt-4o-mini";

export async function chatCompletion({
  messages,
  temperature = 0.7,
  max_tokens = 200,
}: {
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}) {
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    temperature,
    max_tokens,
  });

  const content = res.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from OpenAI");
  return content;
}

export async function summarizeConversation(
  messages: { role: string; content: string }[]
) {
  let enc: Tiktoken | undefined;
  try {
    enc = encodingForModel(MODEL as any);
  } catch {
    return "";
  }

  let totalTokens = 0;
  for (const msg of messages) {
    totalTokens += enc.encode(msg.content).length;
  }

  if (totalTokens < 6000) return "";

  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "Summarize the following customer support conversation concisely. Preserve key facts, issues mentioned, and any resolutions.",
      },
      ...messages,
    ] as OpenAI.Chat.ChatCompletionMessageParam[],
    temperature: 0.3,
    max_tokens: 500,
  });

  return res.choices?.[0]?.message?.content?.trim() ?? "";
}
