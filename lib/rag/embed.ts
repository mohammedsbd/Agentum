const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
const EMBED_DIMENSIONS = 384;

type GeminiEmbedResponse = {
  embedding?: {
    values?: number[];
  };
  error?: {
    message?: string;
  };
};

function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is required for embeddings.");
  return apiKey;
}

async function embedOne(text: string): Promise<number[]> {
  const res = await fetch(
    `${GEMINI_API_BASE}/models/${EMBED_MODEL}:embedContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getGeminiApiKey(),
      },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        outputDimensionality: EMBED_DIMENSIONS,
      }),
    }
  );

  const data = (await res.json()) as GeminiEmbedResponse;
  if (!res.ok) {
    throw new Error(data.error?.message || `Gemini embedding failed: ${res.status}`);
  }

  const values = data.embedding?.values;
  if (!values || values.length !== EMBED_DIMENSIONS) {
    throw new Error(
      `Gemini embedding returned ${values?.length ?? 0} dimensions, expected ${EMBED_DIMENSIONS}.`
    );
  }

  return values;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const vectors: number[][] = [];
  for (const text of texts) {
    vectors.push(await embedOne(text));
  }
  return vectors;
}

export async function embedQuery(query: string): Promise<number[]> {
  return embedOne(query);
}
