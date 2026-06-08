import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { embedQuery } from "./embed";
import { rerank, MIN_RELEVANCE_SCORE } from "./rerank";
import type { RetrievedChunk } from "./types";

const CANDIDATE_TOP_K = 20;

type Candidate = {
  id: string;
  source_id: string;
  source_name: string;
  content: string;
  chunk_type: "prose" | "csv_row" | "csv_summary";
  chunk_index: string;
  meta_data: string | null;
};

export async function retrieveContext({
  query,
  sourceIds,
  userEmail,
  topK = 5,
}: {
  query: string;
  sourceIds: string[];
  userEmail: string;
  topK?: number;
}): Promise<RetrievedChunk[]> {
  if (sourceIds.length === 0 || query.trim().length === 0) return [];

  const queryVec = await embedQuery(query);
  const vecLiteral = `[${queryVec.join(",")}]`;

  const sourceIdParams = sql.join(
    sourceIds.map((id) => sql`${id}`),
    sql`, `
  );

  const [vectorRes] = await Promise.all([
    db.execute(sql`
      SELECT k.id, k.source_id, s.name AS source_name, k.content, k.chunk_type,
             k.chunk_index, k.meta_data
      FROM knowledge_chunk k
      JOIN knowledge_source s ON s.id = k.source_id
      WHERE k.source_id = ANY(ARRAY[${sourceIdParams}]::text[])
        AND k.user_email = ${userEmail}
      ORDER BY k.embedding <=> ${vecLiteral}::vector
      LIMIT ${CANDIDATE_TOP_K}
    `),
  ]);

  const vectorRows: Candidate[] =
    ((vectorRes as any).rows ?? (vectorRes as any)) as Candidate[];

  if (vectorRows.length === 0) {
    console.log("[retrieve] empty after vector search", { query, sourceIds });
    return [];
  }

  const reranked = await rerank(
    query,
    vectorRows.map((c) => c.content),
    topK
  );

  if (reranked === null) {
    return vectorRows.slice(0, topK).map((c) => toRetrievedChunk(c, 0));
  }

  const filtered = reranked.filter((r) => r.relevance >= MIN_RELEVANCE_SCORE);
  if (filtered.length === 0) {
    console.log("[retrieve] all below threshold", {
      query,
      topScore: reranked[0]?.relevance ?? 0,
    });
    return [];
  }

  console.log("[retrieve] ok", {
    query_len: query.length,
    vector_hits: vectorRows.length,
    top_rerank_score: filtered[0].relevance,
    returned: filtered.length,
  });

  return filtered.map((r) => toRetrievedChunk(vectorRows[r.index], r.relevance));
}

function toRetrievedChunk(c: Candidate, relevance: number): RetrievedChunk {
  const meta = c.meta_data ? JSON.parse(c.meta_data) : {};
  return {
    content: c.content,
    sourceName: c.source_name,
    sourceId: c.source_id,
    chunkIndex: parseInt(c.chunk_index, 10),
    chunkType: c.chunk_type,
    pageNumber: meta.pageNumber,
    csvRowIndex: meta.csvRowIndex,
    rerankScore: relevance,
  };
}
