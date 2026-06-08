import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

const EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const BATCH_SIZE = 64;

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const res = await hf.featureExtraction({
      model: EMBED_MODEL,
      inputs: batch,
    });
    out.push(...(res as number[][]));
  }
  return out;
}

export async function embedQuery(query: string): Promise<number[]> {
  const res = await hf.featureExtraction({
    model: EMBED_MODEL,
    inputs: query,
  });
  return res as number[];
}
