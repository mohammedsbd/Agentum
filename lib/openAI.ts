const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
const FALLBACK_MODELS = [
  GEMINI_MODEL,
  "gemini-flash-lite-latest",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
].filter((model, index, models) => models.indexOf(model) === index);

type ChatMessage = { role: string; content: string };

type GeminiPart = { text?: string };

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
};

function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is required.");
  return apiKey;
}

function toGeminiPayload(
  messages: ChatMessage[],
  temperature: number,
  maxOutputTokens: number
) {
  const systemInstruction = messages
    .filter((msg) => msg.role === "system" && msg.content.trim())
    .map((msg) => msg.content.trim())
    .join("\n\n");

  const contents = messages
    .filter((msg) => msg.role !== "system" && msg.content.trim())
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

  return {
    ...(systemInstruction && {
      system_instruction: { parts: [{ text: systemInstruction }] },
    }),
    contents:
      contents.length > 0
        ? contents
        : [{ role: "user", parts: [{ text: "Hello" }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  };
}

export async function chatCompletion({
  messages,
  temperature = 0.7,
  max_tokens = 200,
}: {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}) {
  const errors: string[] = [];

  for (const model of FALLBACK_MODELS) {
    try {
      return await generateWithGeminiModel(model, messages, temperature, max_tokens);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${model}: ${message}`);
      console.error("Gemini model failed:", { model, message });
    }
  }

  throw new Error(`All Gemini models failed. ${errors.join(" | ")}`);
}

async function generateWithGeminiModel(
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxOutputTokens: number
) {
  const res = await fetch(
    `${GEMINI_API_BASE}/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getGeminiApiKey(),
      },
      body: JSON.stringify(toGeminiPayload(messages, temperature, maxOutputTokens)),
    }
  );

  const data = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    throw new Error(data.error?.message || `Gemini request failed: ${res.status}`);
  }

  const content = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!content) {
    const reason =
      data.promptFeedback?.blockReason ||
      data.candidates?.[0]?.finishReason ||
      "empty response";
    throw new Error(`Empty response from Gemini: ${reason}`);
  }

  return content;
}

function roughTokenCount(messages: ChatMessage[]) {
  return messages.reduce((total, msg) => total + Math.ceil(msg.content.length / 4), 0);
}

function transcript(messages: ChatMessage[]) {
  return messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n");
}

export async function summarizeConversation(messages: ChatMessage[]) {
  if (roughTokenCount(messages) < 6000) return "";

  return chatCompletion({
    messages: [
      {
        role: "system",
        content:
          "Summarize the following customer support conversation concisely. Preserve key facts, issues mentioned, and any resolutions.",
      },
      {
        role: "user",
        content: transcript(messages),
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });
}
