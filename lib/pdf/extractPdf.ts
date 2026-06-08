import {
  PdfCorruptError,
  PdfEncryptedError,
  PdfImageOnlyError,
  PdfTooLargeError,
} from "./errors";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const MAX_PAGES = 30;
const MIN_TOTAL_TEXT_CHARS = 100;
const execFileAsync = promisify(execFile);

export async function extractPdfText(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  // Lazy-load the legacy ES build; importing at module scope drags
  // pdfjs setup into every cold start that touches this file's imports.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  let doc: any;
  try {
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      isEvalSupported: false,
      useSystemFonts: true,
    });
    doc = await loadingTask.promise;
  } catch (err: any) {
    if (
      err?.name === "PasswordException" ||
      /password/i.test(err?.message ?? "")
    ) {
      throw new PdfEncryptedError();
    }
    return extractPdfTextWithPoppler(buffer, err);
  }

  try {
    const pageCount: number = doc.numPages;
    if (pageCount > MAX_PAGES) {
      throw new PdfTooLargeError(pageCount);
    }

    const pageTexts: string[] = [];
    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => (typeof item.str === "string" ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pageTexts.push(`--- Page ${i} ---\n\n${pageText}`);
    }

    const text = pageTexts.join("\n\n").trim();

    const totalTextChars = text
      .replace(/--- Page \d+ ---/g, "")
      .replace(/\s/g, "").length;

    if (totalTextChars < MIN_TOTAL_TEXT_CHARS) {
      return extractPdfTextWithPoppler(buffer, new PdfImageOnlyError());
    }

    return { text, pageCount };
  } finally {
    await doc.destroy().catch(() => {});
  }
}

async function extractPdfTextWithPoppler(
  buffer: Buffer,
  cause?: unknown
): Promise<{ text: string; pageCount: number }> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agentum-pdf-"));
  const filePath = path.join(dir, "source.pdf");

  try {
    await writeFile(filePath, buffer);
    const { stdout } = await execFileAsync(
      "pdftotext",
      ["-layout", filePath, "-"],
      {
        maxBuffer: 20 * 1024 * 1024,
        timeout: 60_000,
      }
    );

    const rawPages = stdout.split("\f");
    const pageTexts = rawPages
      .map((page) => page.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const pageCount = Math.max(pageTexts.length, 1);

    if (pageCount > MAX_PAGES) {
      throw new PdfTooLargeError(pageCount);
    }

    const totalTextChars = pageTexts.join("")
      .replace(/\s/g, "")
      .length;

    if (totalTextChars < MIN_TOTAL_TEXT_CHARS) {
      throw new PdfImageOnlyError();
    }

    const text = pageTexts
      .map((pageText, index) => `--- Page ${index + 1} ---\n\n${pageText}`)
      .join("\n\n")
      .trim();

    return { text, pageCount };
  } catch (err) {
    if (err instanceof PdfTooLargeError || err instanceof PdfImageOnlyError) {
      throw err;
    }
    throw new PdfCorruptError(cause instanceof Error ? cause : err);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
