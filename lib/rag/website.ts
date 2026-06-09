import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ingestSource } from "./ingest";

export class FirecrawlScrapeError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "FirecrawlScrapeError";
    this.status = status;
  }
}

export class WebsiteUrlError extends Error {
  constructor(message = "Please enter a valid URL (e.g. https://example.com).") {
    super(message);
    this.name = "WebsiteUrlError";
  }
}

export function normalizeWebsiteUrl(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    throw new WebsiteUrlError();
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new WebsiteUrlError("Only HTTP and HTTPS URLs are supported");
  }

  parsed.hash = "";
  parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";

  return parsed.toString().replace(/\/$/, "");
}

export async function findExistingWebsiteSource(userEmail: string, url: string) {
  const normalizedUrl = normalizeWebsiteUrl(url);
  const sources = await db
    .select({
      id: knowledge_source.id,
      source_url: knowledge_source.source_url,
    })
    .from(knowledge_source)
    .where(
      and(
        eq(knowledge_source.user_email, userEmail),
        eq(knowledge_source.type, "website")
      )
    );

  return (
    sources.find((source) => {
      if (!source.source_url) return false;

      try {
        return normalizeWebsiteUrl(source.source_url) === normalizedUrl;
      } catch {
        return source.source_url.replace(/\/$/, "") === url.trim().replace(/\/$/, "");
      }
    }) || null
  );
}

export async function scrapeWebsiteMarkdown(url: string) {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, formats: ["markdown"] }),
  });

  const json = (await res.json().catch(() => null)) as
    | { success: true; data: { markdown: string } }
    | { success: false; error?: string }
    | null;

  if (!res.ok || !json || json.success !== true) {
    throw new FirecrawlScrapeError(
      res.status,
      (json && !json.success && json.error) || "Unknown Firecrawl error"
    );
  }

  return json.data.markdown;
}

export async function ingestWebsiteSource(userEmail: string, url: string) {
  const normalizedUrl = normalizeWebsiteUrl(url);
  const existingSource = await findExistingWebsiteSource(userEmail, normalizedUrl);

  if (existingSource) {
    return { sourceId: existingSource.id, created: false };
  }

  const markdown = await scrapeWebsiteMarkdown(normalizedUrl);
  const result = await ingestSource({
    type: "website",
    userEmail,
    url: normalizedUrl,
    markdown,
  });

  return { sourceId: result.sourceId, created: true };
}
