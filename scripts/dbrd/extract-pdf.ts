/**
 * Extrahiert Fließtext aus den DBRD-PDFs und schreibt zeilenweise JSON-Arrays.
 *
 * Aufruf:
 *   pnpm dbrd:extract-pdf
 *   pnpm exec tsx scripts/dbrd/extract-pdf.ts
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { PDFParse } from "pdf-parse";

import { repoRoot, writeJsonFile } from "./common";

const PDF_ALGORITHMS = path.join(repoRoot, "data", "dbrd-source", "pdf", "dbrd-algorithms.pdf");
const PDF_MEDICATIONS = path.join(repoRoot, "data", "dbrd-source", "pdf", "dbrd-medications.pdf");

const OUT_ALGORITHMS = path.join(repoRoot, "data", "dbrd-source", "raw", "algorithms.raw.json");
const OUT_MEDICATIONS = path.join(repoRoot, "data", "dbrd-source", "raw", "medications.raw.json");

function die(message: string, cause?: unknown): never {
  console.error("[dbrd-extract-pdf] FEHLER:", message);
  if (cause !== undefined) {
    console.error(cause);
  }
  process.exit(1);
}

/** \r entfernen, nach \n splitten, trimmen, leere Zeilen verwerfen. */
function normalizePdfTextToLines(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

async function extractLinesFromPdf(filePath: string): Promise<string[]> {
  let buffer: Buffer;
  try {
    buffer = readFileSync(filePath);
  } catch (e) {
    die(`PDF nicht lesbar: ${path.relative(repoRoot, filePath)}`, e);
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return normalizePdfTextToLines(result.text);
  } catch (e) {
    die(`PDF-Text extrahieren fehlgeschlagen: ${path.relative(repoRoot, filePath)}`, e);
  } finally {
    try {
      await parser.destroy();
    } catch {
      /* ignore */
    }
  }
}

async function main(): Promise<void> {
  const algorithmsLines = await extractLinesFromPdf(PDF_ALGORITHMS);
  const medicationsLines = await extractLinesFromPdf(PDF_MEDICATIONS);

  writeJsonFile(OUT_ALGORITHMS, algorithmsLines);
  writeJsonFile(OUT_MEDICATIONS, medicationsLines);

  console.log(
    `[dbrd-extract-pdf] algorithms: ${algorithmsLines.length} Zeilen → ${path.relative(repoRoot, OUT_ALGORITHMS)}`,
  );
  console.log(
    `[dbrd-extract-pdf] medications: ${medicationsLines.length} Zeilen → ${path.relative(repoRoot, OUT_MEDICATIONS)}`,
  );
}

main().catch((e) => {
  die("Unerwarteter Fehler", e);
});
